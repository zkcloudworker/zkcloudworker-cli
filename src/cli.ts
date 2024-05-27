#! /usr/bin/env ts-node
import { Command } from "commander";
import { writeConfig } from "./config";
import { deploy } from "./deploy";
import { version } from "../package.json";
import { watch } from "./watch";

export const program = new Command();

program
  .name("zkCloudWorker")
  .description("zkCloudWorker CLI tool")
  .version(version)
  .option("-v, --verbose", "verbose mode, print all logs")
  .option("-f, --folder <folder>", "folder with repo")
  .option("-r, --repo <repo>", "repo name")
  .option("-d, --developer <developer>", "developer name")
  .option("-m, --manager <pm>", "package manager: yarn | npm")
  .option("-j, --jwt <jwt>", "JWT token");

program
  .command("deploy")
  .description("deploy the repo to the cloud")
  .option("-p, --protect", "protect the deployment from changes")
  .option(
    "-e, --exclude [names...]",
    "exclude files and folders from deployment"
  )
  .action(async (options) => {
    console.time("deployed");
    await deploy(options);
    console.timeEnd("deployed");
  });

program
  .command("watch")
  .description("watch the job events for the repo")
  .action(async () => {
    console.time("deployed");
    await watch();
    console.timeEnd("deployed");
  });

program
  .command("config")
  .description("save default configuration")
  .action(async (options) => {
    console.log(`Saving default configuration...`);
    await writeConfig(program.opts() ?? {});
  });

//TODO: add the unprotect command after JWT format upgrade

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
