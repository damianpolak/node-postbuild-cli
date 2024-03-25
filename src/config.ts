import path from 'path';
import { cliArgsParse } from './cli';
import { CLIArguments, Config, Path } from './types';

const parsedArgs = cliArgsParse() as CLIArguments;
console.log('Current path', path.resolve('.'));

export const config: Config = {
  tag: `[NodePostBuild]`,
  general: {
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
  },
  resources: {
    packageJson: {
      src: parsedArgs.jsonSrcDir as string,
      dst: parsedArgs.jsonDstDir as string,
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
  },
} as const;
