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

## Getting help

```sh
zkcw --help
```

```
Usage: zkCloudWorker [options] [command]

zkCloudWorker CLI tool

Options:
  -V, --version                output the version number
  -v, --verbose                verbose mode
  -f, --folder <folder>        folder with repo
  -r, --repo <repo>            repo name
  -d, --developer <developer>  developer name
  -p, --pm <pm>                package manager: yarn | npm
  -j, --jwt <jwt>              JWT token
  -h, --help                   display help for command

Commands:
  deploy                       deploy the repo to the cloud
  config                       save default configuration
  help [command]               display help for command

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
