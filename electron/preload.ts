const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    saveSetup: (data) => { ipcRenderer.send("save_setup", data) },
    saveLeagueTeam: (data) => { ipcRenderer.send("save_league_team", data) },
    saveLeagueAdv: (data) => { ipcRenderer.send("save_league_adv", data) },
    saveTeamSetup: (data) => { ipcRenderer.send("save_team_setup", data) },
    logo: (type, name, file) => ipcRenderer.invoke("logo", type, name, file),
    load: () => ipcRenderer.invoke("load"),
    loadTeamSetup: () => ipcRenderer.invoke("load_team_setup"),
    teamProcessingStart: () => { ipcRenderer.send("team_processing_start") },
    teamProcessingStop: () => { ipcRenderer.send("team_processing_stop") },
    selectDirectory: (path) => ipcRenderer.invoke("select_directory", path) 
});
