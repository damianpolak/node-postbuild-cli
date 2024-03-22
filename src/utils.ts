/* eslint-disable @typescript-eslint/no-explicit-any */
import JSZip from 'jszip';
import path from 'path';
import fs from 'fs';
import { Logger } from './logger';
import { Path } from './types';
import util from 'util';
import { exec } from 'child_process';

export class Util {
  private constructor() {}
  static zipDirectory(folderPath: string | undefined, zipFilePath: string | undefined): void {
    if (!folderPath || !zipFilePath) {
      Logger.justlog('Compress directory path and destination path cannot be empty');
    } else {
      const zip = new JSZip();

      const addDirectoryToZip = (zipFile: JSZip, folderPath: string, currentPath = '') => {
        const files = fs.readdirSync(path.join(folderPath, currentPath));

        for (const file of files) {
          const filePath = path.join(currentPath, file);
          const fullFilePath = path.join(folderPath, filePath);
          const stats = fs.statSync(fullFilePath);

          if (stats.isDirectory()) {
            addDirectoryToZip(zipFile, folderPath, filePath);
          } else {
            const fileContent = fs.readFileSync(fullFilePath);
            zipFile.file(filePath, fileContent);
          }
        }
      };

      if (!fs.existsSync(zipFilePath)) {
        fs.mkdirSync(zipFilePath);
      }

      addDirectoryToZip(zip, folderPath);
      zip
        .generateAsync({ type: 'nodebuffer' })
        .then((content) => {
          fs.writeFileSync(path.join(zipFilePath, 'dist.zip'), content);
        })
        .catch((error) => console.log(error));
    }
  }

  static async packagesProcess(
    packageDirectory: string | undefined,
    destPackageDirectory: string | undefined,
    keepEntries: string[] | undefined = [],
    addEntries: Record<string, any>[] = []
  ): Promise<void> {
    if (!packageDirectory || !destPackageDirectory) {
      Logger.justlog('Package source and destination directory cannot be empty');
    } else {
      try {
        const srcPackageJson = await fs.promises.readFile(
          path.join(packageDirectory, 'package.json'),
          'utf8'
        );
        const dstPackageJson: Record<string, unknown> = {};

        keepEntries.forEach((param) => {
          dstPackageJson[param] = JSON.parse(srcPackageJson)[param];
        });

        addEntries.forEach((entry) => {
          dstPackageJson[entry.name] = entry.value;
        });

        const outPackageJson = JSON.stringify(dstPackageJson, null, 2);
        fs.writeFileSync(path.join(destPackageDirectory, 'package.json'), outPackageJson);
      } catch (e) {
        Logger.justlog('Something is wrong with package rebuild process...', e);
      }
    }
  }

  static async copyFiles(files: Path[]): Promise<void> {
    try {
      for await (const file of files) {
        await fs.promises.copyFile(file.source, file.destination);
      }
    } catch (e) {
      Logger.justlog('Something is wrong with copying files...');
    }
  }

  static async installDeps(npmCommand: string, runLocation: string): Promise<void> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { stdout, stderr } = await util.promisify(exec)(npmCommand, { cwd: runLocation });
      console.log(stdout);
      console.log(stderr);
    } catch (e) {
      console.error(e);
    }
  }
}
