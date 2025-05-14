<h1 align="center">Node-postbuild-cli</h1>
<p align="center">
  <b>Postbuild script for node package</b>
</p>
<br>

![npm](https://img.shields.io/npm/dw/node-postbuild-cli) ![npm](https://img.shields.io/npm/v/node-postbuild-cli) ![NPM](https://img.shields.io/npm/l/node-postbuild-cli) ![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/damianpolak/node-postbuild-cli/main.yml)

## Description

This tool helps automate post-build processes. It allows you to copy and modify `package.json` (retaining only essential properties for production), copy specific files to a destination directory, run `npm install` in the target location, execute custom shell commands, remove specified files/directories, and compress the output directory into a zip file. Tasks are executed in the order they are specified.

## Installation

Latest version:

```bash
npm i -g node-postbuild-cli@latest
```

or in working directory

```bash
npx node-postbuild-cli --task ...
npx node-postbuild-cli --tasks ...
```

## Usage

```javascript
USAGE:
$ node-postbuild-cli --tasks ... [options]
$ npbc --tasks ... [options]

Available tasks: `package`, `zip`, `deps`, `copyfiles`, `remove`, `commands`.

- package: Copies `package.json`, keeping only essential properties (e.g., `name`, `version`, `dependencies`).
- copyfiles: Copies files specified in the CLI arguments.
- deps: Installs dependencies in the target `package.json` directory.
- zip: Compresses the specified directory (default: `./dist`) into a zip file.
- remove: Removes files or directories specified in the CLI arguments.
- commands: Runs OS commands specified in the CLI arguments.

Options:
      --help               Show help                                   [boolean]
      --version            Show version number                         [boolean]
  -j, --pkg-src            `package.json` source directory[string] [default: "."]
  -k, --pkg-dst            `package.json` destination directory[string] [default: "./dist"]
  -c, --zip-dir            Directory to compress      [string] [default: "./dist"]
  -d, --zip-out            Output directory for the zip file [string] [default: "./dist-zip"]
  -f, --files-src-to-copy  Source file paths to copy       [array] [default: []]
  -g, --files-dst-to-copy  Destination paths for copied files[array] [default: []]
  -R, --remove             Paths to files or directories to remove [array] [default: []]
  -r, --tasks              Tasks to run, in the specified order
          [array] [choices: "package", "zip", "deps", "copyfiles", "remove", "commands"] [default: []]
  -a, --commands           OS commands to execute           [array] [default: []]

Examples:
  $ npx node-postbuild-cli --tasks package copyfiles deps zip --files-src-to-copy ./.env ./ecosystem.config.js --files-dst-to-copy ./dist/.env ./dist/ecosystem.config.js
  It runs tasks: package, copyfiles, deps, and zip. It copies .env and ecosystem.config.js to ./dist, using default values for other task-specific options.

  $ npx node-postbuild-cli --tasks package deps zip --zip-out ./zipped
  It runs tasks: package and deps with default values, and the zip task with a custom output directory ./zipped.
```

## Example

```javascript
$ npx node-postbuild-cli --tasks package deps zip
// It copies package.json file from . to ./dist, run npm install in ./dist and zipping ./dist to ./dist-zip/dist.zip

$ npx node-postbuild-cli --tasks package deps zip --pkg-dst ./foo --zip-dir ./foo
// It copies package.json file from . to ./foo, run npm install in ./foo and zipping ./foo to ./dist-zip/dist.zip

$ npx node-postbuild-cli --tasks copyfiles -f ./.env ./config.json -g ./foo/.env ./foo/new_config.json
// It copies files: .env and config.json from . to ./foo directory but changes name of config.json to new_config.json

$ npx node-postbuild-cli --tasks copyfiles zip -f ./.env ./config.json -g ./foo/.env ./foo/new_config.json --zip-dir ./foo
// Same as above, but zips the directory ./foo to ./dist-zip/dist.zip
```

## License

MIT © Damian Polak
