import { Commit, ExpandedCommit } from "../../interfaces.js";

type AggreateStrategy = "year-month" | "year-quarter";
type FilePath = string;
type AggregateKey = string;
type NumberOfChanges = number;

type CommitToAggregateKey = (commit: Commit) => AggregateKey;

interface AggregateOptions {
  strategy: AggreateStrategy;
}

const commitToYearMonth: CommitToAggregateKey = (commit) => {
  const t = commit.commit.author.timestamp;
  const commitDate = new Date(t * 1000);
  return `${commitDate.getFullYear()}-${String(
    commitDate.getMonth() + 1
  ).padStart(2, "0")}`;
};

const commitToYearQuarter: CommitToAggregateKey = (commit) => {
  const t = commit.commit.author.timestamp;
  const commitDate = new Date(t * 1000);
  const quarter = Math.ceil(commitDate.getMonth() / 3) + 1;
  return `${commitDate.getFullYear()}-Q${quarter}`;
};

export class NumberOfChangesPerFileAggregate {
  private files: Record<FilePath, Record<AggregateKey, NumberOfChanges>> = {};
  private strategy: CommitToAggregateKey;

  constructor(options: AggregateOptions) {
    switch (options.strategy) {
      case "year-month":
        this.strategy = commitToYearMonth;
        break;
      case "year-quarter":
        this.strategy = commitToYearQuarter;
        break;
      default:
        throw new Error("Unknown aggregate strategy");
    }
  }

  public addCommit(expandedCommit: ExpandedCommit) {
    const aggregateKey = this.strategy(expandedCommit.commit);
    // iterate through expandedCommit.changedFiles
    for (const file of expandedCommit.changedFiles) {
      if (file.type === "equal") {
        continue;
      }
      if (!this.files[file.path]) {
        this.files[file.path] = {};
      }
      if (!this.files[file.path][aggregateKey]) {
        this.files[file.path][aggregateKey] = 0;
      }
      this.files[file.path][aggregateKey] += 1;
    }
  }
  public getData(): Record<FilePath, Record<AggregateKey, NumberOfChanges>> {
    return this.files;
  }
  public listFiles(): FilePath[] {
    return Object.keys(this.files);
  }
  public listAggregates(filePath: FilePath): AggregateKey[] {
    return Object.keys(this.files[filePath]);
  }
  public getNumberOfChanges(
    filePath: FilePath,
    aggregateKey: AggregateKey
  ): NumberOfChanges {
    return this.files[filePath][aggregateKey];
  }
}
