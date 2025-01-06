import fs from "fs";
import git from "isomorphic-git";
import { Readable } from "stream";

import { ResumableProcessor } from "../cache/resumable-processor.js";
import { time, timeLog } from "../index.js";
import { ChangedFile, Commit, ExpandedCommit } from "../interfaces.js";

interface GitReadOptions {
  stream?: Readable;
}

export class GitRepository {
  private previousCommit: Commit = null;

  constructor(private repoPath: string) {}

  public async getListOfCommits(): Promise<Commit[]> {
    return await git.log({ fs, dir: this.repoPath });
  }
  public async getListOfCommitsWithChangedFiles(
    options: GitReadOptions = {}
  ): Promise<ExpandedCommit[]> {
    const commits = await this.getListOfCommits();
    time("getListOfCommitsWithChangedFiles");

    const taskProcessor = new ResumableProcessor(".cache", 100);
    const results: ExpandedCommit[] = await taskProcessor.process(
      this.repoPath,
      commits,
      this.getFilesDiffWithCursor.bind(this, options),
      this.updateGitReadStream.bind(this, options)
    );

    timeLog("getListOfCommitsWithChangedFiles");
    return results.filter((x) => x !== null);
  }
  private async getFilesDiffWithCursor(
    options: GitReadOptions = {},
    cursor: Commit
  ): Promise<ExpandedCommit> {
    if (!this.previousCommit) {
      this.previousCommit = cursor;
      return null;
    }
    const taskID = `getFilesDiff-${this.previousCommit.oid}-${cursor.oid}`;
    time(taskID);
    const changedFiles: ChangedFile[] = await this.getFilesDiff(
      this.previousCommit.oid,
      cursor.oid
    );
    timeLog(taskID);

    const result = {
      oid: cursor.oid,
      commit: this.previousCommit,
      changedFiles,
    };

    this.updateGitReadStream(options, result);

    this.previousCommit = cursor;

    return result;
  }
  private updateGitReadStream(
    options: GitReadOptions = {},
    result: ExpandedCommit
  ) {
    if (options.stream) {
      if (result !== null) {
        options.stream.push(result);
      }
    }
  }
  private async getFilesDiff(
    prevOID: string,
    nextOID: string
  ): Promise<ChangedFile[]> {
    return await git.walk({
      fs,
      dir: this.repoPath,
      trees: [git.TREE({ ref: prevOID }), git.TREE({ ref: nextOID })],
      map: async function (filepath, [commitA, commitB]) {
        let aOID = "";
        let bOID = "";
        let aType = "";
        let bType = "";

        // ignore directories
        if (filepath === ".") {
          return;
        }
        if (!commitA && !commitB) {
          return;
        }

        // determine types:
        if (commitA) {
          aType = await commitA.type();
        }
        if (commitB) {
          bType = await commitB.type();
        }
        if (aType === "tree" || bType === "tree") {
          return;
        }

        // fetch commit ids:
        if (commitA) {
          aOID = await commitA.oid();
        }
        if (commitB) {
          bOID = await commitB.oid();
        }

        // determine modification type:
        let type = "equal";
        if (aOID !== bOID) {
          type = "modify";
        }
        if (!aOID) {
          type = "remove";
        }
        if (!bOID) {
          type = "add";
        }

        return {
          path: `/${filepath}`,
          type: type,
        };
      },
    });
  }
}
