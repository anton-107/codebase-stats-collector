import { clearScreen, log } from "../console/console.js";
class Timer {
    startTime = null;
    start() {
        this.startTime = Date.now(); // Stores current timestamp in milliseconds
    }
    getElapsedSeconds() {
        if (!this.startTime) {
            throw new Error("Timer not started");
        }
        return parseFloat(Number((Date.now() - this.startTime) / 1000).toFixed(3));
    }
}
class ProgressEstimator {
    processedItems;
    totalItems;
    elapsedSeconds;
    constructor(processedItems, totalItems, elapsedSeconds) {
        this.processedItems = processedItems;
        this.totalItems = totalItems;
        this.elapsedSeconds = elapsedSeconds;
    }
    getEstimatedSecondsRemaining() {
        const itemsLeft = this.totalItems - this.processedItems;
        const itemsPerSecond = this.processedItems / this.elapsedSeconds;
        return Number((itemsLeft / itemsPerSecond).toFixed(3));
    }
}
export class SummaryDashboard {
    subDashboards;
    totalNumberOfCommits = null;
    newestCommitDate = null;
    oldestCommitDate = null;
    topAuthorsAllTime = [];
    processedNumberOfCommits = null;
    processedCommitDate = null;
    progressTimer = new Timer();
    constructor(subDashboards) {
        this.subDashboards = subDashboards;
    }
    setNumberOfCommitsPerAuthor(data) {
        const out = [];
        const authors = Object.keys(data);
        for (const author of authors) {
            out.push({ name: author, numberOfUpdates: data[author] });
        }
        // Sort in descending order by numberOfUpdates
        out.sort((a, b) => b.numberOfUpdates - a.numberOfUpdates);
        this.topAuthorsAllTime = out;
        this.render();
    }
    setCommits(commits) {
        this.totalNumberOfCommits = commits.length;
        this.newestCommitDate = new Date(commits[0].commit.author.timestamp * 1000).toISOString();
        this.oldestCommitDate = new Date(commits[commits.length - 1].commit.author.timestamp * 1000).toISOString();
        this.render();
    }
    startProgress() {
        this.progressTimer.start();
    }
    setCurrentProgress(progressCounter, currentCommit) {
        this.processedNumberOfCommits = progressCounter;
        this.processedCommitDate = new Date(currentCommit.commit.commit.author.timestamp * 1000).toISOString();
        this.render();
    }
    render() {
        clearScreen();
        log("Commits in this repository", {
            total: this.totalNumberOfCommits,
            oldest: this.oldestCommitDate,
            newest: this.newestCommitDate,
        });
        if (this.topAuthorsAllTime.length > 10) {
            log("Top 10 authors:", {});
            log("============", {});
            for (let i = 0; i < 10; i++) {
                log(this.topAuthorsAllTime[i].name, {
                    numberOfUpdates: this.topAuthorsAllTime[i].numberOfUpdates,
                });
            }
        }
        for (const subDashboard of this.subDashboards) {
            log("\n\n", {});
            log(subDashboard.displayDashboard(), {});
        }
        if (this.processedNumberOfCommits) {
            const elapsedSeconds = this.progressTimer.getElapsedSeconds();
            const estimator = new ProgressEstimator(this.processedNumberOfCommits, this.totalNumberOfCommits, elapsedSeconds);
            log("Read progress", {
                progress: `${this.processedNumberOfCommits} / ${this.totalNumberOfCommits}`,
                currentCursorDate: this.processedCommitDate,
                elapsedTime: `${elapsedSeconds} seconds`,
                estimatedTimeLeft: `${estimator.getEstimatedSecondsRemaining()} seconds`,
            });
        }
    }
}
//# sourceMappingURL=summary-dashboard.js.map