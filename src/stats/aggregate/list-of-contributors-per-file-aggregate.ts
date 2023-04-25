import { ChangedFile, ExpandedCommit } from "../../interfaces.js";
import { Contributor } from "../list-of-contributors-per-file.js";
import { Aggregate, FilePath } from "./aggregate.js";

export class ListOfContributorsPerFileAggregate extends Aggregate<
  Contributor[]
> {
  private contributorsPerFile: Record<FilePath, Contributor[]> = {};
  initializeValue(): Contributor[] {
    return [];
  }
  incrementValue(
    currentValue: Contributor[],
    changedFile: ChangedFile,
    expandedCommit: ExpandedCommit
  ): Contributor[] {
    const commitAuthor = expandedCommit.commit.commit.author.name;
    const commitTimestamp = expandedCommit.commit.commit.author.timestamp;

    if (!this.contributorsPerFile[changedFile.path]) {
      this.contributorsPerFile[changedFile.path] = [];
    }

    let contributor = this.contributorsPerFile[changedFile.path].find(
      (x) => x.name === commitAuthor
    );
    if (!contributor) {
      contributor = {
        name: commitAuthor,
        numberOfChanges: 0,
        firstChangeTimestamp: commitTimestamp,
        lastChangeTimestamp: commitTimestamp,
      };
      this.contributorsPerFile[changedFile.path].push(contributor);
    }
    contributor.numberOfChanges += 1;
    if (contributor.firstChangeTimestamp > commitTimestamp) {
      contributor.firstChangeTimestamp = commitTimestamp;
    }
    if (contributor.lastChangeTimestamp < commitTimestamp) {
      contributor.lastChangeTimestamp = commitTimestamp;
    }
    this.contributorsPerFile[changedFile.path].sort((a, b) => {
      if (a.firstChangeTimestamp < b.firstChangeTimestamp) {
        return -1;
      }
      if (a.lastChangeTimestamp > b.lastChangeTimestamp) {
        return 1;
      }
      return 0;
    });
    return this.contributorsPerFile[changedFile.path];
  }
}
