import { Aggregate } from "./aggregate.js";
export class ListOfContributorsPerFileAggregate extends Aggregate {
    contributorsPerFile = {};
    initializeValue() {
        return [];
    }
    incrementValue(currentValue, changedFile, expandedCommit) {
        const commitAuthor = expandedCommit.commit.commit.author.name;
        const commitTimestamp = expandedCommit.commit.commit.author.timestamp;
        if (!this.contributorsPerFile[changedFile.path]) {
            this.contributorsPerFile[changedFile.path] = [];
        }
        let contributor = this.contributorsPerFile[changedFile.path].find((x) => x.name === commitAuthor);
        if (!contributor) {
            contributor = {
                name: commitAuthor,
                numberOfChanges: 0,
                firstChangeTimestamp: commitTimestamp,
                lastChangeTimestamp: commitTimestamp,
            };
            this.contributorsPerFile[changedFile.path].push(contributor);
        }
        contributor.numberOfChanges += 1;
        if (contributor.firstChangeTimestamp > commitTimestamp) {
            contributor.firstChangeTimestamp = commitTimestamp;
        }
        if (contributor.lastChangeTimestamp < commitTimestamp) {
            contributor.lastChangeTimestamp = commitTimestamp;
        }
        this.contributorsPerFile[changedFile.path].sort((a, b) => {
            if (a.firstChangeTimestamp < b.firstChangeTimestamp) {
                return -1;
            }
            if (a.lastChangeTimestamp > b.lastChangeTimestamp) {
                return 1;
            }
            return 0;
        });
        return this.contributorsPerFile[changedFile.path];
    }
}
//# sourceMappingURL=list-of-contributors-per-file-aggregate.js.map