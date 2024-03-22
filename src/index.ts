/* eslint-disable @typescript-eslint/no-unused-vars */
import path from 'path';
import { Config, Resource, Tag } from './types';
import { Util } from './utils';

export const tag: Tag = `[NestPostBuild]` as const;

console.log('Path resolve test', path.resolve('.'));

const resources: Resource = {
  packageJson: {
    source: '.',
    destination: './dist',
  },
  files: [
    {
      source: './.eslintrc.js',
      destination: './dist/.eslintrc.js',
    },
    {
      source: './jest.config.js',
      destination: './dist/jest.config.js',
    },
  ],
  compressing: {
    source: './dist',
    destination: './dist-zip',
  },
};

const config: Config = {
  npmCommand: 'npm install',
  npmRunLocation: './dist',
  packageAddEntries: [],
  packageKeepEntries: [
    'name',
    'version',
    'description',
    'private',
    'main',
    'author',
    'contributors',
    'license',
    'repository',
    'dependencies',
    'engines',
    'config',
  ],
};

// Test packages

// Util.packagesProcess(
//   resources.packageJson?.source,
//   resources.packageJson?.destination,
//   config.packageKeepEntries
// );

(async () => {
  // await Util.copyFiles(resources.files);
  // Util.zipDirectory(resources.compressing?.source, resources.compressing?.destination);
  await Util.installDeps(config.npmCommand, config.npmRunLocation);
})();
