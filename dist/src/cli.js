#! /usr/bin/env ts-node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.program = void 0;
const commander_1 = require("commander");
const deploy_1 = require("./deploy");
exports.program = new commander_1.Command();
exports.program
    .name("zkCloudWorker")
    .description("zkCloudWorker CLI tool")
    .version("0.1.0")
    .option("-v, --verbose", "verbose mode")
    .option("-f, --folder <folder>", "folder with repo")
    .option("-r, --repo <repo>", "repo name")
    .option("-d, --developer <developer>", "developer name")
    .option("-p, --pm <packageManager>", "package manager: yarn | npm");
exports.program
    .command("deploy")
    .description("deploy the repo to the cloud")
    .action(async (options) => {
    console.log(`Deploying the repo to the cloud...`);
    await (0, deploy_1.deploy)(exports.program.opts());
});
async function main() {
    console.log("zkCloudWorker CLI tool (c) DFST 2024 www.zkcloudworker.com\n");
    await exports.program.parseAsync();
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error(error);
    process.exit(1);
});
