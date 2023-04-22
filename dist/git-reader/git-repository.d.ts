/// <reference types="node" resolution-mode="require"/>
import { Readable } from "stream";
import { Commit, ExpandedCommit } from "../interfaces.js";
interface GitReadOptions {
    stream?: Readable;
}
export declare class GitRepository {
    private repoPath;
    constructor(repoPath: string);
    getListOfCommits(): Promise<Commit[]>;
    getListOfCommitsWithChangedFiles(options?: GitReadOptions): Promise<ExpandedCommit[]>;
    private getFilesDiff;
}
export {};
