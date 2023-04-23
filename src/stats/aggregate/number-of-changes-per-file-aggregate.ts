import { Aggregate } from "./aggregate.js";

type NumberOfChanges = number;

export class NumberOfChangesPerFileAggregate extends Aggregate<NumberOfChanges> {
  initializeValue(): number {
    return 0;
  }
  incrementValue(currentValue: number): number {
    return currentValue + 1;
  }
}
