import { ChangedFile, ExpandedCommit } from "../interfaces.js";

interface Contributor {
  name: string;
  numberOfChanges: number;
  firstChangeTimestamp: number;
  lastChangeTimestamp: number;
}

function setContributorForFile(
  changedFiles: Record<string, Contributor[]>,
  commit: ExpandedCommit,
  file: ChangedFile
) {
  const commitAuthor = commit.commit.commit.author.name;
  const commitTimestamp = commit.commit.commit.author.timestamp;
  if (!changedFiles[file.path]) {
    changedFiles[file.path] = [];
  }
  let contributor = changedFiles[file.path].find(
    (x) => x.name === commitAuthor
  );
  if (!contributor) {
    contributor = {
      name: commitAuthor,
      numberOfChanges: 0,
      firstChangeTimestamp: commitTimestamp,
      lastChangeTimestamp: commitTimestamp,
    };
    changedFiles[file.path].push(contributor);
  }
  contributor.numberOfChanges += 1;
  if (contributor.firstChangeTimestamp > commitTimestamp) {
    contributor.firstChangeTimestamp = commitTimestamp;
  }
  if (contributor.lastChangeTimestamp < commitTimestamp) {
    contributor.lastChangeTimestamp = commitTimestamp;
  }
}

export function getListOfContributorsPerFile(
  commits: ExpandedCommit[]
): Record<string, Contributor[]> {
  const changedFiles: Record<string, Contributor[]> = {};

  commits.forEach((commit) => {
    commit.changedFiles.forEach((file) => {
      if (file.type !== "equal") {
        setContributorForFile(changedFiles, commit, file);
      }
    });
  });

  return changedFiles;
}