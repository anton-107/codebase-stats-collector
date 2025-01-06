export class AggregateFileContributorsDashboard {
    data;
    constructor(data) {
        this.data = data;
    }
    displayDashboard() {
        const files = Object.keys(this.data);
        const out = ["Files with most contributors"];
        const topContributors = {};
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
    collectTopContributorForFile(file, topContributors) {
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
    renderTimeSpanTopList(topContributors, timeSpan, out) {
        topContributors[timeSpan].sort((a, b) => b.numberOfContributors - a.numberOfContributors);
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
//# sourceMappingURL=aggregate-file-contributors-dashboard.js.map