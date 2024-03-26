import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { tasks } from './types';

export const cliArgsParse = () => {
  return yargs(hideBin(process.argv))
    .usage('DESCRIPTION: ')
    .usage(
      `The tool partially improves the process of automating some commands, 
      e.g. it allows you to copy the package.json file and remove properties 
      unnecessary for production, copy specific files from the source 
      location to the dist directory, run the npm install command in 
      the target location and pack the directory into zip. The specified 
      tasks run in the order in which they are specified.`
    )

    .usage('\r\nUSAGE:')
    .usage('$ node-postbuild-cli --tasks ... [options]')
    .usage('$ npbc --tasks ... [options]')
    .usage('')
    .usage(`currently default defined tasks: ${tasks}\r\n`)
    .usage(
      `- package: copies the package.json and removes properties such as: 
      name, version, description, private, main, author, contributors, 
      license, repository, dependencies, engines, config`
    )
    .usage(`- copyfiles: copies the files specified in the cli arguments`)
    .usage(`- deps: installs dependencies in package.json directory`)
    .usage(`- zip: zipping dist directory`)
    .example(
      '$ npx node-postbuild-cli --tasks package copyfiles deps zip --files-src-to-copy ./.env ./ecosystem.config.js --files-dst-to-copy ./dist/.env ./dist/ecosystem.config.js',
      'It runs tasks: package, deps and zip with default values and copyfiles .env, ecosystem.config.js to ./dist'
    )
    .example('----', '----')
    .example(
      '$ npx node-postbuild-cli --tasks package deps zip --zip-out ./zipped',
      'It runs tasks: package and deps with default values and zip with custom output directory'
    )
    .options({
      j: { type: 'string', alias: 'json-src-dir', default: '.' },
      k: { type: 'string', alias: 'json-dst-dir', default: './dist' },
      c: { type: 'string', alias: 'zip-dir', default: './dist' },
      d: { type: 'string', alias: 'zip-out', default: './dist-zip' },
      f: { type: 'array', alias: 'files-src-to-copy', default: [] },
      g: { type: 'array', alias: 'files-dst-to-copy', default: [] },
      r: { type: 'array', alias: 'tasks', choices: tasks, default: [] },
    })
    .describe('pkg-src', 'Package.json source dir')
    .describe('pkg-dst', 'Package.json dest dir')
    .describe('files-src-to-copy', 'File paths to copy')
    .describe('files-dst-to-copy', 'File destination paths')
    .describe('tasks', 'Tasks in the given order')
    .describe('zip-dir', 'Zip input directory')
    .describe('zip-out', 'Zip output directory')
    .parse();
};
