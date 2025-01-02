import { Commit } from "../interfaces.js";
export type NumberOfCommitsByAuthor = Record<string, number>;
export declare function getNumberOfCommitsByAuthor(commits: Commit[]): NumberOfCommitsByAuthor;
