import { ChangedFile, ExpandedCommit } from "../../interfaces.js";
import { Aggregate } from "./aggregate.js";
type NumberOfContributors = number;
export declare class NumberOfContributorsPerFileAggregate extends Aggregate<NumberOfContributors> {
    private contributorsPerFile;
    initializeValue(): number;
    incrementValue(currentValue: number, changedFile: ChangedFile, expandedCommit: ExpandedCommit): NumberOfContributors;
}
export {};
