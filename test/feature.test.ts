import { Feature } from '../src/feature';
import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import { exec } from 'child_process';
import { Logger } from '../src/logger';

// Mock dependencies
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  promises: {
    readFile: jest.fn(),
    copyFile: jest.fn(),
  },
  readdirSync: jest.fn(),
  statSync: jest.fn(),
  readFileSync: jest.fn(),
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
  rmSync: jest.fn(),
}));
jest.mock('jszip');
jest.mock('child_process');
jest.mock('../src/logger');

describe('Feature', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('zipDirectory', () => {
    it('should log error when paths are undefined', () => {
      Feature.zipDirectory(undefined, undefined);
      expect(Logger.justlog).toHaveBeenCalledWith(
        'Compress directory path and destination path cannot be empty'
      );
    });
    it('should create zip file from directory', async () => {
      const mockZip = {
        file: jest.fn(),
        generateAsync: jest.fn().mockResolvedValue(Buffer.from('test')),
      };
      (jest.mocked(JSZip) as unknown as jest.Mock).mockImplementation(() => mockZip);

      const mockFiles = ['file1.txt', 'file2.txt'];
      const mockStats = {
        isDirectory: () => false,
        isFile: () => true,
        isSymbolicLink: () => false,
        size: 0,
        atimeMs: 0,
        mtimeMs: 0,
        ctimeMs: 0,
        birthtimeMs: 0,
        atime: new Date(),
        mtime: new Date(),
        ctime: new Date(),
        birthtime: new Date(),
      };

      (fs.readdirSync as jest.Mock).mockReturnValue(mockFiles);
      (fs.statSync as jest.Mock).mockReturnValue(mockStats);
      (fs.readFileSync as jest.Mock).mockReturnValue('file content');
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      (fs.mkdirSync as jest.Mock).mockReturnValue('');
      (fs.writeFileSync as jest.Mock).mockReturnValue(undefined);

      await Feature.zipDirectory('sourceDir', 'destDir');

      expect(fs.mkdirSync).toHaveBeenCalledWith('destDir');
      expect(mockZip.file).toHaveBeenCalledTimes(2);
      expect(fs.writeFileSync).toHaveBeenCalled();
    });
  });

  describe('packagesProcess', () => {
    it('should log error when paths are undefined', async () => {
      await Feature.packagesProcess(undefined, undefined);
      expect(Logger.justlog).toHaveBeenCalledWith(
        'Package source and destination directory cannot be empty'
      );
    });

    it('should process package.json with keep entries and add entries', async () => {
      const mockPackageJson = JSON.stringify({
        name: 'test-package',
        version: '1.0.0',
        dependencies: {},
      });

      jest.mocked(fs.promises.readFile).mockResolvedValue(mockPackageJson);
      jest.mocked(fs.writeFileSync).mockReturnValue(undefined);

      const keepEntries = ['name', 'version'];
      const addEntries = [{ name: 'author', value: 'Test Author' }];

      await Feature.packagesProcess('sourceDir', 'destDir', keepEntries, addEntries);

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('"name": "test-package"')
      );
    });
  });

  describe('copyFiles', () => {
    it('should copy files successfully', async () => {
      const files = [
        { src: 'src1', dst: 'dst1' },
        { src: 'src2', dst: 'dst2' },
      ];

      jest.mocked(fs.promises.copyFile).mockResolvedValue(undefined);

      await Feature.copyFiles(files);

      expect(fs.promises.copyFile).toHaveBeenCalledTimes(2);
    });

    it('should handle errors when copying files', async () => {
      const files = [{ src: 'src1', dst: 'dst1' }];

      jest.mocked(fs.promises.copyFile).mockRejectedValue(new Error('Copy failed'));

      await Feature.copyFiles(files);

      expect(Logger.justlog).toHaveBeenCalledWith('Something is wrong with copying files...');
    });
  });

  describe('installDeps', () => {
    it('should execute npm command successfully', async () => {
      const mockExec = jest.mocked(exec) as unknown as jest.Mock;
      mockExec.mockImplementation((command, options, callback) => {
        callback(null, { stdout: 'success', stderr: '' });
      });

      const consoleSpy = jest.spyOn(console, 'log');

      await Feature.installDeps('npm install', '/test/path');

      expect(mockExec).toHaveBeenCalledWith(
        'npm install',
        expect.objectContaining({ cwd: '/test/path' }),
        expect.any(Function)
      );
      expect(consoleSpy).toHaveBeenCalledWith('success');
    });
  });

  describe('remove', () => {
    it('should log message when no paths provided', () => {
      Feature.remove([]);
      expect(Logger.justlog).toHaveBeenCalledWith('No resources to delete...');
    });

    it('should remove files/directories', () => {
      const paths = ['path1', 'path2'];
      (fs.rmSync as jest.Mock).mockImplementation(() => {});

      Feature.remove(paths);

      expect(fs.rmSync).toHaveBeenCalledTimes(2);
      expect(fs.rmSync).toHaveBeenCalledWith('path1', { recursive: true });
      expect(fs.rmSync).toHaveBeenCalledWith('path2', { recursive: true });
    });
  });

  describe('runCommands', () => {
    it('should log message when no commands provided', async () => {
      await Feature.runCommands([]);
      expect(Logger.justlog).toHaveBeenCalledWith('No commands to run...');
    });
    it('should execute commands successfully', async () => {
      const mockExec = jest.mocked(exec) as unknown as jest.Mock;
      mockExec.mockImplementation((command, callback) => {
        callback(null, { stdout: 'success', stderr: '' });
      });

      await Feature.runCommands(['command1', 'command2']);

      expect(mockExec).toHaveBeenCalledTimes(2);
      expect(Logger.justlog).toHaveBeenCalledWith("Command 'command1' out: ", 'success');
    });
    it('should handle command execution errors', async () => {
      const mockExec = jest.mocked(exec) as unknown as jest.Mock;
      mockExec.mockImplementation((command, callback) => {
        callback(new Error('Command failed'), { stdout: '', stderr: 'error' });
      });

      await Feature.runCommands(['command1']);

      expect(Logger.justlog).toHaveBeenCalledWith(
        'The command could not be executed: ',
        'Command failed'
      );
    });
  });
});
