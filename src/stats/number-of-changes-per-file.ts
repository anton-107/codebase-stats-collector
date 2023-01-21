import { ExpandedCommit } from "../interfaces.js";

export function getNumberOfChangesPerFile(
  commits: ExpandedCommit[]
): Record<string, number> {
  const changedFiles: Record<string, number> = {};
  commits.forEach((commit) => {
    commit.changedFiles.forEach((file) => {
      if (!changedFiles[file.path]) {
        changedFiles[file.path] = 0;
      }
      if (file.type !== "equal") {
        changedFiles[file.path] += 1;
      }
    });
  });
  return changedFiles;
}
