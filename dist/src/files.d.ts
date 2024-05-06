/// <reference types="node" />
export type FileEncoding = "text" | "binary";
export declare function write(params: {
    data: object;
    filename: string;
    allowRewrite?: boolean;
}): Promise<string | undefined>;
export declare function load(filename: string): Promise<any>;
export declare function isFileExist(filename: string): Promise<boolean>;
export declare function loadBinary(filename: string): Promise<string | undefined>;
export declare function loadText(filename: string): Promise<string | undefined>;
export declare function saveBinary(params: {
    data: Buffer;
    filename: string;
}): Promise<void>;
export declare function saveText(params: {
    data: string;
    filename: string;
}): Promise<void>;
