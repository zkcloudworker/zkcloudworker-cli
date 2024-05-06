import { createWriteStream, promises as fs } from "fs";
import archiver from "archiver";
import { folder, rootFolder, isExist } from "./files";
import { debug } from "./debug";

export async function zip(repo: string): Promise<string | undefined> {
  try {
    const sourceDir = rootFolder();
    const zipFileName = folder() + `${repo}.zip`;

    if (await isExist(zipFileName)) {
      if (debug()) console.log(`Removing existing zip file: ${zipFileName}`);
      await fs.unlink(zipFileName);
    }

    const output = createWriteStream(zipFileName, { encoding: "binary" });
    const archive = archiver("zip", {
      zlib: { level: 9 },
    });

    const streamFinished = new Promise((resolve, reject) => {
      output.on("close", resolve);
      output.on("error", reject);
    });

    archive.pipe(output);

    archive.glob("**/*", {
      cwd: sourceDir,
      ignore: ["node_modules/**", "yarn.lock", ".yarn/**", ".zkcloudworker/**"],
      dot: true,
    });

    await new Promise((resolve, reject) => {
      output.on("close", resolve);
      output.on("error", reject);
      archive.finalize();
    });

    await streamFinished;
    return zipFileName;
  } catch (e) {
    console.error(`Error zipping ${repo}`, e);
    return undefined;
  }
}
