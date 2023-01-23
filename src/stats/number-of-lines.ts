import { createReadStream } from "fs";

const LINE_FEED = "\n".charCodeAt(0);

export function getNumberOfLines(filePath: string): Promise<number> {
  return new Promise((resolve) => {
    let count = 0;
    createReadStream(filePath)
      .on("data", function (chunk) {
        for (let i = 0; i < chunk.length; i += 1)
          if (chunk[i] === LINE_FEED) count++;
      })
      .on("end", function () {
        resolve(count + 1);
      });
  });
}
