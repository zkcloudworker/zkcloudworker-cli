"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.putToS3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const debug_1 = require("./debug");
const key1 = "AKIAQ3EGRHIPI4ABYWK4";
const key2 = "kieAgbJNP+F1GEON/zZ2zNlJY1UNwCU3FtRba3hK";
async function putToS3(params) {
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
        const client = new client_s3_1.S3Client(options);
        const command = new client_s3_1.PutObjectCommand(s3params);
        const response = await client.send(command);
        if ((0, debug_1.debug)())
            console.log("Success: S3File: put", response);
    }
    catch (error) {
        console.error("Error: S3File: put", error);
    }
}
exports.putToS3 = putToS3;
