const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    saveSetup: (data) => {console.log("saveSetup ipc"); ipcRenderer.send("save-setup", data)},
    saveTeam: (data) => {console.log("saveTeam ipc"); ipcRenderer.send("team.json", data)},
    saveAdv: (data) => {console.log("saveAdv ipc"); ipcRenderer.send("save_adv", data)},
    logo: (type, name, file, callback) => ipcRenderer.send("logo", type, name, file, callback),
    load: () => ipcRenderer.invoke("load")
});
