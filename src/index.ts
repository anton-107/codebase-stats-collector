import { Readable } from "stream";

import { debug, log } from "./console/console.js";
import { AggregateFileContributorsDashboard } from "./dashboard/aggregate-file-contributors-dashboard.js";
import { SummaryDashboard } from "./dashboard/summary-dashboard.js";
import { GitRepository } from "./git-reader/git-repository.js";
import { ExpandedCommit } from "./interfaces.js";
import { ListOfContributorsPerFileAggregate } from "./stats/aggregate/list-of-contributors-per-file-aggregate.js";
import { getNumberOfChangesPerFile } from "./stats/number-of-changes-per-file.js";
import { getNumberOfCommitsByAuthor } from "./stats/number-of-commits-by-author.js";
import { getNumberOfContributorsPerFile } from "./stats/number-of-contributors-per-file.js";

async function collectHotFiles(commitsWithChangedFiles: ExpandedCommit[]) {
  const commitsPerFile = getNumberOfChangesPerFile(commitsWithChangedFiles);
  const data = Object.keys(commitsPerFile).map((x) => {
    return [x, commitsPerFile[x]];
  });
  data.sort((a, b) => Number(b[1]) - Number(a[1]));
  const hotFiles = data.slice(0, 50);
  log("hot files (files with most changes)", hotFiles);
}
async function collectKnowledgeGaps(commitsWithChangedFiles: ExpandedCommit[]) {
  const contributorsPerFile = getNumberOfContributorsPerFile(
    commitsWithChangedFiles
  ).filter((x) => x.isExistingFile);
  log(
    "knowledge gaps (files with least number of contributors)",
    contributorsPerFile
      .sort((a, b) => {
        if (a.contributorsNames.length === b.contributorsNames.length) {
          return a.lastChange.getTime() - b.lastChange.getTime();
        }
        return a.contributorsNames.length - b.contributorsNames.length;
      })
      .slice(0, 50)
  );
}
// function collectDetailedContributorsPerFile(
//   commitsWithChangedFiles: ExpandedCommit[]
// ) {
//   const listOfContributorsPerFile = getListOfContributorsPerFile(
//     commitsWithChangedFiles
//   );
//   log("detailed contributors for each file", listOfContributorsPerFile);
// }

/* eslint-disable-next-line max-lines-per-function, max-statements */
async function main() {
  const dir = process.env.SOURCE_DIR;
  if (!dir) {
    throw new Error("SOURCE_DIR is not set");
  }

  // initialize repo
  const repo = new GitRepository(dir);
  const commitsStream = new Readable({
    objectMode: true,
    read() {
      // do nothing.
    },
  });
  const intermediateAggregateAllTime = new ListOfContributorsPerFileAggregate({
    strategy: "all-time",
  });
  const intermediateAggregateYearly = new ListOfContributorsPerFileAggregate({
    strategy: "year",
  });
  const intermediateAggregateMonthly = new ListOfContributorsPerFileAggregate({
    strategy: "year-month",
  });
  const intermediateAggregateQuarterly = new ListOfContributorsPerFileAggregate(
    {
      strategy: "year-quarter",
    }
  );

  // initialize dashboard
  const allTimeDashboard = new AggregateFileContributorsDashboard(
    intermediateAggregateAllTime.getData()
  );
  const quarterlyDashboard = new AggregateFileContributorsDashboard(
    intermediateAggregateQuarterly.getData()
  );
  const summaryDashboard = new SummaryDashboard([
    allTimeDashboard,
    quarterlyDashboard,
  ]);
  summaryDashboard.startProgress();

  let commitsCounter = 0;
  commitsStream.on("data", (commit: ExpandedCommit) => {
    debug("Commit", commit);

    commitsCounter += 1;
    intermediateAggregateAllTime.addCommit(commit);
    intermediateAggregateYearly.addCommit(commit);
    intermediateAggregateMonthly.addCommit(commit);
    intermediateAggregateQuarterly.addCommit(commit);

    summaryDashboard.setCurrentProgress(commitsCounter, commit);
  });
  commitsStream.on("error", (err) => {
    debug("error reading commits", { err });
  });
  commitsStream.on("end", () => {
    debug("done reading commits", {});
  });
  commitsStream.on("close", () => {
    debug("stream closed", {});
  });

  // number of commits by author:
  const commits = await repo.getListOfCommits();
  summaryDashboard.setCommits(commits);
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
  // collectDetailedContributorsPerFile(commitsWithChangedFiles);
}
main();
