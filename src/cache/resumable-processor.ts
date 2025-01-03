import fs from "fs/promises";
import path from "path";

interface ProgressCache<R> {
  completedItems: { [key: number]: R };
  lastProcessedIndex: number;
}

export class ResumableProcessor {
  private cachePath: string;
  private snapshotInterval: number;

  constructor(cachePath = ".cache", snapshotInterval = 100) {
    this.cachePath = cachePath;
    this.snapshotInterval = snapshotInterval;
  }

  private async ensureCacheDirectory(): Promise<void> {
    await fs.mkdir(this.cachePath, { recursive: true });
  }

  private getCachePath(jobId: string): string {
    const sanitizedJobId = jobId.replace(/\//g, "-");
    return path.join(this.cachePath, `${sanitizedJobId}.json`);
  }

  private async loadCache<R>(jobId: string): Promise<ProgressCache<R>> {
    try {
      const data = await fs.readFile(this.getCachePath(jobId), "utf-8");
      return JSON.parse(data);
    } catch {
      return { completedItems: {}, lastProcessedIndex: -1 };
    }
  }

  private async saveCache<R>(
    jobId: string,
    cache: ProgressCache<R>
  ): Promise<void> {
    await fs.writeFile(
      this.getCachePath(jobId),
      JSON.stringify(cache, null, 2)
    );
  }

  // eslint-disable-next-line max-params
  async process<T, R>(
    jobId: string,
    items: T[],
    processFn: (item: T) => Promise<R>,
    notifyFn: (result: R) => void
  ): Promise<R[]> {
    await this.ensureCacheDirectory();
    const cache = await this.loadCache<R>(jobId);
    const results: R[] = new Array(items.length);

    // Restore completed items from cache
    for (const [index, value] of Object.entries(cache.completedItems)) {
      const idx = parseInt(index);
      if (idx < items.length) {
        results[idx] = value;
        notifyFn(value);
      }
    }

    // Process remaining items
    for (let i = cache.lastProcessedIndex + 1; i < items.length; i++) {
      results[i] = await processFn(items[i]);
      cache.completedItems[i] = results[i];
      cache.lastProcessedIndex = i;

      // Save snapshot at intervals
      if ((i + 1) % this.snapshotInterval === 0) {
        await this.saveCache(jobId, cache);
      }
    }

    // Final save
    await this.saveCache(jobId, cache);
    return results;
  }

  async clearCache(jobId: string): Promise<void> {
    try {
      await fs.unlink(this.getCachePath(jobId));
    } catch {
      // Ignore if file doesn't exist
    }
  }
}
