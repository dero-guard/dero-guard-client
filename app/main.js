const path = require('path');
const { app, BrowserWindow, ipcMain, Tray } = require('electron');

const { providers, refill, disconnect, bandwidth } = require("./core/macos");

const assetsDirectory = path.join(__dirname, 'assets');

let tray = undefined;
let window = undefined;

app.dock.hide();

app.on('ready', () => {
    createTray();
    createWindow();
});

app.on('window-all-closed', () => app.quit());

function createTray()
{
    tray = new Tray(path.join(assetsDirectory, 'tray.png'))
    tray.on('right-click', toggleWindow);
    tray.on('double-click', toggleWindow);
    tray.on('click', function (event) {
        toggleWindow();
        
        if (window.isVisible() && process.defaultApp && event.metaKey) {
            window.openDevTools({mode: 'detach'})
        }
    }) ;
}

function getWindowPosition()
{
    const windowBounds = window.getBounds();
    const trayBounds = tray.getBounds();
    
    const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));
    const y = Math.round(trayBounds.y + trayBounds.height + 4);
    
    return { x, y };
}

function createWindow()
{
    window = new BrowserWindow({
        width: 450,
        height: 675,
        show: false,
        frame: false,
        fullscreenable: false,
        resizable: false,
        webPreferences: {
            backgroundThrottling: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    
    window.loadURL('http://localhost:3000/');
    
    window.on('blur', () => {
        if (!window.webContents.isDevToolsOpened()) {
            window.hide();
        }
    });
}

function toggleWindow()
{
    if (window.isVisible()) {
        window.hide();
    } else {
        showWindow();
    }
}

function showWindow()
{
    const position = getWindowPosition();
    window.setPosition(position.x, position.y, false);
    
    window.show();
    window.focus();
}

ipcMain.on('providers', e => e.returnValue = providers());
ipcMain.on('refill', (e, { key, amount }) => {
    e.reply('refill-reply', refill(key, amount));
});
ipcMain.on('disconnect', (e, key) => e.returnValue = disconnect(key));
ipcMain.on('bandwidth', (e, key) => {
    console.log(`Key: '${key}'`);
    return e.returnValue = bandwidth(key);
});
