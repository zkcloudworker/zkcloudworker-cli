"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debug = void 0;
const cli_1 = require("./cli");
function debug() {
    return cli_1.program.opts().verbose ?? false;
}
exports.debug = debug;
