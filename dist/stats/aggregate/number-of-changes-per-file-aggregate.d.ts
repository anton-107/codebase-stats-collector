import { Aggregate } from "./aggregate.js";
type NumberOfChanges = number;
export declare class NumberOfChangesPerFileAggregate extends Aggregate<NumberOfChanges> {
    initializeValue(): number;
    incrementValue(currentValue: number): number;
}
export {};
