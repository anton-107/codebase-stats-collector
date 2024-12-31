import { Readable } from "stream";

import { AggregateFileContributorsDashboard } from "./dashboard/aggregate-file-contributors-dashboard.js";
import { SummaryDashboard } from "./dashboard/summary-dashboard.js";
import { GitRepository } from "./git-reader/git-repository.js";
import { ExpandedCommit } from "./interfaces.js";
import { ListOfContributorsPerFileAggregate } from "./stats/aggregate/list-of-contributors-per-file-aggregate.js";
import { getListOfContributorsPerFile } from "./stats/list-of-contributors-per-file.js";
import { getNumberOfChangesPerFile } from "./stats/number-of-changes-per-file.js";
import { getNumberOfCommitsByAuthor } from "./stats/number-of-commits-by-author.js";
import { getNumberOfContributorsPerFile } from "./stats/number-of-contributors-per-file.js";

export function log(arg1: string, arg2: object) {
  // eslint-disable-next-line no-console
  console.log(arg1, arg2);
}
export function debug(arg1: string, arg2: object) {
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.debug(arg1, arg2);
  }
}
export function time(timerName: string) {
  // eslint-disable-next-line no-console
  console.time(timerName);
}
export function timeLog(timerName: string) {
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.timeLog(timerName);
  }
}

async function collectHotFiles(commitsWithChangedFiles: ExpandedCommit[]) {
  const commitsPerFile = getNumberOfChangesPerFile(commitsWithChangedFiles);
  log(
    "hot files (files with most changes)",
    Object.keys(commitsPerFile)
      .map((x) => {
        return [x, commitsPerFile[x]];
      })
      .sort((a, b) => Number(b[1]) - Number(a[1]))
  );
}
async function collectKnowledgeGaps(commitsWithChangedFiles: ExpandedCommit[]) {
  const contributorsPerFile = getNumberOfContributorsPerFile(
    commitsWithChangedFiles
  );
  log(
    "knowledge gaps (files with least number of contributors)",
    Object.keys(contributorsPerFile)
      .map((x) => {
        return [x, contributorsPerFile[x]];
      })
      .sort((a, b) => Number(a[1]) - Number(b[1]))
  );
}
async function collectDetailedContributorsPerFile(
  commitsWithChangedFiles: ExpandedCommit[]
) {
  const listOfContributorsPerFile = await getListOfContributorsPerFile(
    commitsWithChangedFiles
  );
  log("detailed contributors for each file", listOfContributorsPerFile);
}

async function main() {
  const dir = process.env.SOURCE_DIR;
  if (!dir) {
    throw new Error("SOURCE_DIR is not set");
  }

  const repo = new GitRepository(dir);
  debug("Getting a list of changed files", { dir });
  const commitsStream = new Readable({
    objectMode: true,
    read() {
      // do nothing.
    },
  });
  const intermediateAggregateMonthly = new ListOfContributorsPerFileAggregate({
    strategy: "year-month",
  });
  const intermediateAggregateQuarterly = new ListOfContributorsPerFileAggregate(
    {
      strategy: "year-quarter",
    }
  );

  commitsStream.on("data", (commit) => {
    debug("Commit", commit);
    intermediateAggregateMonthly.addCommit(commit);
    intermediateAggregateQuarterly.addCommit(commit);

    // log("monthly data: ", intermediateAggregateMonthly.getData());
    const quarterlyDashboard = new AggregateFileContributorsDashboard(
      intermediateAggregateQuarterly.getData()
    );
    log(quarterlyDashboard.displayDashboard(), {});
  });
  commitsStream.on("end", () => {
    log("done reading commits", {});
  });

  // initialize dashboard
  const summaryDashboard = new SummaryDashboard();

  // number of commits by author:
  const commits = await repo.getListOfCommits();
  const commitsByAuthor = getNumberOfCommitsByAuthor(commits);
  summaryDashboard.setNumberOfCommitsPerAuthor(commitsByAuthor);

  const commitsWithChangedFiles = await repo.getListOfCommitsWithChangedFiles({
    stream: commitsStream,
  });
  log("Finished fetching a list of changed files", {
    numberOfFiles: commitsWithChangedFiles.length,
  });
  await collectHotFiles(commitsWithChangedFiles);
  await collectKnowledgeGaps(commitsWithChangedFiles);
  await collectDetailedContributorsPerFile(commitsWithChangedFiles);
}
main();
