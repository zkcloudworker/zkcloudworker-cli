/// <reference types="node" />
export declare function putToS3(params: {
    data: Buffer;
    mimeType: string | undefined;
    filename: string;
}): Promise<void>;
