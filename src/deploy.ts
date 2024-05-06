import { createDirectories, loadBinary } from "./files";
import { options } from "./options";
import { zip } from "./zip";
import { putToS3 } from "./s3";
import { install } from "./install";
import { debug } from "./debug";

export async function deploy() {
  const { repo, developer, JWT, packageManager } = await options();

  console.log("Creating zip file...");
  await createDirectories();
  const zipFileName = await zip(repo);
  if (!zipFileName) {
    console.error("Error creating zip file");
    return;
  }
  if (debug()) console.log("Zip file created:", zipFileName);
  console.log("Uploading zip file to zkCloudWorker's S3 storage...");
  const data = await loadBinary(zipFileName);
  if (!data) {
    console.error("Error reading zip file");
    return;
  }
  await putToS3({
    data,
    mimeType: "application/zip",
    filename: developer + "/" + repo + ".zip",
  });
  await install({ JWT, repo, developer, packageManager });
}
