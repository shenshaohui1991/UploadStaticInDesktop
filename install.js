#!/usr/bin/env node

const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller;
const path = require('path');
const rimraf = require('rimraf');

deleteOutputFolder()
    .then(getInstallerConfig)
    .then(createWindowsInstaller)
    .catch((error) => {
        console.error(error.message || error);
        process.exit(1);
    });

function getInstallerConfig () {
    const rootPath = path.join(__dirname, '.');
    const outPath = path.join(rootPath, 'build');

    return Promise.resolve({
        authors: 'ssh',
        exe: 'jingyu.exe',
        appDirectory: path.join(outPath, 'whale-win32-x64'),
        iconUrl: path.join(rootPath, 'app/img/jingyu.ico'),
        loadingGif: path.join(rootPath, 'app/img/jingyu.png'),
        outputDirectory: path.join(outPath, 'windows-installer'),
        setupExe: 'jingyu.exe',
        setupIcon: path.join(rootPath, 'app/img/jingyu.ico'),
        skipUpdateIcon: true
    });
}

function deleteOutputFolder () {
    return new Promise((resolve, reject) => {
        rimraf(path.join(__dirname, '..', 'out', 'windows-installer'), (error) => {
            error ? reject(error) : resolve();
        });
    });
}