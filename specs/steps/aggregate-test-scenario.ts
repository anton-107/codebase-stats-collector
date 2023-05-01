import {
  Aggregate,
  AggregateStrategy,
} from "../../src/stats/aggregate/aggregate.js";

export class TestAggregate extends Aggregate<number> {
  initializeValue(): number {
    throw new Error("Method not implemented.");
  }
  incrementValue(): number {
    throw new Error("Method not implemented.");
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
}
