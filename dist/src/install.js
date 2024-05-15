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
    console.log(`Installing repo, this may take a few minutes...`);
    let result = undefined;
    const allLogs = [];
    const printedLogs = [];
    function print(logs) {
        allLogs.push(...logs);
        logs.forEach((log) => {
            if (printedLogs.includes(log) === false) {
                printedLogs.push(log);
                // replace all occurrences of "error" with red color
                const text = log.replace(/error/gi, (matched) => chalk_1.default.red(matched));
            }
        });
    }
    let printLogs = (0, debug_1.debug)();
    let isAllLogsFetchedFlag = false;
    while (result === undefined || isAllLogsFetchedFlag === false) {
        await (0, sleep_1.sleep)(5000);
        answer = await (0, api_1.zkCloudWorkerRequest)({
            command: "jobResult",
            jobId,
            includeLogs: printLogs,
        });
        result = answer.result;
        isAllLogsFetchedFlag = answer.isFullLog ?? false;
        if (printLogs &&
            answer?.logs !== undefined &&
            answer?.logs !== null &&
            Array.isArray(answer.logs) === true)
            print(answer.logs);
        if (answer.jobStatus === "failed" ||
            (answer.result !== undefined && result !== "deployed")) {
            printLogs = true;
        }
        else if (answer.jobStatus === "finished" && result === "deployed") {
            isAllLogsFetchedFlag = (0, debug_1.debug)() === false;
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
