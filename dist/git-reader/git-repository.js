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
                oid: c.oid,
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
//# sourceMappingURL=git-repository.js.map