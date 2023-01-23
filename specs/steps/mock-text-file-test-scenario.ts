import { F_OK } from "node:constants";

import { access } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";

import { getNumberOfLines } from "../../src/stats/number-of-lines.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fileAccess = promisify(access);

export class MockTextFileTestScenario {
  private currentFilePath: string | undefined = undefined;
  private currentResult: number | undefined = undefined;

  public async setCurrentFilePath(filePath: string) {
    const fileFullPath = `${__dirname}/${filePath}`;
    await fileAccess(fileFullPath, F_OK);
    this.currentFilePath = fileFullPath;
  }
  public async getNumberOfLines() {
    if (!this.currentFilePath) {
      throw Error(
        "currentFilePath is undefined. Set it first in your test before calling getNumberOfLines"
      );
    }
    this.currentResult = await getNumberOfLines(this.currentFilePath);
  }
  public getCurrentResult() {
    return this.currentResult;
  }
}
