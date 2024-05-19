import axios from "axios";
import chalk from "chalk";

export async function zkCloudWorkerRequest(params: {
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
  includeLogs?: boolean;
}) {
  try {
    const {
      command,
      task,
      transactions,
      args,
      metadata,
      mode,
      jobId,
      repo,
      developer,
      JWT,
      includeLogs,
    } = params;
    const apiData = {
      auth: "M6t4jtbBAFFXhLERHQWyEB9JA9xi4cWqmYduaCXtbrFjb7yaY7TyaXDunKDJNiUTBEcyUomNXJgC",
      command: command,
      jwtToken:
        JWT ?? // TODO: remove default value
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NTkwMzQ5NDYiLCJpYXQiOjE3MDEzNTY5NzEsImV4cCI6MTczMjg5Mjk3MX0.r94tKntDvLpPJT2zzEe7HMUcOAQYQu3zWNuyFFiChD0",
      data: {
        task,
        transactions: transactions ?? [],
        args,
        repo,
        developer,
        metadata,
        mode: mode ?? "sync",
        jobId,
        includeLogs,
      },
      chain: `devnet`,
    };
    const endpoint = "https://api.zkcloudworker.com/v1/devnet";

    const response = await axios.post(endpoint, apiData);
    return response.data;
  } catch (error: any) {
    console.error(
      chalk.red("Error while sending request to zkCloudWorker:"),
      error?.message ?? error?.data ?? error
    );
    process.exit(1);
  }
}
