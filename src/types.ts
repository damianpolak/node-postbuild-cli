import yargs from 'yargs';

export type Tag = `[${string}]`;

export type Path = {
  src: string;
  dst: string;
};

export type Resource = {
  packageJson: Path;
  compressing?: Path;
  files: Path[];
};

export type Config = {
  tag: Tag;
  general: OldConfig;
  resources: Resource;
  tasks: string[];
};

export type OldConfig = {
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
  tasks?: Task[];
}

export const tasks = [
  'package',
  'zip',
  'deps',
  'copyfiles',
] as const satisfies ReadonlyArray<string>;

export type Task = (typeof tasks)[number];

export type TaskFeature = {
  name: Task;
  task(): Promise<void>;
};
