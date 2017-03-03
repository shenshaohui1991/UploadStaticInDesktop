/**
 * Created by Tea on 2017/2/5.
 */
const {app, dialog, BrowserWindow, Tray, Menu} = require('electron');
const path = require('path');
const url = require('url');
const elemon = require('elemon');

let win, tray, contextMenu;

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
        tray.destroy();
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
    tray = new Tray(path.join(__dirname, '/img/jingyu.png'));
    contextMenu = Menu.buildFromTemplate([
        {
            label: '打开',
            click: function () {
                win.show();
            }
        },
        {
            label: '退出',
            click: function () {
                app.quit();
            }
        }
    ]);

    tray.setToolTip('上传静态资源');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
        if (!win.isVisible()) {
            win.show();
            win.center();
        }
    });

    win = new BrowserWindow({
        width: 850,
        height: 650,
        resizable: false,
        show: false,
        backgroundColor: '#f7f5f2',
        icon: path.join(__dirname, '/img/jingyu.png')
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, '/html/renderer.html'),
        protocol: 'file:',
        resizable: true
    }));

    win.on('ready-to-show', () => {
        win.show();
    });

    win.on('minimize', () => {
        win.hide();
    });

    win.on('new-window', (event) => {
        // 阻止打开新窗口
        event.preventDefault();
    });

    win.on('closed', () => {
        // 清除资源
        tray.destroy();
        win = null;
    });

    win.webContents.on('crashed', function () {
        dialog.showMessageBox({
            type: 'info',
            title: '不好意思程序崩溃啦~',
            message: '程序崩溃啦！',
            buttons: ['重启程序', '关闭']
        }, function (index) {
            if (index === 0) {
                win.reload();
            } else {
                win.close();
            } 
        })
    });
}