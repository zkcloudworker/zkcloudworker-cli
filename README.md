# zkcloudworker-cli

zkCloudWorker CLI tool

## Installation

```sh
npm install -g zkcloudworker-cli
```

To confirm successful installation:

```sh
zkcw --version
```

or

```sh
zkcloudworker --version
```

### Updating the zkCloudWorker CLI

```sh
npm update -g zkcloudworker-cli
```

## Deploying the repo

```sh
zkcw deploy
```

or, to see the logs:

```sh
zkcw deploy -v
```

The package should have at the root directory index.ts file that exports the zkcloudworker function:

```typescript
// index.ts at the package root directory
import { Cloud, zkCloudWorker, initBlockchain } from "zkcloudworker";
import { initializeBindings } from "o1js";
import { MyWorker } from "./src/worker";

export async function zkcloudworker(cloud: Cloud): Promise<zkCloudWorker> {
  await initializeBindings();
  await initBlockchain(cloud.chain);
  return new MyWorker(cloud);
}
```

and the directory in tsconfig.json for `tsc` compilation result should be `dist`:

```
"compilerOptions": {
    "outDir": "./dist"
}
```

## Getting help

```sh
zkcw --help
```

```
Usage: zkCloudWorker [options] [command]

zkCloudWorker CLI tool

Options:
  -V, --version                output the version number
  -v, --verbose                verbose mode, print all logs
  -f, --folder <folder>        folder with repo
  -r, --repo <repo>            repo name
  -d, --developer <developer>  developer name
  -m, --manager <pm>           package manager: yarn | npm
  -j, --jwt <jwt>              JWT token
  -h, --help                   display help for command

Commands:
  deploy [options]             deploy the repo to the cloud
  config                       save default configuration
  help [command]               display help for command
```

```
Usage: zkCloudWorker deploy [options]

deploy the repo to the cloud

Options:
  -p, --protect               protect the deployment from changes
  -e, --exclude [folders...]  exclude folders from deployment
  -h, --help                  display help for command
```

## Development

You need to install node and git
and clone this repo

```
git clone https://github.com/zkcloudworker/zkcloudworker-cli
cd zkcloudworker-cli
touch yarn.lock
yarn
```

Running locally:

```
yarn cli
```
