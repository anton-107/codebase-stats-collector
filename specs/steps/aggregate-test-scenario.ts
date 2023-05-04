import assert from "assert";

import { ChangedFileType, ExpandedCommit } from "../../src/interfaces.js";
import {
  Aggregate,
  AggregateStrategy,
} from "../../src/stats/aggregate/aggregate.js";

let incrementCalls = 0;

export class TestAggregate extends Aggregate<number> {
  initializeValue(): number {
    return 0;
  }
  incrementValue(currentValue: number): number {
    incrementCalls += 1;
    return currentValue + 1;
  }
}

export class AggregateTestScenario {
  private aggregateInstanceClass: typeof TestAggregate;
  private aggregateInstance: Aggregate<number>;
  private lastKnownError: Error | undefined;
  private lastResponse: string[] | number | undefined;

  public setAggregateInstanceClass(aggregateClass: typeof TestAggregate) {
    this.aggregateInstanceClass = aggregateClass;
  }
  public setStrategy(strategy: string) {
    try {
      this.aggregateInstance = new this.aggregateInstanceClass({
        strategy: strategy as AggregateStrategy,
      });
    } catch (e) {
      this.lastKnownError = e;
    }
  }
  public getLastKnownError() {
    return this.lastKnownError;
  }
  public addSingleFileCommit(
    commitType: ChangedFileType,
    filename: string,
    commitDate: string
  ) {
    const commit = this.buildMockCommit();
    commit.changedFiles.push({ path: filename, type: commitType });
    const timestamp = Date.parse(commitDate) / 1000;
    commit.commit.commit.author.timestamp = timestamp;
    commit.commit.commit.committer.timestamp = timestamp;
    this.aggregateInstance.addCommit(commit);
  }
  public addCommitWithType(commitType: ChangedFileType) {
    const commit = this.buildMockCommit();
    commit.changedFiles.push({ path: "fake-file", type: commitType });
    this.aggregateInstance.addCommit(commit);
  }
  public checkIncrementCallsCount(expectedValue: number) {
    assert.equal(incrementCalls, expectedValue);
  }
  public listFiles() {
    this.lastResponse = this.aggregateInstance.listFiles();
  }
  public listAggregates(fileName: string) {
    this.lastResponse = this.aggregateInstance.listAggregates(fileName);
  }
  public checkLastResponseDeepEqual(
    expectedValue: string[] | number | undefined
  ) {
    assert.deepStrictEqual(this.lastResponse, expectedValue);
  }
  public checkLastResponseListLength(expectedValue: number) {
    assert.ok(Array.isArray(this.lastResponse));
    assert.equal(this.lastResponse.length, expectedValue);
  }
  public getValue(fileName: string, aggregateKey: string) {
    this.lastResponse = this.aggregateInstance.getValue(fileName, aggregateKey);
  }
  private buildMockCommit(): ExpandedCommit {
    return {
      oid: "fake-oid",
      commit: {
        oid: "fake-oid",
        payload: "fake-payload",
        commit: {
          message: "fake-message",
          author: { name: "fake-author", timestamp: 0 },
          committer: { name: "fake-author", timestamp: 0 },
        },
      },
      changedFiles: [],
    };
  }
}
