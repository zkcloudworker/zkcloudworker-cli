#! /usr/bin/env ts-node
import { Command } from "commander";
import { writeConfig, getConfig } from "./config";
import { debug } from "./debug";
import { deploy } from "./deploy";

export const program = new Command();

program
  .name("zkCloudWorker")
  .description("zkCloudWorker CLI tool")
  .version("0.1.0")
  .option("-v, --verbose", "verbose mode")
  .option("-f, --folder <folder>", "folder with repo")
  .option("-r, --repo <repo>", "repo name")
  .option("-d, --developer <developer>", "developer name")
  .option("-p, --pm <packageManager>", "package manager: yarn | npm");

program
  .command("deploy")
  .description("deploy the repo to the cloud")
  .action(async (options) => {
    console.log(`Deploying the repo to the cloud...`);
    await deploy(program.opts());
  });

async function main() {
  console.log("zkCloudWorker CLI tool (c) DFST 2024 www.zkcloudworker.com\n");
  await program.parseAsync();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
