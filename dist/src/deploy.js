"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deploy = void 0;
const files_1 = require("./files");
const options_1 = require("./options");
const zip_1 = require("./zip");
const upload_1 = require("./upload");
const install_1 = require("./install");
const debug_1 = require("./debug");
async function deploy() {
    const { repo, developer, JWT, packageManager } = await (0, options_1.options)();
    console.log("Creating zip file...");
    await (0, files_1.createDirectories)();
    const zipFileName = await (0, zip_1.zip)(repo);
    if (!zipFileName) {
        console.error("Error creating zip file");
        return;
    }
    if ((0, debug_1.debug)())
        console.log("Zip file created:", zipFileName);
    console.log("Uploading zip file to zkCloudWorker's S3 storage...");
    const data = await (0, files_1.loadBinary)(zipFileName);
    if (!data) {
        console.error("Error reading zip file");
        return;
    }
    await (0, upload_1.upload)({ data, mimeType: "application/zip", developer, repo, JWT });
    await (0, install_1.install)({ JWT, repo, developer, packageManager });
}
exports.deploy = deploy;
