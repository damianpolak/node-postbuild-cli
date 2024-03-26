<h1 align="center">Node-postbuild-cli</h1>
<p align="center">
  <b>Postbuild script for node package</b>
</p>
<br>

![npm](https://img.shields.io/npm/dw/node-postbuild-cli) ![npm](https://img.shields.io/npm/v/node-postbuild-cli) ![NPM](https://img.shields.io/npm/l/node-postbuild-cli) ![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/damianpolak/node-postbuild-cli/node.js.yml)

## Description

The tool partially improves the process of automating some commands, e.g. it allows you to copy the package.json file and remove properties unnecessary for production, copy specific files from the source location to the dist directory, run the npm install command in the target location and pack the directory into zip. The specified tasks run in the order in which they are specified.

## Installation

Latest version:

```bash
npm i -g node-postbuild-cli@latest
```

or in working directory

```bash
npx node-postbuild-cli --task ...
```

## Usage

```javascript
USAGE:
$ node-postbuild-cli --tasks ... [options]
$ npbc --tasks ... [options]

currently default defined tasks: package,zip,deps,copyfiles

- package: copies the package.json and removes properties such as:
name, version, description, private, main, author, contributors,
license, repository, dependencies, engines, config
- copyfiles: copies the files specified in the cli arguments
- deps: installs dependencies in package.json directory
- zip: zipping dist directory

Options:
      --help               Show help                                   [boolean]
      --version            Show version number                         [boolean]
  -j, --pkg-src            Package.json source dir       [string] [default: "."]
  -k, --pkg-dst            Package.json dest dir    [string] [default: "./dist"]
  -c, --zip-dir            Zip input directory      [string] [default: "./dist"]
  -d, --zip-out            Zip output directory [string] [default: "./zip"]
  -f, --files-src-to-copy  File paths to copy              [array] [default: []]
  -g, --files-dst-to-copy  File destination paths          [array] [default: []]
  -r, --tasks              Tasks in the given order
          [array] [choices: "package", "zip", "deps", "copyfiles"] [default: []]

Examples:
  $ npx node-postbuild-cli --tasks package copyfiles      It runs tasks: package, deps and zip
  deps zip --files-src-to-copy ./.env       with default values and copyfiles
  ./ecosystem.config.js                     .env, ecosystem.config.js to ./dist
  --files-dst-to-copy ./dist/.env
  ./dist/ecosystem.config.js
  ----                                      ----
  $ npx node-postbuild-cli --tasks package deps zip       It runs tasks: package and deps with
  --zip-out ./zipped                        default values and zip with custom
                                            output directory
```

## Example

```javascript
$ npx node-postbuild-cli --tasks package deps zip
// It copies package.json file from . to ./dist, run npm install in ./dist and zipping ./dist to ./dist-zip/dist.zip

$ npx node-postbuild-cli --tasks package deps zip --pkg-dst ./foo --zip-dir ./foo
// It copies package.json file from . to ./build, run npm install in ./build and zipping ./build to ./dist-zip/dist.zip

$ npx node-postbuild-cli --tasks copyfiles -f ./.env ./config.json -g ./foo/.env ./foo/new_config.json
// It copies files: .env and config.json from . to ./foo directory but changes name of config.json to new_config.json

$ npx node-postbuild-cli --tasks copyfiles zip -f ./.env ./config.json -g ./foo/.env ./foo/new_config.json --zipDir ./foo
// Same as above, but zips the directory ./foo to ./dist-zip/dist.zip
```

## License

MIT © Damian Polak
