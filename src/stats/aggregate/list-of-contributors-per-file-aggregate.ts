import { ChangedFile, ExpandedCommit } from "../../interfaces.js";
import { Contributor } from "../list-of-contributors-per-file.js";
import { Aggregate } from "./aggregate.js";

export class ListOfContributorsPerFileAggregate extends Aggregate<
  Contributor[]
> {
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

    let contributor = currentValue.find((x) => x.name === commitAuthor);
    if (!contributor) {
      contributor = {
        name: commitAuthor,
        numberOfChanges: 0,
        firstChangeTimestamp: commitTimestamp,
        lastChangeTimestamp: commitTimestamp,
      };
      currentValue.push(contributor);
    }
    contributor.numberOfChanges += 1;
    if (contributor.firstChangeTimestamp > commitTimestamp) {
      contributor.firstChangeTimestamp = commitTimestamp;
    }
    if (contributor.lastChangeTimestamp < commitTimestamp) {
      contributor.lastChangeTimestamp = commitTimestamp;
    }
    currentValue.sort((a, b) => {
      if (a.firstChangeTimestamp < b.firstChangeTimestamp) {
        return -1;
      }
      if (a.lastChangeTimestamp > b.lastChangeTimestamp) {
        return 1;
      }
      return 0;
    });
    return currentValue;
  }
}
