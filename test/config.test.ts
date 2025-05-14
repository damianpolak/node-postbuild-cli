import { cliArgsParse } from '../src/cli';
import { CLIArguments } from '../src/types';

// Mock the cli module
jest.mock('../src/cli', () => ({
  cliArgsParse: jest.fn(),
}));

describe('config', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create config object with default values when no CLI args provided', () => {
    // Mock empty CLI args
    (cliArgsParse as jest.Mock).mockReturnValue({});

    // Re-import config to get fresh instance
    jest.isolateModules(() => {
      const { config } = require('../src/config');

      expect(config.tag).toBe('[NodePostBuild]');
      expect(config.general.npmCommand).toBe('npm install');
      expect(config.general.packageAddEntries).toEqual([]);
      expect(config.general.packageKeepEntries).toEqual([
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
      ]);
    });
  });

  it('should create config object with provided CLI args', () => {
    // Mock CLI args
    const mockArgs: Partial<CLIArguments> = {
      pkgSrc: './src',
      pkgDst: './dist',
      zipDir: './dist',
      zipOut: './output',
      filesSrcToCopy: ['file1.txt', 'file2.txt'],
      filesDstToCopy: ['dist/file1.txt', 'dist/file2.txt'],
      remove: ['tmp/'],
      commands: ['echo "test"'],
      tasks: ['package', 'zip'],
    };

    (cliArgsParse as jest.Mock).mockReturnValue(mockArgs);

    // Re-import config to get fresh instance
    jest.isolateModules(() => {
      const { config } = require('../src/config');

      expect(config.resources.packageJson).toEqual({
        src: './src',
        dst: './dist',
      });

      expect(config.resources.compressing).toEqual({
        src: './dist',
        dst: './output',
      });

      expect(config.resources.files).toEqual([
        { src: 'file1.txt', dst: 'dist/file1.txt' },
        { src: 'file2.txt', dst: 'dist/file2.txt' },
      ]);

      expect(config.resources.remove).toEqual(['tmp/']);
      expect(config.resources.commands).toEqual(['echo "test"']);
      expect(config.tasks).toEqual(['package', 'zip']);
    });
  });

  it('should handle undefined CLI args gracefully', () => {
    // Mock partially undefined CLI args
    const mockArgs: Partial<CLIArguments> = {
      pkgSrc: './src',
      pkgDst: './dist',
    };

    (cliArgsParse as jest.Mock).mockReturnValue(mockArgs);

    // Re-import config to get fresh instance
    jest.isolateModules(() => {
      const { config } = require('../src/config');

      expect(config.resources.packageJson).toEqual({
        src: './src',
        dst: './dist',
      });

      expect(config.resources.files).toBeUndefined();
      expect(config.resources.remove).toBeUndefined();
      expect(config.resources.commands).toBeUndefined();
      expect(config.tasks).toBeUndefined();
    });
  });
});
