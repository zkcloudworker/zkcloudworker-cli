"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deploy = void 0;
const files_1 = require("./files");
const options_1 = require("./options");
const zip_1 = require("./zip");
const upload_1 = require("./upload");
const install_1 = require("./install");
const debug_1 = require("./debug");
const promises_1 = __importDefault(require("fs/promises"));
const MAX_FILE_SIZE = 10 * 1024 * 1024;
async function deploy(params) {
    console.log(`Deploying the repo to the cloud...`, params);
    const { protect, exclude } = params;
    const { repo, developer, version, JWT, packageManager } = await (0, options_1.options)();
    console.log("Creating zip file...");
    await (0, files_1.createDirectories)();
    const zipFileName = await (0, zip_1.zip)(repo, exclude ?? []);
    if (!zipFileName) {
        console.error("Error creating zip file");
        return;
    }
    if ((0, debug_1.debug)())
        console.log("Zip file created:", zipFileName);
    const stat = await promises_1.default.stat(zipFileName);
    const size = stat.size;
    if ((0, debug_1.debug)())
        console.log("Zip file size:", size.toLocaleString(), "bytes");
    if (size > MAX_FILE_SIZE) {
        console.error(`Zip file is too big: ${stat.size} bytes (max ${MAX_FILE_SIZE} bytes)`);
        return;
    }
    console.log("Uploading zip file to zkCloudWorker's cloud storage...");
    const data = await (0, files_1.loadBinary)(zipFileName);
    if (!data) {
        console.error("Error reading zip file");
        return;
    }
    await (0, upload_1.upload)({
        data,
        mimeType: "application/zip",
        developer,
        repo,
        version,
        JWT,
    });
    await (0, install_1.install)({
        JWT,
        repo,
        developer,
        version,
        size,
        packageManager,
        protect: protect ?? false,
    });
}
exports.deploy = deploy;
