export function getNumberOfContributorsPerFile(commits) {
    const changedFiles = {};
    commits.forEach((commit) => {
        commit.changedFiles.forEach((file) => {
            if (!changedFiles[file.path]) {
                changedFiles[file.path] = [];
            }
            if (!changedFiles[file.path].includes(commit.commit.commit.author.name)) {
                changedFiles[file.path].push(commit.commit.commit.author.name);
            }
        });
    });
    const results = {};
    Object.keys(changedFiles).forEach((filePath) => {
        results[filePath] = changedFiles[filePath].length;
    });
    return results;
}
//# sourceMappingURL=number-of-contributors-per-file.js.map