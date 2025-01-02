import { log } from "../index.js";
function clearScreen() {
    process.stdout.write("\u001b[3J\u001b[2J\u001b[1J");
    // eslint-disable-next-line no-console
    console.clear();
}
export class SummaryDashboard {
    subDashboards;
    totalNumberOfCommits = null;
    newestCommitDate = null;
    oldestCommitDate = null;
    topAuthorsAllTime = [];
    processedNumberOfCommits = null;
    processedCommitDate = null;
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
    setCurrentProgress(progressCounter, currentCommit) {
        this.processedNumberOfCommits = progressCounter;
        this.processedCommitDate = new Date(currentCommit.commit.commit.author.timestamp * 1000).toISOString();
        this.render();
    }
    rerender() {
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
            log(subDashboard.displayDashboard(), {});
        }
        if (this.processedNumberOfCommits) {
            log("Read progress", {
                progress: `${this.processedNumberOfCommits} / ${this.totalNumberOfCommits}`,
                currentCursorDate: this.processedCommitDate,
            });
        }
    }
}
//# sourceMappingURL=summary-dashboard.js.map