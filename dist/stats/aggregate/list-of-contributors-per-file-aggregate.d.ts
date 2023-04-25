import { ChangedFile, ExpandedCommit } from "../../interfaces.js";
import { Contributor } from "../list-of-contributors-per-file.js";
import { Aggregate } from "./aggregate.js";
export declare class ListOfContributorsPerFileAggregate extends Aggregate<Contributor[]> {
    private contributorsPerFile;
    initializeValue(): Contributor[];
    incrementValue(currentValue: Contributor[], changedFile: ChangedFile, expandedCommit: ExpandedCommit): Contributor[];
}
