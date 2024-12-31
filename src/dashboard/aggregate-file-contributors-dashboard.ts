import { AggregateFileData } from "../stats/aggregate/aggregate.js";
import { Contributor } from "../stats/list-of-contributors-per-file.js";

export class AggregateFileContributorsDashboard {
  constructor(private data: AggregateFileData<Contributor[]>) {}
  public displayDashboard(): string {
    const files = Object.keys(this.data);
    return `Number of files changed: ${files.length}`;
  }
}
