import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ipcRenderer } from 'electron'

import { ConfigValues } from '../renderer/src/cck2_live_interface/ConfigValues'
import {
    SingleConfig,
    SprintConfig,
    TeamsConfig
} from '../renderer/src/cck2_live_interface/LiveConfig'

// Custom APIs for renderer
export const cck2liveAPI = {
    saveSetup: (data): void => {
        ipcRenderer.send('save_setup', data)
    },
    saveLeagueTeam: (data): void => {
        ipcRenderer.send('save_league_team', data)
    },
    saveLeagueAdv: (data): void => {
        ipcRenderer.send('save_league_adv', data)
    },
    saveTeamSetup: (data): void => {
        ipcRenderer.send('save_team_setup', data)
    },
    saveSingleSetup: (data): void => {
        ipcRenderer.send('save_single_setup', data)
    },
    saveSprintSetup: (data): void => {
        ipcRenderer.send('save_sprint_setup', data)
    },
    logo: (type, name, file): Promise<string | null> =>
        ipcRenderer.invoke('logo', type, name, file),
    load: (): Promise<{ config: ConfigValues, version: string }> => ipcRenderer.invoke('load'),
    loadTeamSetup: (): Promise<TeamsConfig> => ipcRenderer.invoke('load_team_setup'),
    loadSingleSetup: (): Promise<SingleConfig> => ipcRenderer.invoke('load_single_setup'),
    loadSprintSetup: (): Promise<SprintConfig> => ipcRenderer.invoke('load_sprint_setup'),
    teamProcessingStart: (): void => {
        ipcRenderer.send('team_processing_start')
    },
    teamProcessingStop: (): void => {
        ipcRenderer.send('team_processing_stop')
    },
    singleProcessingStart: (): void => {
        ipcRenderer.send('single_processing_start')
    },
    singleProcessingStop: (): void => {
        ipcRenderer.send('single_processing_stop')
    },
    sprintProcessingStart: (): void => {
        ipcRenderer.send('sprint_processing_start')
    },
    sprintProcessingStop: (): void => {
        ipcRenderer.send('sprint_processing_stop')
    },
    sprintCreateSVFile: (): void => {
        ipcRenderer.send('sprint_create_sv_file')
    },
    selectDirectory: (path): Promise<Electron.OpenDialogReturnValue> =>
        ipcRenderer.invoke('select_directory', path)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI)
        contextBridge.exposeInMainWorld('cck2live', cck2liveAPI)
    } catch (error) {
        console.error(error)
    }
} else {
    // @ts-ignore (define in dts)
    window.electron = electronAPI
    // @ts-ignore (define in dts)
    window.cck2live = cck2liveAPI
}
