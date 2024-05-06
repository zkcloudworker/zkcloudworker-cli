import { write, load } from "./files";
import { debug } from "./debug";

export async function writeConfig(config: object): Promise<void> {
  if (debug()) console.log("Writing config:\n", config);
  try {
    await write({
      data: config,
      filename: "config",
      allowRewrite: true,
    });
    console.log(`MinaNFT JWT token has been set`);
  } catch (e) {
    console.error(e);
  }
}

export async function getConfig(): Promise<object | undefined> {
  try {
    const data = await load("config");
    if (debug()) console.log("config:", data);
    return data;
  } catch (e) {
    console.error("Error reading config.json file:", e);
    return undefined;
  }
}
