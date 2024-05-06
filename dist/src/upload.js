"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const api_1 = require("./api");
const axios_1 = __importDefault(require("axios"));
const debug_1 = require("./debug");
async function upload(params) {
    const { data, mimeType, developer, repo, JWT } = params;
    try {
        if ((0, debug_1.debug)())
            console.log("upload", { developer, repo, mimeType });
        let answer = await (0, api_1.zkCloudWorkerRequest)({
            command: "presignedUrl",
            developer,
            repo,
            task: "presignedUrl",
            metadata: `presignedUrl for ${repo} by ${developer}`,
            mode: "sync",
            JWT,
        });
        if ((0, debug_1.debug)())
            console.log(`presignedUrl api call result:`, answer);
        if (answer === undefined ||
            answer.url === undefined ||
            typeof answer.url !== "string") {
            console.error("Error: cannot get presignedUrl");
            process.exit(1);
        }
        const url = answer.url;
        if (url === undefined) {
            console.error("Error: cannot get presignedUrl");
            process.exit(1);
        }
        if ((0, debug_1.debug)())
            console.log(`presignedUrl:`, url);
        const response = await axios_1.default.put(url, data);
        if ((0, debug_1.debug)())
            console.log("Success: upload: put", response.status, response.statusText);
    }
    catch (error) {
        console.error("Error: S3File: put", error);
        process.exit(1);
    }
}
exports.upload = upload;
