import { GitRepository } from "./git-reader/git-repository.js";
import { getNumberOfCommitsByAuthor } from "./stats/number-of-commits-by-author.js";

async function main() {
  const dir = process.env.SOURCE_DIR;
  const repo = new GitRepository(dir);
  const commits = await repo.getListOfCommits();
  const commitsByAuthor = getNumberOfCommitsByAuthor(commits);

  // eslint-disable-next-line no-console
  console.log("commitsByAuthor", commitsByAuthor);
}
main();
