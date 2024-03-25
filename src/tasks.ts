import { config } from './config';
import { Feature } from './feature';
import { Logger } from './logger';
import { TaskFeature } from './types';

export const registeredTasks: TaskFeature[] = [
  {
    name: 'package',
    task: async () => {
      Logger.justlog('Copying packages...');
      Feature.packagesProcess(
        config.resources.packageJson?.src,
        config.resources.packageJson?.dst,
        config.general.packageKeepEntries
      );
    },
  },
  {
    name: 'copyfiles',
    task: async () => {
      Logger.justlog('Copying files...');
      await Feature.copyFiles(config.resources.files);
    },
  },
  {
    name: 'deps',
    task: async () => {
      Logger.justlog('Installing dependencies...');
      await Feature.installDeps(config.general.npmCommand, config.general.npmRunLocation);
    },
  },
  {
    name: 'zip',
    task: async () => {
      Logger.justlog('Start zipping...');
      Feature.zipDirectory(config.resources.compressing?.src, config.resources.compressing?.dst);
    },
  },
] as const;
