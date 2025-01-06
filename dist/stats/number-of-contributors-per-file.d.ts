import { ExpandedCommit } from "../interfaces.js";
interface ContributorsSummary {
    filePath: string;
    contributorsNames: string[];
    firstChange: Date;
    lastChange: Date;
    isExistingFile: boolean;
}
export declare function getNumberOfContributorsPerFile(commits: ExpandedCommit[]): ContributorsSummary[];
export {};
