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
