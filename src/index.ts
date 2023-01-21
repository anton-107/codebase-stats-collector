import { GitRepository } from "./git-reader/git-repository.js";
import { getNumberOfChangesPerFile } from "./stats/number-of-changes-per-file.js";
import { getNumberOfCommitsByAuthor } from "./stats/number-of-commits-by-author.js";

async function main() {
  const dir = process.env.SOURCE_DIR;
  const repo = new GitRepository(dir);
  const commits = await repo.getListOfCommits();
  const commitsWithChangedFiles = await repo.getListOfCommitsWithChangedFiles();
  const commitsByAuthor = getNumberOfCommitsByAuthor(commits);
  const commitsPerFile = getNumberOfChangesPerFile(commitsWithChangedFiles);

  // eslint-disable-next-line no-console
  console.log("commitsByAuthor", commitsByAuthor);
  // eslint-disable-next-line no-console
  console.log(
    "commitsPerFile",
    Object.keys(commitsPerFile)
      .map((x) => {
        return [x, commitsPerFile[x]];
      })
      .sort((a, b) => Number(b[1]) - Number(a[1]))
  );
}
main();
