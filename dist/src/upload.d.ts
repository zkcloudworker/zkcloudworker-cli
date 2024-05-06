/// <reference types="node" />
export declare function upload(params: {
    data: Buffer;
    mimeType: string | undefined;
    developer: string;
    repo: string;
    JWT?: string;
}): Promise<void>;
