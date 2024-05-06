export declare function zkCloudWorkerRequest(params: {
    command: string;
    task?: string;
    transactions?: string[];
    args?: string;
    metadata?: string;
    mode?: string;
    jobId?: string;
    repo?: string;
    developer?: string;
    JWT?: string;
}): Promise<any>;
