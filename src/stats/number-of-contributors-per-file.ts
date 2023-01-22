import { ExpandedCommit } from "../interfaces.js";

export function getNumberOfContributorsPerFile(
  commits: ExpandedCommit[]
): Record<string, number> {
  const changedFiles: Record<string, string[]> = {};

  commits.forEach((commit) => {
    commit.changedFiles.forEach((file) => {
      if (!changedFiles[file.path]) {
        changedFiles[file.path] = [];
      }
      if (!changedFiles[file.path].includes(commit.commit.commit.author.name)) {
        changedFiles[file.path].push(commit.commit.commit.author.name);
      }
    });
  });

  const results: Record<string, number> = {};
  Object.keys(changedFiles).forEach((filePath) => {
    results[filePath] = changedFiles[filePath].length;
  });

  return results;
}
