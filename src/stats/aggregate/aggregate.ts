import { ChangedFile, Commit, ExpandedCommit } from "../../interfaces.js";

export type AggregateStrategy = "year-month" | "year-quarter";
export type FilePath = string;
type AggregateKey = string;

type CommitToAggregateKey = (commit: Commit) => AggregateKey;

export type AggregateFileData<T> = Record<FilePath, Record<AggregateKey, T>>;

interface AggregateOptions {
  strategy: AggregateStrategy;
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
  const quarter = Math.max(Math.ceil(commitDate.getMonth() / 3), 1);
  return `${commitDate.getFullYear()}-Q${quarter}`;
};

export abstract class Aggregate<T> {
  private files: Record<FilePath, Record<AggregateKey, T>> = {};
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

  abstract initializeValue(): T;
  abstract incrementValue(
    currentValue: T,
    changedFile: ChangedFile,
    expandedCommit: ExpandedCommit
  ): T;

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
        this.files[file.path][aggregateKey] = this.initializeValue();
      }
      this.files[file.path][aggregateKey] = this.incrementValue(
        this.files[file.path][aggregateKey],
        file,
        expandedCommit
      );
    }
  }
  public getData(): AggregateFileData<T> {
    return this.files;
  }
  public listFiles(): FilePath[] {
    return Object.keys(this.files);
  }
  public listAggregates(filePath: FilePath): AggregateKey[] {
    return Object.keys(this.files[filePath]);
  }
  public getValue(filePath: FilePath, aggregateKey: AggregateKey): T {
    return this.files[filePath][aggregateKey];
  }
  public displayReport(): string {
    return "TODO: report will be here";
  }
}
