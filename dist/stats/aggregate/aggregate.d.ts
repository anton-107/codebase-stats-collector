import { ChangedFile, ExpandedCommit } from "../../interfaces.js";
type AggreateStrategy = "year-month" | "year-quarter";
export type FilePath = string;
type AggregateKey = string;
interface AggregateOptions {
    strategy: AggreateStrategy;
}
export declare abstract class Aggregate<T> {
    private files;
    private strategy;
    constructor(options: AggregateOptions);
    abstract initializeValue(): T;
    abstract incrementValue(currentValue: T, changedFile: ChangedFile, expandedCommit: ExpandedCommit): T;
    addCommit(expandedCommit: ExpandedCommit): void;
    getData(): Record<FilePath, Record<AggregateKey, T>>;
    listFiles(): FilePath[];
    listAggregates(filePath: FilePath): AggregateKey[];
    getValue(filePath: FilePath, aggregateKey: AggregateKey): T;
}
export {};
