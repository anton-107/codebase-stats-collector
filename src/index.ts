import { GitRepository } from "./git-reader/git-repository.js";
import { ExpandedCommit } from "./interfaces.js";
import { getListOfContributorsPerFile } from "./stats/list-of-contributors-per-file.js";
import { getNumberOfChangesPerFile } from "./stats/number-of-changes-per-file.js";
import { getNumberOfCommitsByAuthor } from "./stats/number-of-commits-by-author.js";
import { getNumberOfContributorsPerFile } from "./stats/number-of-contributors-per-file.js";

export function log(arg1: string, arg2: object) {
  // eslint-disable-next-line no-console
  console.log(arg1, arg2);
}
export function time(timerName: string) {
  // eslint-disable-next-line no-console
  console.time(timerName);
}
export function timeLog(timerName: string) {
  // eslint-disable-next-line no-console
  console.timeLog(timerName);
}

async function collectCommitsByAuthor(repo: GitRepository) {
  const commits = await repo.getListOfCommits();
  const commitsByAuthor = getNumberOfCommitsByAuthor(commits);
  log("commitsByAuthor", commitsByAuthor);
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
  const repo = new GitRepository(dir);
  log("Getting a list of changed files", { dir });
  const commitsWithChangedFiles = await repo.getListOfCommitsWithChangedFiles();
  log("Finished fetching a list of changed files", {
    numberOfFiles: commitsWithChangedFiles.length,
  });
  await collectCommitsByAuthor(repo);
  await collectHotFiles(commitsWithChangedFiles);
  await collectKnowledgeGaps(commitsWithChangedFiles);
  await collectDetailedContributorsPerFile(commitsWithChangedFiles);
}
main();
