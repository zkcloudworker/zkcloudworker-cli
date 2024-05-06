import { zkCloudWorkerRequest } from "./api";
import { sleep } from "./sleep";
import { debug } from "./debug";
import chalk from "chalk";

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
  if (debug()) console.log(`waiting for job result...`);
  while (result === undefined) {
    await sleep(20000);
    answer = await zkCloudWorkerRequest({
      command: "jobResult",
      jobId,
    });
    if (debug()) console.log(`jobResult api call result:`, answer);
    result = answer.result;
  }
  if (result !== "deployed") {
    console.error(chalk.red(`ERROR: Deployment failed: `) + result);
    process.exit(1);
  } else {
    console.log(chalk.green(`SUCCESS: Deployment completed`));
  }
}
