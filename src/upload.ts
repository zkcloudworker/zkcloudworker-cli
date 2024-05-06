import { zkCloudWorkerRequest } from "./api";
import axios from "axios";
import { debug } from "./debug";

export async function upload(params: {
  data: Buffer;
  mimeType: string | undefined;
  developer: string;
  repo: string;
  JWT?: string;
}): Promise<void> {
  const { data, mimeType, developer, repo, JWT } = params;
  try {
    if (debug()) console.log("upload", { developer, repo, mimeType });

    let answer = await zkCloudWorkerRequest({
      command: "presignedUrl",
      developer,
      repo,
      task: "presignedUrl",
      metadata: `presignedUrl for ${repo} by ${developer}`,
      mode: "sync",
      JWT,
    });
    if (debug()) console.log(`presignedUrl api call result:`, answer);
    if (
      answer === undefined ||
      answer.url === undefined ||
      typeof answer.url !== "string"
    ) {
      console.error("Error: cannot get presignedUrl");
      process.exit(1);
    }
    const url = answer.url;
    if (url === undefined) {
      console.error("Error: cannot get presignedUrl");
      process.exit(1);
    }
    if (debug()) console.log(`presignedUrl:`, url);

    const response = await axios.put(url, data);

    if (debug())
      console.log("Success: upload: put", response.status, response.statusText);
  } catch (error: any) {
    console.error("Error: S3File: put", error);
    process.exit(1);
  }
}
