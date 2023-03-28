import { ExpandedCommit } from "../interfaces.js";
export declare function getNumberOfContributorsPerFile(
  commits: ExpandedCommit[]
): Record<string, number>;
