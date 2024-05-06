"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveText = exports.saveBinary = exports.loadText = exports.loadBinary = exports.isFileExist = exports.load = exports.write = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const debug_1 = require("./debug");
const folder = "./.zkcloudworker/";
async function write(params) {
    const { data, filename, allowRewrite } = params;
    const name = folder + filename + ".json";
    try {
        await createDirectories();
        if ((0, debug_1.debug)())
            console.log("Writing file", {
                data,
                filename,
                allowRewrite,
            });
        if (!allowRewrite && (await isExist(name))) {
            console.error(`File ${name} already exists`);
            return;
        }
        await backup(filename);
        await promises_1.default.writeFile(name, JSON.stringify(data, null, 2));
        return name;
    }
    catch (e) {
        console.error(`Error writing file ${name}`);
        return undefined;
    }
}
exports.write = write;
async function load(filename) {
    const name = folder + filename + ".json";
    try {
        const filedata = await promises_1.default.readFile(name, "utf8");
        const data = JSON.parse(filedata);
        return data;
    }
    catch (e) {
        console.error(`File ${name} does not exist or has wrong format`);
        return undefined;
    }
}
exports.load = load;
async function isFileExist(filename) {
    const name = folder + filename + ".json";
    try {
        if ((0, debug_1.debug)())
            console.log("isFileExist", {
                filename,
                name,
            });
        if (await isExist(name))
            return true;
        else
            return false;
    }
    catch (e) {
        console.error(`Error checking file ${name}`);
        return false;
    }
}
exports.isFileExist = isFileExist;
async function loadBinary(filename) {
    try {
        return await promises_1.default.readFile(filename, "binary");
    }
    catch (e) {
        console.error(`Cannot read file ${filename}`, e);
        return undefined;
    }
}
exports.loadBinary = loadBinary;
async function loadText(filename) {
    try {
        return await promises_1.default.readFile(filename, "utf8");
    }
    catch (e) {
        console.error(`Cannot read file ${filename}`, e);
        return undefined;
    }
}
exports.loadText = loadText;
async function saveBinary(params) {
    const { data, filename } = params;
    try {
        await promises_1.default.writeFile(filename, data, "binary");
    }
    catch (e) {
        console.error(`Error writing file ${filename}`, e);
    }
}
exports.saveBinary = saveBinary;
async function saveText(params) {
    const { data, filename } = params;
    try {
        await promises_1.default.writeFile(filename, data, "utf8");
    }
    catch (e) {
        console.error(`Error writing file ${filename}`, e);
    }
}
exports.saveText = saveText;
async function isExist(name) {
    // check if file exists
    try {
        await promises_1.default.access(name);
        return true;
    }
    catch (e) {
        // if not, return
        return false;
    }
}
async function backup(filename) {
    const name = folder + filename + ".json";
    const backupName = folder + "backup/" + filename + "." + getFormattedDateTime() + ".json";
    // check if file exists
    try {
        await promises_1.default.access(name);
    }
    catch (e) {
        // if not, return
        return;
    }
    // copy file to backup
    await promises_1.default.copyFile(name, backupName);
}
async function createDirectories() {
    // check if data directory exists
    try {
        await promises_1.default.access(folder);
    }
    catch (e) {
        // if not, create it
        await promises_1.default.mkdir(folder);
    }
    // check if data directory exists
    try {
        await promises_1.default.access(folder + "backup");
    }
    catch (e) {
        // if not, create it
        await promises_1.default.mkdir(folder + "backup");
    }
}
function getFormattedDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    return `${year}.${month}.${day}-${hours}.${minutes}.${seconds}`;
}
