import git from "isomorphic-git";
import fs from "fs";

async function main() {
  const sourceDir = process.env.SOURCE_DIR;
  console.log('sourceDir', sourceDir);
  
  const commits = await git.log({ fs, dir: sourceDir });
  console.log('Commits', commits);
}
main();