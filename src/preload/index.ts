import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI)
        contextBridge.exposeInMainWorld('api', api)

        contextBridge.exposeInMainWorld('electronAPI', {
            saveSetup: (data) => {
                ipcRenderer.send('save_setup', data)
            },
            saveLeagueTeam: (data) => {
                ipcRenderer.send('save_league_team', data)
            },
            saveLeagueAdv: (data) => {
                ipcRenderer.send('save_league_adv', data)
            },
            saveTeamSetup: (data) => {
                ipcRenderer.send('save_team_setup', data)
            },
            saveSingleSetup: (data) => {
                ipcRenderer.send('save_single_setup', data)
            },
            saveSprintSetup: (data) => {
                ipcRenderer.send('save_sprint_setup', data)
            },
            logo: (type, name, file) => ipcRenderer.invoke('logo', type, name, file),
            load: () => ipcRenderer.invoke('load'),
            loadTeamSetup: () => ipcRenderer.invoke('load_team_setup'),
            loadSingleSetup: () => ipcRenderer.invoke('load_single_setup'),
            loadSprintSetup: () => ipcRenderer.invoke('load_sprint_setup'),
            teamProcessingStart: () => {
                ipcRenderer.send('team_processing_start')
            },
            teamProcessingStop: () => {
                ipcRenderer.send('team_processing_stop')
            },
            singleProcessingStart: () => {
                ipcRenderer.send('single_processing_start')
            },
            singleProcessingStop: () => {
                ipcRenderer.send('single_processing_stop')
            },
            sprintProcessingStart: () => {
                ipcRenderer.send('sprint_processing_start')
            },
            sprintProcessingStop: () => {
                ipcRenderer.send('sprint_processing_stop')
            },
            selectDirectory: (path) => ipcRenderer.invoke('select_directory', path)
        })
    } catch (error) {
        console.error(error)
    }
} else {
    // @ts-ignore (define in dts)
    window.electron = electronAPI
    // @ts-ignore (define in dts)
    window.api = api
}
