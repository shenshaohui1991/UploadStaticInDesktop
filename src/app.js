/**
 * Created by Tea on 2017/2/5.
 */
const {app, dialog, BrowserWindow, Tray, Menu, MenuItem} = require('electron');
const path = require('path');
const url = require('url');
//const elemon = require('elemon');

let win, tray, contextMenu, appMenu;

initApp();

function initApp() {
    app.on('ready', () => {
        createTray();
        createWindow();
        createMenu();

        // auto reload
        /*elemon({
            app: app,
            mainFile: 'app.js',
            bws: [
                {
                    bw: win,
                    res: []
                }
            ]
        });*/
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
            createTray();
            createWindow();
        }
    });
}

function createTray() {
    tray = new Tray(path.join(__dirname, '/img/jingyu.png'));
    contextMenu = Menu.buildFromTemplate([
        {
            label: '打开',
            click: function () {
                win.show();
                win.center();
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
}

function createWindow() {
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
        protocol: 'file:'
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

    //win.webContents.openDevTools();

    win.webContents.on('crashed', function () {
        dialog.showMessageBox({
            type: 'info',
            title: '程序崩溃啦！',
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

function createMenu() {
    appMenu = new Menu();
    appMenu.append(new MenuItem({
        label: '关于',
        click() {
            dialog.showMessageBox(win, {
                type: 'info',
                title: '关于',
                message: '这人很懒，什么都没有写。。',
                buttons: ['OK']
            });
        }
    }));
    Menu.setApplicationMenu(appMenu);
}