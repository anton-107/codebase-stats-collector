import { GitRepository } from "./git-reader/git-repository.js";
import { getNumberOfChangesPerFile } from "./stats/number-of-changes-per-file.js";
import { getNumberOfCommitsByAuthor } from "./stats/number-of-commits-by-author.js";
import { getNumberOfContributorsPerFile } from "./stats/number-of-contributors-per-file.js";
async function main() {
  const dir = process.env.SOURCE_DIR;
  const repo = new GitRepository(dir);
  const commits = await repo.getListOfCommits();
  const commitsWithChangedFiles = await repo.getListOfCommitsWithChangedFiles();
  const commitsByAuthor = getNumberOfCommitsByAuthor(commits);
  const commitsPerFile = getNumberOfChangesPerFile(commitsWithChangedFiles);
  const contributorsPerFile = getNumberOfContributorsPerFile(
    commitsWithChangedFiles
  );
  // eslint-disable-next-line no-console
  console.log("commitsByAuthor", commitsByAuthor);
  // eslint-disable-next-line no-console
  console.log(
    "hot files (files with most changes)",
    Object.keys(commitsPerFile)
      .map((x) => {
        return [x, commitsPerFile[x]];
      })
      .sort((a, b) => Number(b[1]) - Number(a[1]))
  );
  // eslint-disable-next-line no-console
  console.log(
    "knowledge gaps (files with least number of contributors)",
    Object.keys(contributorsPerFile)
      .map((x) => {
        return [x, contributorsPerFile[x]];
      })
      .sort((a, b) => Number(a[1]) - Number(b[1]))
  );
}
main();
//# sourceMappingURL=index.js.map
