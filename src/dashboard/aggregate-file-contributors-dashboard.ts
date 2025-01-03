import { Dashboard } from "../interfaces.js";
import { AggregateFileData } from "../stats/aggregate/aggregate.js";
import { Contributor } from "../stats/list-of-contributors-per-file.js";

type FileWithNumberOfContributors = {
  filename: string;
  numberOfContributors: number;
};

export class AggregateFileContributorsDashboard implements Dashboard {
  constructor(private data: AggregateFileData<Contributor[]>) {}

  public displayDashboard(): string {
    const files = Object.keys(this.data);
    const out = ["Files with most contributors"];

    const topContributors: Record<string, FileWithNumberOfContributors[]> = {};

    for (const file of files) {
      this.collectTopContributorForFile(file, topContributors);
    }

    const timeSpans = Object.keys(topContributors).sort();
    for (const timeSpan of timeSpans) {
      this.renderTimeSpanTopList(topContributors, timeSpan, out);
    }

    return out.join("\n");
    // return `FILES CONTRIB DASHBOARD: ${files[0]} ${JSON.stringify(this.data[files[0]])}`;
    // return `Number of files changed: ${files.length}`;
  }

  private collectTopContributorForFile(
    file: string,
    topContributors: Record<string, FileWithNumberOfContributors[]>
  ) {
    const timeSpans = Object.keys(this.data[file]);
    for (const timeSpan of timeSpans) {
      if (!topContributors[timeSpan]) {
        topContributors[timeSpan] = [];
      }
      const numberOfContributors = this.data[file][timeSpan].length;
      topContributors[timeSpan].push({
        filename: file,
        numberOfContributors,
      });
    }
  }

  private renderTimeSpanTopList(
    topContributors: Record<string, FileWithNumberOfContributors[]>,
    timeSpan: string,
    out: string[]
  ) {
    topContributors[timeSpan].sort(
      (a, b) => b.numberOfContributors - a.numberOfContributors
    );
    out.push(`## ${timeSpan}`);
    out.push("--------------");
    if (topContributors[timeSpan].length === 0) {
      return;
    }
    for (let i = 0; i < 10; i++) {
      const x = topContributors[timeSpan][i];
      if (!x) {
        break;
      }
      out.push(`${x.filename}: ${x.numberOfContributors} contributors`);
    }
    out.push("\n\n");
  }
}
