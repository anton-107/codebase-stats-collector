import { ExpandedCommit } from "../interfaces.js";
interface ContributorsSummary {
  filePath: string;
  contributorsNames: string[];
  firstChange: Date;
  lastChange: Date;
  isExistingFile: boolean;
}

export function getNumberOfContributorsPerFile(
  commits: ExpandedCommit[]
): ContributorsSummary[] {
  const changedFiles: Record<string, Set<string>> = {};
  const existingFiles: Record<string, boolean> = {};
  const firstChange: Record<string, number> = {};
  const lastChange: Record<string, number> = {};

  commits.forEach((commit) => {
    commit.changedFiles.forEach((file) => {
      if (file.type === "equal") {
        return;
      }
      if (!changedFiles[file.path]) {
        changedFiles[file.path] = new Set();
      }
      changedFiles[file.path].add(commit.commit.commit.author.name);
      existingFiles[file.path] = file.isExistingFile;

      firstChange[file.path] = Math.min(
        firstChange[file.path] || 1_000_000_000_000,
        commit.commit.commit.author.timestamp
      );
      lastChange[file.path] = Math.max(
        lastChange[file.path] || 0,
        commit.commit.commit.author.timestamp
      );
    });
  });

  const results: ContributorsSummary[] = [];
  Object.keys(changedFiles).forEach((filePath) => {
    results.push({
      filePath,
      contributorsNames: Array.from(changedFiles[filePath].values()),
      firstChange: new Date(firstChange[filePath] * 1000),
      lastChange: new Date(lastChange[filePath] * 1000),
      isExistingFile: existingFiles[filePath],
    });
  });

  return results;
}
