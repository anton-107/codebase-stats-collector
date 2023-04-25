import { ExpandedCommit } from "../interfaces.js";
export interface Contributor {
    name: string;
    numberOfChanges: number;
    firstChangeTimestamp: number;
    lastChangeTimestamp: number;
}
export declare function getListOfContributorsPerFile(commits: ExpandedCommit[]): Record<string, Contributor[]>;
