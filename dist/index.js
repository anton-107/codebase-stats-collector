import { GitRepository } from "./git-reader/git-repository.js";
import { getListOfContributorsPerFile } from "./stats/list-of-contributors-per-file.js";
import { getNumberOfChangesPerFile } from "./stats/number-of-changes-per-file.js";
import { getNumberOfCommitsByAuthor } from "./stats/number-of-commits-by-author.js";
import { getNumberOfContributorsPerFile } from "./stats/number-of-contributors-per-file.js";
function log(arg1, arg2) {
    // eslint-disable-next-line no-console
    console.log(arg1, arg2);
}
async function collectCommitsByAuthor(repo) {
    const commits = await repo.getListOfCommits();
    const commitsByAuthor = getNumberOfCommitsByAuthor(commits);
    log("commitsByAuthor", commitsByAuthor);
}
async function collectHotFiles(commitsWithChangedFiles) {
    const commitsPerFile = getNumberOfChangesPerFile(commitsWithChangedFiles);
    log("hot files (files with most changes)", Object.keys(commitsPerFile)
        .map((x) => {
        return [x, commitsPerFile[x]];
    })
        .sort((a, b) => Number(b[1]) - Number(a[1])));
}
async function collectKnowledgeGaps(commitsWithChangedFiles) {
    const contributorsPerFile = getNumberOfContributorsPerFile(commitsWithChangedFiles);
    log("knowledge gaps (files with least number of contributors)", Object.keys(contributorsPerFile)
        .map((x) => {
        return [x, contributorsPerFile[x]];
    })
        .sort((a, b) => Number(a[1]) - Number(b[1])));
}
async function collectDetailedContributorsPerFile(commitsWithChangedFiles) {
    const listOfContributorsPerFile = await getListOfContributorsPerFile(commitsWithChangedFiles);
    log("detailed contributors for each file", listOfContributorsPerFile);
}
async function main() {
    const dir = process.env.SOURCE_DIR;
    const repo = new GitRepository(dir);
    const commitsWithChangedFiles = await repo.getListOfCommitsWithChangedFiles();
    await collectCommitsByAuthor(repo);
    await collectHotFiles(commitsWithChangedFiles);
    await collectKnowledgeGaps(commitsWithChangedFiles);
    await collectDetailedContributorsPerFile(commitsWithChangedFiles);
}
main();
//# sourceMappingURL=index.js.map