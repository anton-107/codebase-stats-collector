import { ExpandedCommit } from "../interfaces.js";

interface GetNumberOfChangesPerFileOptions {
  fileIgnorePattern?: string;
}

export function getNumberOfChangesPerFile(
  commits: ExpandedCommit[],
  options: GetNumberOfChangesPerFileOptions = {}
): Record<string, number> {
  const changedFiles: Record<string, number> = {};
  commits.forEach((commit) => {
    commit.changedFiles.forEach((file) => {
      if (options.fileIgnorePattern) {
        const regexp = new RegExp(options.fileIgnorePattern);
        if (regexp.test(file.path)) {
          return;
        }
      }
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
