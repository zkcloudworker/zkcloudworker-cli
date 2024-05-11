"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = exports.writeConfig = void 0;
const files_1 = require("./files");
const debug_1 = require("./debug");
async function writeConfig(config) {
    if ((0, debug_1.debug)())
        console.log("Writing config:\n", config);
    try {
        await (0, files_1.write)({
            data: config,
            filename: "config",
            allowRewrite: true,
        });
        console.log(`New default configuration has been set`, config);
    }
    catch (e) {
        console.error(e);
    }
}
exports.writeConfig = writeConfig;
async function getConfig() {
    try {
        if (!(await (0, files_1.isFileExist)("config")))
            return undefined;
        const data = await (0, files_1.load)("config");
        if ((0, debug_1.debug)())
            console.log("config:", data);
        return data;
    }
    catch (e) {
        //console.error("Error reading config.json file:", e);
        return undefined;
    }
}
exports.getConfig = getConfig;
