import { ExpandedCommit } from "../../interfaces.js";
type AggreateStrategy = "year-month" | "year-quarter";
type FilePath = string;
type AggregateKey = string;
type NumberOfChanges = number;
interface AggregateOptions {
    strategy: AggreateStrategy;
}
export declare class NumberOfChangesPerFileAggregate {
    private files;
    private strategy;
    constructor(options: AggregateOptions);
    addCommit(expandedCommit: ExpandedCommit): void;
    getData(): Record<FilePath, Record<AggregateKey, NumberOfChanges>>;
    listFiles(): FilePath[];
    listAggregates(filePath: FilePath): AggregateKey[];
    getNumberOfChanges(filePath: FilePath, aggregateKey: AggregateKey): NumberOfChanges;
}
export {};
