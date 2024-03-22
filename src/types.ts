import yargs from 'yargs';

export type Tag = `[${string}]`;

export type Path = {
  source: string;
  destination: string;
};

export type Resource = {
  packageJson: Path;
  compressing?: Path;
  files: Path[];
};

export type Config = {
  npmCommand: string;
  npmRunLocation: string;
  zipDestDirectory?: string;
  packageKeepEntries?: string[];
  packageAddEntries?: string[];
};

export interface CLIArguments extends yargs.Arguments {
  jsonSrcDir?: string;
  jsonDstDir?: string;
  zipDir?: string;
  zipOut?: string;
  filesSrcToCopy?: string[];
  filesDstToCopy?: string[];
}
