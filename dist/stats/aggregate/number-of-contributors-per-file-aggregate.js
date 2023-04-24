import { Aggregate } from "./aggregate.js";
export class NumberOfContributorsPerFileAggregate extends Aggregate {
    contributorsPerFile = {};
    initializeValue() {
        return 0;
    }
    incrementValue(currentValue, changedFile, expandedCommit) {
        if (!this.contributorsPerFile[changedFile.path]) {
            this.contributorsPerFile[changedFile.path] = new Set();
        }
        this.contributorsPerFile[changedFile.path].add(expandedCommit.commit.commit.author.name);
        return this.contributorsPerFile[changedFile.path].size;
    }
}
//# sourceMappingURL=number-of-contributors-per-file-aggregate.js.map