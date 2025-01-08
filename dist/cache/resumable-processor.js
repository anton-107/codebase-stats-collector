import fs from "fs/promises";
import path from "path";
export class ResumableProcessor {
    cachePath;
    snapshotInterval;
    constructor(cachePath = ".cache", snapshotInterval = 100) {
        this.cachePath = cachePath;
        this.snapshotInterval = snapshotInterval;
    }
    async ensureCacheDirectory() {
        await fs.mkdir(this.cachePath, { recursive: true });
    }
    getCachePath(jobId) {
        const sanitizedJobId = jobId.replace(/\//g, "-");
        return path.join(this.cachePath, `${sanitizedJobId}.json`);
    }
    async loadCache(jobId) {
        try {
            const data = await fs.readFile(this.getCachePath(jobId), "utf-8");
            return JSON.parse(data);
        }
        catch {
            return { completedItems: {}, lastProcessedIndex: -1 };
        }
    }
    async saveCache(jobId, cache) {
        await fs.writeFile(this.getCachePath(jobId), JSON.stringify(cache, null, 2));
    }
    // eslint-disable-next-line max-params
    async process(jobId, items, processFn, notifyFn) {
        await this.ensureCacheDirectory();
        const cache = await this.loadCache(jobId);
        const results = new Array(items.length);
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
    async clearCache(jobId) {
        try {
            await fs.unlink(this.getCachePath(jobId));
        }
        catch {
            // Ignore if file doesn't exist
        }
    }
}
//# sourceMappingURL=resumable-processor.js.map