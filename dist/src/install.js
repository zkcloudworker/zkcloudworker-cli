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
    const { JWT, repo, developer, version, size, packageManager, protect } = params;
    let answer = await (0, api_1.zkCloudWorkerRequest)({
        command: "deploy",
        developer,
        repo,
        task: "deploy",
        args: JSON.stringify({ packageManager, version, size, protect }, null, 2),
        metadata: `deploy ${repo} v. ${version} by ${developer} using ${packageManager} package manager`,
        mode: "async",
        JWT,
    });
    if ((0, debug_1.debug)())
        console.log(`deploy api call result:`, answer);
    const jobId = answer.jobId;
    console.log(`Installing repo, install job id:`, jobId);
    console.log(`This may take a few minutes...`);
    let result = undefined;
    const allLogs = [];
    const printedLogs = [];
    function print(logs, printLogs) {
        allLogs.push(...logs);
        logs.forEach((log) => {
            if (printedLogs.includes(log) === false) {
                printedLogs.push(log);
                // replace all occurrences of "error" with red color
                if (printLogs) {
                    const text = log.replace(/error/gi, (matched) => chalk_1.default.red(matched));
                    console.log(text);
                }
            }
        });
    }
    let isAllLogsFetchedFlag = false;
    while (result === undefined || isAllLogsFetchedFlag === false) {
        await (0, sleep_1.sleep)(10000);
        answer = await (0, api_1.zkCloudWorkerRequest)({
            command: "jobResult",
            jobId,
            includeLogs: true,
        });
        result = answer.result;
        //if (debug()) console.log(`jobResult api call result:`, answer);
        if (answer?.logs !== undefined &&
            answer?.logs !== null &&
            Array.isArray(answer.logs) === true)
            print(answer.logs, (0, debug_1.debug)());
        isAllLogsFetchedFlag = isAllLogsFetched(allLogs);
        if (answer.jobStatus === "failed" && isAllLogsFetchedFlag === true) {
            if (answer?.logs !== undefined &&
                answer?.logs !== null &&
                Array.isArray(answer.logs) === true)
                print(answer.logs, true);
            await (0, sleep_1.sleep)(1000);
            console.log(chalk_1.default.red(`ERROR: Deployment failed`) +
                (result !== undefined ? `: ${result}` : ""));
            process.exit(1);
        }
    }
    if (result !== "deployed") {
        console.log(chalk_1.default.red(`ERROR: Deployment failed`) +
            (result !== undefined ? `: ${result}` : ""));
        process.exit(1);
    }
    else {
        console.log(chalk_1.default.green(`SUCCESS: Deployment completed`));
    }
}
exports.install = install;
function isAllLogsFetched(logs) {
    // search for "Billed Duration" in the logs and return true if found
    return logs.some((log) => log.includes("Billed Duration"));
}
