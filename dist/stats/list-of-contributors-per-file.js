function setContributorForFile(changedFiles, commit, file) {
    const commitAuthor = commit.commit.commit.author.name;
    const commitTimestamp = commit.commit.commit.author.timestamp;
    if (!changedFiles[file.path]) {
        changedFiles[file.path] = [];
    }
    let contributor = changedFiles[file.path].find((x) => x.name === commitAuthor);
    if (!contributor) {
        contributor = {
            name: commitAuthor,
            numberOfChanges: 0,
            firstChangeTimestamp: commitTimestamp,
            lastChangeTimestamp: commitTimestamp,
        };
        changedFiles[file.path].push(contributor);
    }
    contributor.numberOfChanges += 1;
    if (contributor.firstChangeTimestamp > commitTimestamp) {
        contributor.firstChangeTimestamp = commitTimestamp;
    }
    if (contributor.lastChangeTimestamp < commitTimestamp) {
        contributor.lastChangeTimestamp = commitTimestamp;
    }
}
export function getListOfContributorsPerFile(commits) {
    const changedFiles = {};
    // collect contributors data:
    commits.forEach((commit) => {
        commit.changedFiles.forEach((file) => {
            if (file.type !== "equal") {
                setContributorForFile(changedFiles, commit, file);
            }
        });
    });
    // sort contributors from earliest to latest:
    for (const file of Object.keys(changedFiles)) {
        changedFiles[file].sort((a, b) => {
            if (a.firstChangeTimestamp < b.firstChangeTimestamp) {
                return -1;
            }
            if (a.lastChangeTimestamp > b.lastChangeTimestamp) {
                return 1;
            }
            return 0;
        });
    }
    return changedFiles;
}
//# sourceMappingURL=list-of-contributors-per-file.js.map