import { log } from "../index.js";
import { NumberOfCommitsByAuthor } from "../stats/number-of-commits-by-author.js";

function clearScreen() {
  process.stdout.write("\u001b[3J\u001b[2J\u001b[1J");
  // eslint-disable-next-line no-console
  console.clear();
}

type TopAuthorRecord = {
  name: string;
  numberOfUpdates: number;
};

export class SummaryDashboard {
  private topAuthorsAllTime: TopAuthorRecord[] = [];

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

  private render() {
    clearScreen();
    log("Top 10 authors:", {});
    log("============", {});
    for (let i = 0; i < 10; i++) {
      log(this.topAuthorsAllTime[i].name, {
        numberOfUpdates: this.topAuthorsAllTime[i].numberOfUpdates,
      });
    }
  }
}
