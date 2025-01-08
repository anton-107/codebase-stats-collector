import { stat } from "node:fs/promises";
import fs from "fs";
import git from "isomorphic-git";
import { ResumableProcessor } from "../cache/resumable-processor.js";
import { time, timeLog } from "../console/console.js";
export class GitRepository {
    repoPath;
    previousCommit = null;
    constructor(repoPath) {
        this.repoPath = repoPath;
    }
    async getListOfCommits() {
        return await git.log({ fs, dir: this.repoPath });
    }
    async getListOfCommitsWithChangedFiles(options = {}) {
        const commits = await this.getListOfCommits();
        time("getListOfCommitsWithChangedFiles");
        const taskProcessor = new ResumableProcessor(".cache", 100);
        const results = await taskProcessor.process(this.repoPath, commits, this.getFilesDiffWithCursor.bind(this, options), this.updateGitReadStream.bind(this, options));
        timeLog("getListOfCommitsWithChangedFiles");
        return results.filter((x) => x !== null);
    }
    async getFilesDiffWithCursor(options = {}, cursor) {
        if (!this.previousCommit) {
            this.previousCommit = cursor;
            return null;
        }
        const taskID = `getFilesDiff-${this.previousCommit.oid}-${cursor.oid}`;
        time(taskID);
        const changedFiles = await this.getFilesDiff(this.previousCommit.oid, cursor.oid);
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
    updateGitReadStream(options = {}, result) {
        if (options.stream) {
            if (result !== null) {
                options.stream.push(result);
            }
        }
    }
    async getFilesDiff(prevOID, nextOID) {
        const files = await git.walk({
            fs,
            dir: this.repoPath,
            trees: [git.TREE({ ref: prevOID }), git.TREE({ ref: nextOID })],
            map: async (filepath, [commitA, commitB]) => {
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
        // check if file exists:
        for (const file of files) {
            file.isExistingFile = await this.checkFileExists(`${this.repoPath}${file.path}`);
        }
        return files;
    }
    async checkFileExists(path) {
        try {
            const stats = await stat(path);
            return stats.isFile();
        }
        catch {
            return false;
        }
    }
}
//# sourceMappingURL=git-repository.js.map