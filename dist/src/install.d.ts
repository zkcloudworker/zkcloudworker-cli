export declare function install(params: {
    JWT?: string;
    repo: string;
    developer: string;
    version: string;
    size: number;
    protect: boolean;
    packageManager: string;
}): Promise<void>;
