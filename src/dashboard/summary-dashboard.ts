import { clearScreen, log } from "../index.js";
import { Commit, Dashboard, ExpandedCommit } from "../interfaces.js";
import { NumberOfCommitsByAuthor } from "../stats/number-of-commits-by-author.js";

type TopAuthorRecord = {
  name: string;
  numberOfUpdates: number;
};

class Timer {
  private startTime: number | null = null;

  start() {
    this.startTime = Date.now(); // Stores current timestamp in milliseconds
  }

  getElapsedSeconds(): number {
    if (!this.startTime) {
      throw new Error("Timer not started");
    }
    return parseFloat(Number((Date.now() - this.startTime) / 1000).toFixed(3));
  }
}

class ProgressEstimator {
  constructor(
    private readonly processedItems: number,
    private readonly totalItems: number,
    private readonly elapsedSeconds: number
  ) {}

  getEstimatedSecondsRemaining(): number {
    const itemsLeft = this.totalItems - this.processedItems;
    const itemsPerSecond = this.processedItems / this.elapsedSeconds;
    return Number((itemsLeft / itemsPerSecond).toFixed(3));
  }
}

export class SummaryDashboard {
  private totalNumberOfCommits: number = null;
  private newestCommitDate: string = null;
  private oldestCommitDate: string = null;
  private topAuthorsAllTime: TopAuthorRecord[] = [];
  private processedNumberOfCommits: number = null;
  private processedCommitDate: string = null;
  private progressTimer = new Timer();

  public constructor(private subDashboards: Dashboard[]) {}

  public setNumberOfCommitsPerAuthor(data: NumberOfCommitsByAuthor) {
    const out: TopAuthorRecord[] = [];
    const authors = Object.keys(data);
    for (const author of authors) {
      out.push({ name: author, numberOfUpdates: data[author] });
    }

    // Sort in descending order by numberOfUpdates
    out.sort((a, b) => b.numberOfUpdates - a.numberOfUpdates);

    this.topAuthorsAllTime = out;
    this.render();
  }

  public setCommits(commits: Commit[]) {
    this.totalNumberOfCommits = commits.length;
    this.newestCommitDate = new Date(
      commits[0].commit.author.timestamp * 1000
    ).toISOString();
    this.oldestCommitDate = new Date(
      commits[commits.length - 1].commit.author.timestamp * 1000
    ).toISOString();
    this.render();
  }

  public startProgress() {
    this.progressTimer.start();
  }

  public setCurrentProgress(
    progressCounter: number,
    currentCommit: ExpandedCommit
  ) {
    this.processedNumberOfCommits = progressCounter;
    this.processedCommitDate = new Date(
      currentCommit.commit.commit.author.timestamp * 1000
    ).toISOString();

    this.render();
  }

  private render() {
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
      const elapsedSeconds = this.progressTimer.getElapsedSeconds();
      const estimator = new ProgressEstimator(
        this.processedNumberOfCommits,
        this.totalNumberOfCommits,
        elapsedSeconds
      );

      log("Read progress", {
        progress: `${this.processedNumberOfCommits} / ${this.totalNumberOfCommits}`,
        currentCursorDate: this.processedCommitDate,
        elapsedTime: `${elapsedSeconds} seconds`,
        estimatedTimeLeft: `${estimator.getEstimatedSecondsRemaining()} seconds`,
      });
    }
  }
}
