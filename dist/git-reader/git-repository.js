import fs from "fs";
import git from "isomorphic-git";
export class GitRepository {
  repoPath;
  constructor(repoPath) {
    this.repoPath = repoPath;
  }
  async getListOfCommits() {
    return await git.log({ fs, dir: this.repoPath });
  }
  async getListOfCommitsWithChangedFiles() {
    const results = [];
    const commits = await this.getListOfCommits();
    let previousCommit;
    for (const c of commits) {
      if (!previousCommit) {
        previousCommit = c;
        continue;
      }
      const changedFiles = await this.getFilesDiff(previousCommit.oid, c.oid);
      results.push({
        commit: previousCommit,
        changedFiles,
      });
      previousCommit = c;
    }
    return results;
  }
  async getFilesDiff(prevOID, nextOID) {
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
//# sourceMappingURL=git-repository.js.map
