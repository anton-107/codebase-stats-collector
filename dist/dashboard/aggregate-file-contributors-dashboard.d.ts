import { Dashboard } from "../interfaces.js";
import { AggregateFileData } from "../stats/aggregate/aggregate.js";
import { Contributor } from "../stats/list-of-contributors-per-file.js";
export declare class AggregateFileContributorsDashboard implements Dashboard {
    private data;
    constructor(data: AggregateFileData<Contributor[]>);
    displayDashboard(): string;
    private collectTopContributorForFile;
    private renderTimeSpanTopList;
}
