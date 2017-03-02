/**
 * Created by Tea on 2017/2/5.
 */
const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
const elemon = require('elemon');

let win;

app.on('ready', () => {
    createWindow();

    elemon({
        app: app,
        mainFile: 'app.js',
        bws: [
            {bw: win, res: ['renderer.html', 'renderer.js', 'renderer.css']}
        ]
    })
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// for mac
app.on('activate', () => {
    if (win == null) {
        createWindow();
    }
});

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, '/html/renderer.html'),
        protocol: 'file:',
        slashes: true
    }));

    win.webContents.openDevTools();

    win.on('closed', () => {
        win = null;
    });
}