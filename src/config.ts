import { cliArgsParse } from './cli';
import { CLIArguments, Config, Path } from './types';

const parsedArgs = cliArgsParse() as CLIArguments;

export const config: Config = {
  tag: `[NodePostBuild]`,
  general: {
    npmCommand: 'npm install',
    npmRunLocation: parsedArgs.pkgDst as string,
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
  },
  resources: {
    packageJson: {
      src: parsedArgs.pkgSrc as string,
      dst: parsedArgs.pkgDst as string,
    },
    files: parsedArgs.filesSrcToCopy?.map((f, i) => {
      return {
        src: f,
        dst: (parsedArgs.filesDstToCopy as string[])[i],
      } as Path;
    }) as Path[],
    compressing: {
      src: parsedArgs.zipDir as string,
      dst: parsedArgs.zipOut as string,
    },
    remove: parsedArgs.remove as string[],
    commands: parsedArgs.commands as string[],
  },
  tasks: parsedArgs.tasks as string[],
} as const;
