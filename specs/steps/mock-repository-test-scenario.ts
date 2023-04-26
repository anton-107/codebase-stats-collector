import { Commit, ExpandedCommit } from "../../src/interfaces.js";
import { Aggregate } from "../../src/stats/aggregate/aggregate.js";
import { getListOfContributorsPerFile } from "../../src/stats/list-of-contributors-per-file.js";
import { getNumberOfChangesPerFile } from "../../src/stats/number-of-changes-per-file.js";
import { getNumberOfCommitsByAuthor } from "../../src/stats/number-of-commits-by-author.js";
import { getNumberOfContributorsPerFile } from "../../src/stats/number-of-contributors-per-file.js";

type Contributor = string;

interface MockCommit {
  author: Contributor;
  changedFiles: string[];
  changeTimestamp: number;
}

class MockRepository {
  private commits: MockCommit[] = [];
  public addCommit(commit: MockCommit) {
    this.commits.push(commit);
  }
  public getCommits(): Commit[] {
    return this.commits.map((x) => {
      return {
        oid: "fake-oid",
        payload: "fake-payload",
        commit: {
          message: "fake-message",
          author: { name: x.author, timestamp: x.changeTimestamp },
          committer: { name: x.author, timestamp: x.changeTimestamp },
        },
      };
    });
  }
  public getExpandedCommits(): ExpandedCommit[] {
    return this.commits.map((x) => {
      return {
        oid: "fake-oid",
        commit: {
          oid: "fake-oid",
          payload: "fake-payload",
          commit: {
            message: "fake-message",
            author: { name: x.author, timestamp: x.changeTimestamp },
            committer: { name: x.author, timestamp: x.changeTimestamp },
          },
        },
        changedFiles: x.changedFiles.map((f) => {
          return {
            path: f,
            type: "modify",
          };
        }),
      };
    });
  }
}

export class MockRepositoryTestScenario {
  private currentRepository = new MockRepository();
  private currentContributor: Contributor = "default author";
  private lastResponseMap: Record<
    string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    string | number | Record<string, any>
  >;
  private fileIgnorePattern: string | undefined = undefined;

  public getResponseMap() {
    return this.lastResponseMap;
  }
  public createMockRepository() {
    this.currentRepository = new MockRepository();
  }
  public setCurrentContributor(contributor: Contributor) {
    this.currentContributor = contributor;
  }
  public setFileIgnorePattern(pattern: string): void {
    this.fileIgnorePattern = pattern;
  }
  public commitSingleFileChange(fileName: string, timestamp: number) {
    this.currentRepository.addCommit({
      author: this.currentContributor,
      changedFiles: [fileName],
      changeTimestamp: timestamp,
    });
  }
  public async getNumberOfCommitsByAuthor(): Promise<void> {
    this.lastResponseMap = getNumberOfCommitsByAuthor(
      this.currentRepository.getCommits()
    );
  }
  public async getNumberOfChangesPerFile(): Promise<void> {
    this.lastResponseMap = getNumberOfChangesPerFile(
      this.currentRepository.getExpandedCommits(),
      {
        fileIgnorePattern: this.fileIgnorePattern,
      }
    );
  }
  public async getNumberOfContributorsPerFile(): Promise<void> {
    this.lastResponseMap = getNumberOfContributorsPerFile(
      this.currentRepository.getExpandedCommits()
    );
  }
  public async listNumberOfContributorsPerFile(): Promise<void> {
    const results = getListOfContributorsPerFile(
      this.currentRepository.getExpandedCommits()
    );
    this.lastResponseMap = {};
    Object.keys(results).forEach((k) => {
      this.lastResponseMap[k] = JSON.stringify(results[k]);
    });
  }
  public runCommitsThroughAggregate<T>(aggregate: Aggregate<T>): void {
    const commits = this.currentRepository.getExpandedCommits();
    commits.forEach((c) => aggregate.addCommit(c));
    this.lastResponseMap = aggregate.getData();
  }
}
