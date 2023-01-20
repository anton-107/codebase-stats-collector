import { Commit } from "../interfaces.js";

export function getNumberOfCommitsByAuthor(commits: Commit[]) {
  const authors: Record<string, number> = {};
  commits.forEach(commit => {
    if(!authors[commit.commit.author.name]) {
      authors[commit.commit.author.name] = 0;
    }
    authors[commit.commit.author.name] += 1;
  });
  return authors;
}