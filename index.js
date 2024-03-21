const path = require('path');
const fs = require('fs');
const JSZip = require('jszip');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const tag = '[PostBuildPrepare]';
const resources = {
  packageJson: {
    source: path.resolve(__dirname, '../package.json'),
    destination: path.resolve(__dirname, '../dist/package.json'),
  },
  env: {
    source: path.resolve(__dirname, '../.env'),
    destination: path.resolve(__dirname, '../dist/.env'),
  },
  npm: {
    cwd: path.resolve(__dirname, '../dist'),
    command: 'npm install',
  },
  compressing: {
    source: path.resolve(__dirname, '../dist'),
    destination: path.resolve(__dirname, '../dist-zip/dist.zip'),
    zipDestDirectory: path.resolve(__dirname, '../dist-zip'),
  },
};

const srcPackageJson = require(resources.packageJson.source);
const dstPackageJson = {};

const keepEntries = [
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
];

const addEntries = [];

const logger = (msg, ...optionalParams) => {
  console.log(`${tag}[${Date.now()}] ${msg}`, ...optionalParams);
};

const zipDirectory = (folderPath, zipFilePath) => {
  const zip = new JSZip();

  const addDirectoryToZip = (zipFile, folderPath, currentPath = '') => {
    const files = fs.readdirSync(path.join(folderPath, currentPath));

    for (const file of files) {
      const filePath = path.join(currentPath, file);
      const fullFilePath = path.join(folderPath, filePath);
      const stats = fs.statSync(fullFilePath);

      if (stats.isDirectory()) {
        addDirectoryToZip(zipFile, folderPath, filePath);
      } else {
        fileContent = fs.readFileSync(fullFilePath);
        zipFile.file(filePath, fileContent);
      }
    }
  };

  if (!fs.existsSync(resources.compressing.zipDestDirectory)) {
    fs.mkdirSync(resources.compressing.zipDestDirectory);
  }

  addDirectoryToZip(zip, folderPath);
  zip
    .generateAsync({ type: 'nodebuffer' })
    .then((content) => {
      fs.writeFileSync(zipFilePath, content);
    })
    .catch((error) => console.log(error));
};

const fileCopying = () => {
  logger('Copying packages...');

  keepEntries.forEach((param) => {
    dstPackageJson[param] = srcPackageJson[param];
  });

  addEntries.forEach((entry) => {
    dstPackageJson[entry.name] = entry.value;
  });

  const outPackageJson = JSON.stringify(dstPackageJson, null, 2);
  fs.writeFileSync(resources.packageJson.destination, outPackageJson);

  logger('Copying env...');
  fs.copyFileSync(resources.env.source, resources.env.destination);
};

const installDeps = async () => {
  try {
    logger('Installing dependencies...');
    const { stdout, stderr } = await exec(resources.npm.command, {
      cwd: resources.npm.cwd,
    });
    logger('Installing dependencies out', stdout);
    logger('Installing dependencies error', stderr);
  } catch (e) {
    console.error(e);
  }
};

(async () => {
  logger('Start script');
  fileCopying();
  await installDeps();

  setTimeout(() => {
    logger('Zipping start...');
    zipDirectory(
      resources.compressing.source,
      resources.compressing.destination
    );
    logger(`Zipped successfully in ${resources.compressing.zipDestDirectory}`);
    logger('End script');
  }, 2000);
})();
