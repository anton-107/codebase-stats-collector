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
  public addCommitWithType(commitType: ChangedFileType) {
    const commit = this.buildMockCommit();
    commit.changedFiles.push({ path: "fake-file", type: commitType });
    this.aggregateInstance.addCommit(commit);
  }
  public checkIncrementCallsCount(expectedValue: number) {
    assert.equal(incrementCalls, expectedValue);
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
      changedFiles: [].map((f) => {
        return {
          path: f,
          type: "modify",
        };
      }),
    };
  }
}
