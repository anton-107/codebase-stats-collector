import fs from "fs";
import git from "isomorphic-git";

import { ChangedFile } from "./interfaces.js";

async function getFilesDiff(dir: string, prevOID: string, nextOID: string) {
  return await git.walk({
    fs,
    dir,
    trees: [git.TREE({ ref: prevOID }), git.TREE({ ref: nextOID })],
    map: async function (filepath, [commitA, commitB]) {
      // ignore directories
      if (filepath === ".") {
        return;
      }
      if (!commitA || !commitB) {
        return;
      }
      if (
        (await commitA.type()) === "tree" ||
        (await commitB.type()) === "tree"
      ) {
        return;
      }

      // generate ids:
      const aOID = await commitA.oid();
      const bOID = await commitB.oid();

      // determine modification type:
      let type = "equal";
      if (aOID !== bOID) {
        type = "modify";
      }
      if (aOID === undefined) {
        type = "add";
      }
      if (bOID === undefined) {
        type = "remove";
      }

      return {
        path: `/${filepath}`,
        type: type,
      };
    },
  });
}

async function main() {
  const dir = process.env.SOURCE_DIR;

  const commits = await git.log({ fs, dir });

  let i = 0;
  let previousCommit;
  for (const c of commits) {
    if (!previousCommit) {
      previousCommit = c;
      continue;
    }

    const results: ChangedFile[] = await getFilesDiff(
      dir,
      previousCommit.oid,
      c.oid
    );

    // eslint-disable-next-line no-console
    console.log(
      previousCommit,
      "changed files",
      results.filter((r) => r.type !== "equal")
    );

    i += 1;
    if (i >= 5) {
      break;
    }

    previousCommit = c;
  }
}
main();
