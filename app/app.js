/**
 * Created by Tea on 2017/2/5.
 */
const {app, BrowserWindow, Tray} = require('electron');
const path = require('path');
const url = require('url');
const elemon = require('elemon');

let win, appIcon;

app.on('ready', () => {
    createWindow();

    elemon({
        app: app,
        mainFile: 'app.js',
        bws: [
            {bw: win, res: ['renderer.html', 'renderer.js', 'config.js', 'utils.js', 'renderer.css']}
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
    appIcon = new Tray(path.join(__dirname, '/img/jingyu.png'));

    win = new BrowserWindow({
        width: 850,
        height: 650,
        resizable: false,
        icon: path.join(__dirname, '/img/jingyu.png')
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, '/html/renderer.html'),
        protocol: 'file:',
        resizable: true
    }));

    win.on('new-window', (event) => {
        // 阻止打开新窗口
        event.preventDefault();
    });

    win.on('closed', () => {
        // 清除资源
        appIcon.destroy();
        win = null;
    });
}