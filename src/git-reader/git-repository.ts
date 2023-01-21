import fs from "fs";
import git from "isomorphic-git";

import { ChangedFile, Commit, ExpandedCommit } from "../interfaces.js";

export class GitRepository {
  constructor(private repoPath: string) {}

  public async getListOfCommits(): Promise<Commit[]> {
    return await git.log({ fs, dir: this.repoPath });
  }
  public async getListOfCommitsWithChangedFiles(): Promise<ExpandedCommit[]> {
    const results: ExpandedCommit[] = [];
    const commits = await this.getListOfCommits();
    let previousCommit;
    for (const c of commits) {
      if (!previousCommit) {
        previousCommit = c;
        continue;
      }

      const changedFiles: ChangedFile[] = await this.getFilesDiff(
        previousCommit.oid,
        c.oid
      );

      results.push({
        commit: previousCommit,
        changedFiles,
      });
    }
    return results;
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
        // ignore directories
        if (filepath === ".") {
          return;
        }
        if (!commitA || !commitB) {
          return;
        }
        if (
          (await commitA.type()) === "tree" ||
          (await commitB.type()) === "tree"
        ) {
          return;
        }

        // generate ids:
        const aOID = await commitA.oid();
        const bOID = await commitB.oid();

        // determine modification type:
        let type = "equal";
        if (aOID !== bOID) {
          type = "modify";
        }
        if (aOID === undefined) {
          type = "add";
        }
        if (bOID === undefined) {
          type = "remove";
        }

        return {
          path: `/${filepath}`,
          type: type,
        };
      },
    });
  }
}
