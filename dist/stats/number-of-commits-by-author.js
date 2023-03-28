export function getNumberOfCommitsByAuthor(commits) {
  const authors = {};
  commits.forEach((commit) => {
    if (!authors[commit.commit.author.name]) {
      authors[commit.commit.author.name] = 0;
    }
    authors[commit.commit.author.name] += 1;
  });
  return authors;
}
//# sourceMappingURL=number-of-commits-by-author.js.map
