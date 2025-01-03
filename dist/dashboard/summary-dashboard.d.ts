import { Commit, Dashboard, ExpandedCommit } from "../interfaces.js";
import { NumberOfCommitsByAuthor } from "../stats/number-of-commits-by-author.js";
export declare class SummaryDashboard {
    private subDashboards;
    private totalNumberOfCommits;
    private newestCommitDate;
    private oldestCommitDate;
    private topAuthorsAllTime;
    private processedNumberOfCommits;
    private processedCommitDate;
    constructor(subDashboards: Dashboard[]);
    setNumberOfCommitsPerAuthor(data: NumberOfCommitsByAuthor): void;
    setCommits(commits: Commit[]): void;
    setCurrentProgress(progressCounter: number, currentCommit: ExpandedCommit): void;
    rerender(): void;
    private render;
}