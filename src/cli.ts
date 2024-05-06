#! /usr/bin/env ts-node
import { Command } from "commander";
import { writeConfig } from "./config";
import { debug } from "./debug";
import { deploy } from "./deploy";
import { version } from "../package.json";

export const program = new Command();

program
  .name("zkCloudWorker")
  .description("zkCloudWorker CLI tool")
  .version(version)
  .option("-v, --verbose", "verbose mode")
  .option("-f, --folder <folder>", "folder with repo")
  .option("-r, --repo <repo>", "repo name")
  .option("-d, --developer <developer>", "developer name")
  .option("-p, --pm <pm>", "package manager: yarn | npm")
  .option("-j, --jwt <jwt>", "JWT token");

program
  .command("deploy")
  .description("deploy the repo to the cloud")
  .action(async (options) => {
    console.log(`Deploying the repo to the cloud...`);
    console.time("deployed");
    await deploy();
    console.timeEnd("deployed");
  });

program
  .command("config")
  .description("save default configuration")
  .action(async (options) => {
    console.log(`Saving default configuration...`);
    await writeConfig(program.opts() ?? {});
  });

async function main() {
  console.log(
    `zkCloudWorker CLI tool v${version} (c) DFST 2024 www.zkcloudworker.com\n`
  );
  await program.parseAsync();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
