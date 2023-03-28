import { Commit, ExpandedCommit } from "../interfaces.js";
export declare class GitRepository {
  private repoPath;
  constructor(repoPath: string);
  getListOfCommits(): Promise<Commit[]>;
  getListOfCommitsWithChangedFiles(): Promise<ExpandedCommit[]>;
  private getFilesDiff;
}
