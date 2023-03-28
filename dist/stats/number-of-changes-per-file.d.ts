import { ExpandedCommit } from "../interfaces.js";
interface GetNumberOfChangesPerFileOptions {
  fileIgnorePattern?: string;
}
export declare function getNumberOfChangesPerFile(
  commits: ExpandedCommit[],
  options?: GetNumberOfChangesPerFileOptions
): Record<string, number>;
export {};
