const commitToYearMonth = (commit) => {
    const t = commit.commit.author.timestamp;
    const commitDate = new Date(t * 1000);
    return `${commitDate.getFullYear()}-${String(commitDate.getMonth() + 1).padStart(2, "0")}`;
};
const commitToYearQuarter = (commit) => {
    const t = commit.commit.author.timestamp;
    const commitDate = new Date(t * 1000);
    const quarter = Math.ceil(commitDate.getMonth() / 3);
    return `${commitDate.getFullYear()}-Q${quarter}`;
};
export class Aggregate {
    files = {};
    strategy;
    constructor(options) {
        switch (options.strategy) {
            case "year-month":
                this.strategy = commitToYearMonth;
                break;
            case "year-quarter":
                this.strategy = commitToYearQuarter;
                break;
            default:
                throw new Error("Unknown aggregate strategy");
        }
    }
    addCommit(expandedCommit) {
        const aggregateKey = this.strategy(expandedCommit.commit);
        // iterate through expandedCommit.changedFiles
        for (const file of expandedCommit.changedFiles) {
            if (file.type === "equal") {
                continue;
            }
            if (!this.files[file.path]) {
                this.files[file.path] = {};
            }
            if (!this.files[file.path][aggregateKey]) {
                this.files[file.path][aggregateKey] = this.initializeValue();
            }
            this.files[file.path][aggregateKey] = this.incrementValue(this.files[file.path][aggregateKey], file, expandedCommit);
        }
    }
    getData() {
        return this.files;
    }
    listFiles() {
        return Object.keys(this.files);
    }
    listAggregates(filePath) {
        return Object.keys(this.files[filePath]);
    }
    getValue(filePath, aggregateKey) {
        return this.files[filePath][aggregateKey];
    }
}
//# sourceMappingURL=aggregate.js.map