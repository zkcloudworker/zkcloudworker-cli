import { zkCloudWorkerRequest } from "./api";
import { sleep } from "./sleep";
import { debug } from "./debug";
import chalk from "chalk";
import { all } from "axios";

/*
export async function zkCloudWorkerRequest(params: {
  command: string;
  task?: string;
  transactions?: string[];
  args?: string;
  metadata?: string;
  mode?: string;
  jobId?: string;
  repo: string;
  developer: string;
}) {
*/

export async function install(params: {
  JWT?: string;
  repo: string;
  developer: string;
  packageManager: string;
}) {
  const { JWT, repo, developer, packageManager } = params;

  let answer = await zkCloudWorkerRequest({
    command: "deploy",
    developer,
    repo,
    task: "deploy",
    args: packageManager,
    metadata: `deploy ${repo} by ${developer} using ${packageManager} package manager`,
    mode: "async",
    JWT,
  });
  if (debug()) console.log(`deploy api call result:`, answer);
  const jobId = answer.jobId;
  console.log(`Installing dependencies, install job id:`, jobId);
  console.log(`This may take a few minutes...`);
  let result: string | undefined = undefined;
  const allLogs: string[] = [];
  const printedLogs: string[] = [];

  function print(logs: string[], printLogs: boolean) {
    allLogs.push(...logs);
    logs.forEach((log) => {
      if (printedLogs.includes(log) === false) {
        printedLogs.push(log);
        // replace all occurrences of "error" with red color

        if (printLogs) {
          const text = log.replace(/error/gi, (matched) => chalk.red(matched));
          console.log(text);
        }
      }
    });
  }

  let isAllLogsFetchedFlag = false;

  while (result === undefined || isAllLogsFetchedFlag === false) {
    await sleep(10000);
    answer = await zkCloudWorkerRequest({
      command: "jobResult",
      jobId,
      includeLogs: true,
    });
    result = answer.result;

    //if (debug()) console.log(`jobResult api call result:`, answer);
    if (
      answer?.logs !== undefined &&
      answer?.logs !== null &&
      Array.isArray(answer.logs) === true
    )
      print(answer.logs, debug());
    isAllLogsFetchedFlag = isAllLogsFetched(allLogs);
    if (
      answer.jobStatus === "failed" &&
      debug() === false &&
      isAllLogsFetchedFlag === true
    ) {
      if (
        answer?.logs !== undefined &&
        answer?.logs !== null &&
        Array.isArray(answer.logs) === true
      )
        print(answer.logs, true);
      console.error(
        chalk.red(`ERROR: Deployment failed`) + result ? `: ${result}` : ""
      );
      process.exit(1);
    }
  }
  if (result !== "deployed") {
    console.error(chalk.red(`ERROR: Deployment failed: `) + result);
    process.exit(1);
  } else {
    console.log(chalk.green(`SUCCESS: Deployment completed`));
  }
}

function isAllLogsFetched(logs: string[]): boolean {
  // search for "Billed Duration" in the logs and return true if found
  return logs.some((log) => log.includes("Billed Duration"));
}
