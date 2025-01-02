import { Dashboard } from "../interfaces.js";
import { AggregateFileData } from "../stats/aggregate/aggregate.js";
import { Contributor } from "../stats/list-of-contributors-per-file.js";

export class AggregateFileContributorsDashboard implements Dashboard {
  constructor(private data: AggregateFileData<Contributor[]>) {}
  public displayDashboard(): string {
    const files = Object.keys(this.data);
    return `Number of files changed: ${files.length}`;
  }

  updateData(data: AggregateFileData<Contributor[]>) {
    this.data = data;
  }
}
