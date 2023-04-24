import { ChangedFile, ExpandedCommit } from "../../interfaces.js";
import { Aggregate, FilePath } from "./aggregate.js";

type NumberOfContributors = number;
type ContributorName = string;

export class NumberOfContributorsPerFileAggregate extends Aggregate<NumberOfContributors> {
  private contributorsPerFile: Record<FilePath, Set<ContributorName>> = {};
  initializeValue(): number {
    return 0;
  }
  incrementValue(
    currentValue: number,
    changedFile: ChangedFile,
    expandedCommit: ExpandedCommit
  ): NumberOfContributors {
    if (!this.contributorsPerFile[changedFile.path]) {
      this.contributorsPerFile[changedFile.path] = new Set();
    }
    this.contributorsPerFile[changedFile.path].add(
      expandedCommit.commit.commit.author.name
    );
    return this.contributorsPerFile[changedFile.path].size;
  }
}
