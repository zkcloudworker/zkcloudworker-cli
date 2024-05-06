"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.install = void 0;
const api_1 = require("./api");
const sleep_1 = require("./sleep");
const debug_1 = require("./debug");
const chalk_1 = __importDefault(require("chalk"));
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
async function install(params) {
    const { JWT, repo, developer, packageManager } = params;
    let answer = await (0, api_1.zkCloudWorkerRequest)({
        command: "deploy",
        developer,
        repo,
        task: "deploy",
        args: packageManager,
        metadata: `deploy ${repo} by ${developer} using ${packageManager} package manager`,
        mode: "async",
        JWT,
    });
    if ((0, debug_1.debug)())
        console.log(`deploy api call result:`, answer);
    const jobId = answer.jobId;
    console.log(`Installing dependencies, install job id:`, jobId);
    console.log(`This may take a few minutes...`);
    let result = undefined;
    if ((0, debug_1.debug)())
        console.log(`waiting for job result...`);
    while (result === undefined) {
        await (0, sleep_1.sleep)(20000);
        answer = await (0, api_1.zkCloudWorkerRequest)({
            command: "jobResult",
            jobId,
        });
        if ((0, debug_1.debug)())
            console.log(`jobResult api call result:`, answer);
        result = answer.result;
    }
    if (result !== "deployed") {
        console.error(chalk_1.default.red(`ERROR: Deployment failed: `) + result);
        process.exit(1);
    }
    else {
        console.log(chalk_1.default.green(`SUCCESS: Deployment completed`));
    }
}
exports.install = install;
