import { ExpandedCommit } from "../interfaces.js";
interface Contributor {
    name: string;
    numberOfChanges: number;
    firstChangeTimestamp: number;
    lastChangeTimestamp: number;
}
export declare function getListOfContributorsPerFile(commits: ExpandedCommit[]): Record<string, Contributor[]>;
export {};
