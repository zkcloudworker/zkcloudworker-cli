import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { debug } from "./debug";

const key1 = "AKIAQ3EGRHIPI4ABYWK4";
const key2 = "kieAgbJNP+F1GEON/zZ2zNlJY1UNwCU3FtRba3hK";

export async function putToS3(params: {
  data: Buffer;
  mimeType: string | undefined;
  filename: string;
}): Promise<void> {
  const { data, mimeType, filename } = params;
  try {
    const s3params = {
      Bucket: "zkcloudworker-storage",
      Key: filename,
      Body: data,
      ContentType: mimeType ?? "application/octet-stream",
    };
    const options = {
      forcePathStyle: true,
      region: "eu-west-1",
      credentials: {
        accessKeyId: key1,
        secretAccessKey: key2,
      },
    };
    const client = new S3Client(options);

    const command = new PutObjectCommand(s3params);
    const response = await client.send(command);
    if (debug()) console.log("Success: S3File: put", response);
  } catch (error: any) {
    console.error("Error: S3File: put", error);
  }
}
