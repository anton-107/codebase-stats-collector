export function getNumberOfChangesPerFile(commits) {
    const changedFiles = {};
    commits.forEach((commit) => {
        commit.changedFiles.forEach((file) => {
            if (!changedFiles[file.path]) {
                changedFiles[file.path] = 0;
            }
            if (file.type !== "equal") {
                changedFiles[file.path] += 1;
            }
        });
    });
    return changedFiles;
}
//# sourceMappingURL=number-of-changes-per-file.js.map