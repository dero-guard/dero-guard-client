const { contextBridge, ipcRenderer, shell } = require("electron");

let refillCallback = null;

ipcRenderer.on('refill-reply', (_, arg) => refillCallback && refillCallback(arg))

contextBridge.exposeInMainWorld('__dg_open', link => {
    shell.openExternal(link).catch(err => {
        console.error(`Error while opening link '${link}'`);
        console.error(err);
    });
});

contextBridge.exposeInMainWorld('__dg_providers', () => ipcRenderer.sendSync('providers'));
contextBridge.exposeInMainWorld('__dg_refill', (key, amount, callback) => {
    ipcRenderer.send('refill', { key, amount });
    refillCallback = callback;
});
contextBridge.exposeInMainWorld('__dg_disconnect', key => ipcRenderer.send('disconnect', key));
contextBridge.exposeInMainWorld('__dg_bandwidth', key => ipcRenderer.sendSync('bandwidth', key));

