import { ChangedFile, ExpandedCommit } from "../../interfaces.js";
export type AggregateStrategy = "year-month" | "year-quarter" | "year" | "all-time";
export type FilePath = string;
type AggregateKey = string;
export type AggregateFileData<T> = Record<FilePath, Record<AggregateKey, T>>;
interface AggregateOptions {
    strategy: AggregateStrategy;
}
export declare abstract class Aggregate<T> {
    private files;
    private strategy;
    constructor(options: AggregateOptions);
    abstract initializeValue(): T;
    abstract incrementValue(currentValue: T, changedFile: ChangedFile, expandedCommit: ExpandedCommit): T;
    addCommit(expandedCommit: ExpandedCommit): void;
    getData(): AggregateFileData<T>;
    listFiles(): FilePath[];
    listAggregates(filePath: FilePath): AggregateKey[];
    getValue(filePath: FilePath, aggregateKey: AggregateKey): T;
}
export {};
