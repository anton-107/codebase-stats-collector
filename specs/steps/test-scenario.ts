import { Commit, ExpandedCommit } from "../../src/interfaces.js";
import { getNumberOfChangesPerFile } from "./../../src/stats/number-of-changes-per-file.js";
import { getNumberOfCommitsByAuthor } from "./../../src/stats/number-of-commits-by-author.js";

type Contributor = string;

interface MockCommit {
  author: Contributor;
  changedFiles: string[];
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
          author: { name: x.author },
          committer: { name: x.author },
        },
      };
    });
  }
  public getExpandedCommits(): ExpandedCommit[] {
    return this.commits.map((x) => {
      return {
        commit: {
          oid: "fake-oid",
          payload: "fake-payload",
          commit: {
            message: "fake-message",
            author: { name: x.author },
            committer: { name: x.author },
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

export class TestScenario {
  private currentRepository = new MockRepository();
  private currentContributor: Contributor = "default author";
  private lastResponseMap: Record<string, string | number>;

  public getResponseMap() {
    return this.lastResponseMap;
  }
  public createMockRepository() {
    this.currentRepository = new MockRepository();
  }
  public setCurrentContributor(contributor: Contributor) {
    this.currentContributor = contributor;
  }
  public commitSingleFileChange(fileName: string) {
    this.currentRepository.addCommit({
      author: this.currentContributor,
      changedFiles: [fileName],
    });
  }
  public async getNumberOfCommitsByAuthor(): Promise<void> {
    this.lastResponseMap = getNumberOfCommitsByAuthor(
      this.currentRepository.getCommits()
    );
  }
  public async getNumberOfChangesPerFile(): Promise<void> {
    this.lastResponseMap = getNumberOfChangesPerFile(
      this.currentRepository.getExpandedCommits()
    );
  }
}
