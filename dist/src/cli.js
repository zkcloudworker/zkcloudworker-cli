#! /usr/bin/env ts-node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.program = void 0;
const commander_1 = require("commander");
const config_1 = require("./config");
const deploy_1 = require("./deploy");
const package_json_1 = require("../package.json");
exports.program = new commander_1.Command();
exports.program
    .name("zkCloudWorker")
    .description("zkCloudWorker CLI tool")
    .version(package_json_1.version)
    .option("-v, --verbose", "verbose mode")
    .option("-f, --folder <folder>", "folder with repo")
    .option("-r, --repo <repo>", "repo name")
    .option("-d, --developer <developer>", "developer name")
    .option("-p, --pm <pm>", "package manager: yarn | npm")
    .option("-j, --jwt <jwt>", "JWT token");
exports.program
    .command("deploy")
    .description("deploy the repo to the cloud")
    .action(async (options) => {
    console.log(`Deploying the repo to the cloud...`);
    console.time("deployed");
    await (0, deploy_1.deploy)();
    console.timeEnd("deployed");
});
exports.program
    .command("config")
    .description("save default configuration")
    .action(async (options) => {
    console.log(`Saving default configuration...`);
    await (0, config_1.writeConfig)(exports.program.opts() ?? {});
});
async function main() {
    console.log(`zkCloudWorker CLI tool v${package_json_1.version} (c) DFST 2024 www.zkcloudworker.com\n`);
    await exports.program.parseAsync();
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error(error);
    process.exit(1);
});
