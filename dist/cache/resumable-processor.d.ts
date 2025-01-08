export declare class ResumableProcessor {
    private cachePath;
    private snapshotInterval;
    constructor(cachePath?: string, snapshotInterval?: number);
    private ensureCacheDirectory;
    private getCachePath;
    private loadCache;
    private saveCache;
    process<T, R>(jobId: string, items: T[], processFn: (item: T) => Promise<R>, notifyFn: (result: R) => void): Promise<R[]>;
    clearCache(jobId: string): Promise<void>;
}
