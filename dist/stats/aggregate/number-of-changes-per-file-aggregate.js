import { Aggregate } from "./aggregate.js";
export class NumberOfChangesPerFileAggregate extends Aggregate {
    initializeValue() {
        return 0;
    }
    incrementValue(currentValue) {
        return currentValue + 1;
    }
}
//# sourceMappingURL=number-of-changes-per-file-aggregate.js.map