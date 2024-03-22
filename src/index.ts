#!/usr/bin/env node
import path from 'path';
import { CLIArguments, Config, Path, Resource, Tag } from './types';
import { Util } from './utils';
import { cliArgsParse } from './cli';
import { Logger } from './logger';

export const tag: Tag = `[NodePostBuild]` as const;

(async () => {
  Logger.justlog('Start script');
  const parsedArgs = cliArgsParse() as CLIArguments;
  console.log('Current path', path.resolve('.'));

  const resources: Resource = {
    packageJson: {
      source: parsedArgs.jsonSrcDir as string,
      destination: parsedArgs.jsonDstDir as string,
    },
    files: parsedArgs.filesSrcToCopy?.map((f, i) => {
      return {
        source: f,
        destination: (parsedArgs.filesDstToCopy as string[])[i],
      };
    }) as Path[],
    compressing: {
      source: parsedArgs.zipDir as string,
      destination: parsedArgs.zipOut as string,
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

  /**
   *  SCRIPT PROCESS
   */

  Logger.justlog('Copying packages...');
  Util.packagesProcess(
    resources.packageJson?.source,
    resources.packageJson?.destination,
    config.packageKeepEntries
  );

  Logger.justlog('Copying files...');
  await Util.copyFiles(resources.files);

  Logger.justlog('Installing dependencies...');
  await Util.installDeps(config.npmCommand, config.npmRunLocation);

  Logger.justlog('Start zipping...');
  Util.zipDirectory(resources.compressing?.source, resources.compressing?.destination);

  Logger.justlog('Successfully finished');
})();
