export class AggregateFileContributorsDashboard {
    data;
    constructor(data) {
        this.data = data;
    }
    displayDashboard() {
        const files = Object.keys(this.data);
        return `Number of files changed: ${files.length}`;
    }
    updateData(data) {
        this.data = data;
    }
}
//# sourceMappingURL=aggregate-file-contributors-dashboard.js.map