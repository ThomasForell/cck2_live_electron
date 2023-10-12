const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    saveSetup: (data) => {console.log("saveSetup ipc"); ipcRenderer.send("save_setup", data)},
    saveTeam: (data) => {console.log("saveTeam ipc"); ipcRenderer.send("save_team", data)},
    saveAdv: (data) => {console.log("saveAdv ipc"); ipcRenderer.send("save_adv", data)},
    logo: (type, name, file, callback) => ipcRenderer.invoke("logo", type, name, file),
    load: () => ipcRenderer.invoke("load")
});
