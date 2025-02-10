import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import * as path from 'path'
import * as fs from 'fs'
import * as os from 'os'
import express, { Express } from 'express'

import { ConfigValues } from '../renderer/src/cck2_live_interface/ConfigValues'
import {
    // TeamConfig,
    AdvConfig,
    DefaultSetupConfig,
    DefaultAdvConfig,
    LiveConfig,
    SingleConfig,
    DefaultSingleConfig,
    SprintConfig,
    DefaultSprintConfig,
    TeamsConfig,
    DefaultTeamsConfig,
    LiveTeamConfig,
    LiveAdvConfig,
    Team4Config,
    DefaultTeam4Config,
    SetupConfig
} from '../renderer/src/cck2_live_interface/LiveConfig'

import PlayerProcessing from './PlayerProcessing'

const indexUrls = ['/', '/index.html']
const displayUrls = ['/TVLinks.html', '/TVRechts.html']
const streamUrls = ['/Stream.html']
const configUrls = ['/TVLinks.json', '/TVRechts.json', '/Stream.json']

const appDir = os.homedir() + '/cck2_live_electron'

function createIndex(req, res): void {
    let index =
        '<!DOCTYPE html><html><head><meta charset="utf-8"/></head>' +
        '<body>' +
        '<style> html * {font-family: Geneva, sans-serif} </style>' +
        '<h1>Ausgabedateien</h1>' +
        '<h2>Ergebnisanzeige</h2>' +
        '<ul>'
    for (const f of displayUrls) {
        index +=
            '<li> <a href="' +
            req.protocol +
            '://' +
            req.get('host') +
            f +
            '">' +
            req.protocol +
            '://' +
            req.get('host') +
            f +
            '</a>'
    }
    index += '</ul>' + '<h2>Streamoverlay</h2>' + '<ul>'
    for (const f of streamUrls) {
        index +=
            '<li> <a href="' +
            req.protocol +
            '://' +
            req.get('host') +
            f +
            '">' +
            req.protocol +
            '://' +
            req.get('host') +
            f +
            '</a>'
    }
    index +=
        '</ul>' +
        '<h2>Token Datei für CCK2</h2>' +
        '<ul>' +
        '<li> <a href="' +
        req.protocol +
        '://' +
        req.get('host') +
        '/tokens_team.json' +
        '">' +
        req.protocol +
        '://' +
        req.get('host') +
        '/tokens_team.json' +
        '</a>' +
        '</ul>' +
        '</body>' +
        '</html>'
    res.send(index)
}

function createConfig(outputId: number): LiveConfig {
    const teams: LiveTeamConfig[] = []
    for (let i = 0; i < configValues.team.length; ++i) {
        teams.push({
            bild_heim: configValues.team[i].logo[0],
            bild_gast: configValues.team[i].logo[1],
            anzahl_bahnen: Number(configValues.team[i].num_lanes),
            anzahl_spieler: Number(configValues.team[i].num_players),
            anzeigedauer_s: Number(configValues.team[i].time_values[outputId]),
            bahn_anzeigen: configValues.setup.lanes[outputId],
            token_datei: configValues.team[i].cck2_file[i],
            anzahl_saetze: 4,
            satzpunkte_anzeigen: configValues.team[i].set_points ? 'ja' : 'nein'
        } as LiveTeamConfig)
    }
    const adv: LiveAdvConfig[] = []
    for (let i = 0; i < configValues.adv.length; ++i) {
        if (configValues.adv[i].time_values[outputId] > 0) {
            adv.push({
                bild: configValues.adv[i].logo,
                werbung_anzeigen: configValues.setup.adv[outputId],
                anzeigedauer_s: configValues.adv[i].time_values[outputId]
            } as LiveAdvConfig)
        }
    }

    return { teams: teams, werbung: adv }
}

function createConfigTeam4(outputId: number): Team4Config[] {
    const team: Team4Config[] = []

    configValues.team4.forEach((t: Team4Config) => {
        if (t.time_values[outputId] > 0) {
            const tc = { ...t }
            tc.time_values = [t.time_values[outputId]]
            team.push(tc)
        }
    })

    return team
}

function UpdateFileLookup(setup: ConfigValues['setup']): void {
    displayUrls.length = 0
    streamUrls.length = 0
    configUrls.length = 0

    for (let i = 0; i < setup.output_name.length; ++i) {
        const name = setup.output_name[i]
        configUrls.push('/' + name + '.json')
        if (setup.type[i] == 'stream') {
            streamUrls.push('/' + name + '.html')
        } else {
            displayUrls.push('/' + name + '.html')
        }
    }
}

// initialize user directory
if (!fs.existsSync(appDir)) {
    fs.mkdirSync(appDir)
}
if (!fs.existsSync(path.join(appDir, 'logos'))) {
    fs.mkdirSync(path.join(appDir, 'logos'))
}
if (!fs.existsSync(path.join(appDir, 'setup.json'))) {
    fs.copyFileSync(path.join('app-data', 'setup.json'), path.join(appDir, 'setup.json'))
}
if (!fs.existsSync(path.join(appDir, 'team.json'))) {
    fs.copyFileSync(path.join('app-data', 'team.json'), path.join(appDir, 'team.json'))
}
if (!fs.existsSync(path.join(appDir, 'adv.json'))) {
    fs.copyFileSync(path.join('app-data', 'adv.json'), path.join(appDir, 'adv.json'))
}

try {
    const buff = fs.readFileSync(path.join(appDir, 'setup.json'), 'utf-8')
    const setup = JSON.parse(buff)
    UpdateFileLookup(setup)
} catch (err) {
    console.log(err)
}

// init
const configValues: ConfigValues = {
    setup: DefaultSetupConfig,
    team: [DefaultTeam4Config],
    adv: [DefaultAdvConfig],
    single: DefaultSingleConfig,
    sprint: DefaultSprintConfig,
    teams: DefaultTeamsConfig,
    team4: [DefaultTeam4Config, DefaultTeam4Config, DefaultTeam4Config]
}

const express_app: Express = express()
express_app.use(express.static('./static-html'))
express_app.use(express.static(appDir)) // serve logo files
express_app.use((req, res, next) => {
    let url = req.originalUrl
    if (url.indexOf('?') >= 0) {
        url = url.slice(0, url.indexOf('?'))
    }
    if (indexUrls.includes(url)) {
        createIndex(req, res)
    } else if (displayUrls.includes(url)) {
        res.sendFile(
            path.resolve('./static-html/display_' + configValues.setup.active_output + '.html')
        )
    } else if (streamUrls.includes(url)) {
        res.sendFile(
            path.resolve('./static-html/stream_' + configValues.setup.active_output + '.html')
        )
    } else if (configUrls.includes(url)) {
        const id = configUrls.indexOf(url)
        if (configValues.setup.active_output == 'league') {
            res.json(createConfig(id))
        } else if (configValues.setup.active_output == 'single') {
            res.json(null)
            console.log('config single')
        } else if (configValues.setup.active_output == 'sprint') {
            res.json(null)
            console.log('config sprint')
        } else if (configValues.setup.active_output == 'team4') {
            res.json(createConfigTeam4(id))
            console.log('config team 4')
        } else if (configValues.setup.active_output == 'team') {
            res.json(null)
            console.log('config team')
        }
    } else if (url == '/team_u23_m.json') {
        res.sendFile(path.resolve(configValues.teams.data_path, 'team_U23 männlich.json'))
    } else if (url == '/team_u23_w.json') {
        res.sendFile(path.resolve(configValues.teams.data_path, 'team_U23 weiblich.json'))
    } else if (configValues.team[0].cck2_file.indexOf(url.slice(1)) >= 0) {
        res.sendFile(path.resolve(configValues.setup.cck2_output_path + url))
    } else if (url.search('result') >= 0 || url.search('team_') >= 0 || url.search('sv') >= 0) {
        res.sendFile(path.resolve(configValues.setup.cck2_output_path + url))
    } else if (url.search('single_') >= 0) {
        res.sendFile(path.resolve(configValues.single.data_path + url))
    } else if (url.search('.json') >= 0) {
        res.sendFile(path.resolve(configValues.setup.cck2_output_path + url))
    } else {
        next()
    }
})

express_app.listen(80).on('error', () => {
    dialog.showErrorBox(
        'Fehler beim Programmstart',
        'Es ist bereits eine Instanz von CCK2 Live Elektron geöffnet\n' +
            'oder eine andere Anwendung nutzt Port 80.\n' +
            'Bitte beenden sie diese Anwendung und starten sie danch CCK2 Live Elektron erneut. \n\n' +
            'Das Programm nach dem Drücken von OK beendet.'
    )
    app.exit(-1)
})

function createWindow(): void {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        show: false,
        autoHideMenuBar: true,
        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
            preload: path.join(__dirname, '../preload/index.js'),
            sandbox: false
        }
    })

    mainWindow.on('ready-to-show', () => {
        mainWindow.show()
    })

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return { action: 'deny' }
    })

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
        mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron')

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    // communication using ipcMain
    ipcMain.on('save_setup', (_, data) => {
        fs.writeFileSync(path.join(appDir, 'setup.json'), JSON.stringify(data))
        UpdateFileLookup(data)
        configValues.setup = { ...data }
    })
    ipcMain.on('save_league_team', (_, data) => {
        console.log(JSON.stringify(data))
        fs.writeFileSync(path.join(appDir, 'team.json'), JSON.stringify(data))
        configValues.team = [...data]
    })
    ipcMain.on('save_league_adv', (_, data) => {
        fs.writeFileSync(path.join(appDir, 'adv.json'), JSON.stringify(data))
        configValues.adv = [...data]
    })
    ipcMain.on('save_team_setup', (_, data: TeamsConfig) => {
        fs.writeFileSync(path.join(appDir, 'team_setup.json'), JSON.stringify(data))
        configValues.teams = { ...data }
    })
    ipcMain.on('save_team4_setup', (_, data: Team4Config[]) => {
        fs.writeFileSync(path.join(appDir, 'team4_setup.json'), JSON.stringify(data))
        configValues.team4 = [...data]
    })
    ipcMain.on('save_single_setup', (_, data: SingleConfig) => {
        fs.writeFileSync(path.join(appDir, 'single_setup.json'), JSON.stringify(data))
        configValues.single = { ...data }
    })
    ipcMain.on('save_sprint_setup', (_, data: SprintConfig) => {
        fs.writeFileSync(path.join(appDir, 'sprint_setup.json'), JSON.stringify(data))
        configValues.sprint = { ...data }
    })
    ipcMain.on('save_adv_setup', (_, data: AdvConfig[]) => {
        fs.writeFileSync(path.join(appDir, 'adv.json'), JSON.stringify(data))
        configValues.adv = [...data]
    })
    ipcMain.handle('logo', (_, type: string, name: string, filepath: string) => {
        const target = path.join(appDir, 'logos', type, name)
        try {
            if (!fs.existsSync(path.join(appDir, 'logos', type))) {
                fs.mkdirSync(path.join(appDir, 'logos', type))
            }
            fs.copyFileSync(filepath, target)
        } catch {
            console.log('cannot copy file: ' + filepath + ' to ' + target)
            return null
        }
        return name
    })

    ipcMain.handle('load', () => {
        let buff: string
        try {
            buff = fs.readFileSync(path.join(appDir, 'setup.json'), 'utf-8')
            configValues.setup = JSON.parse(buff)
        } catch (err) {
            console.log(err)
        }
        try {
            buff = fs.readFileSync(path.join(appDir, 'team.json'), 'utf-8')
            const a = JSON.parse(buff)
            let ok = false
            try {
                if (a.constructor === Array) {
                    configValues.team = a
                    ok = true
                }
            } catch (err) { }
            try {
                if (!ok && a.name.constructor === Array) {
                    configValues.team = []
                    for (let i = 0; i < a.name.length; ++i) {
                        let team: Team4Config = {
                            name: a.name[i], logo: [a.logo_home[i], a.logo_guest[i]], 
                            num_lanes: a.num_lanes[i], num_players: a.num_players[i],
                            set_points: a.set_points[i], time_values: a.time_values[i], cck2_file: a.cck2_file[i]
                        }
                        configValues.team.push(team)
                    }
                }
                ok = true
            } catch (err) {}
            if (!ok) {
                configValues.team = [DefaultTeam4Config] 
            }
        } catch (err) {
            console.log(err)
        }
        try {
            buff = fs.readFileSync(path.join(appDir, 'adv.json'), 'utf-8')
            const a = JSON.parse(buff)
            let ok = false
            try {
                if (a.constructor === Array) {
                    configValues.adv = a
                    ok = true
                }
            } catch (err) {}
            
            try {
                if (!ok && a.name.constructor === Array) {
                    configValues.adv = []
                    for (let i = 0; i < a.name.length; ++i) {
                        let adv: AdvConfig = { name: a.name[i], logo: a.logo[i], time_values: a.time_values[i] }
                        configValues.adv.push(adv)
                    }
                    ok = true
                }
            } catch (err) {}

            if (!ok) {
                configValues.adv = [DefaultAdvConfig]
            }
        } catch (err) {
            console.log(err)
        }
        try {
            buff = fs.readFileSync(path.join(appDir, 'single_setup.json'), 'utf-8')
            configValues.single = JSON.parse(buff)
        } catch (err) {
            console.log(err)
        }
        try {
            buff = fs.readFileSync(path.join(appDir, 'sprint_setup.json'), 'utf-8')
            configValues.sprint = JSON.parse(buff)
        } catch (err) {
            console.log(err)
        }
        try {
            buff = fs.readFileSync(path.join(appDir, 'team_setup.json'), 'utf-8')
            configValues.teams = JSON.parse(buff)
        } catch (err) {
            console.log(err)
        }
        try {
            buff = fs.readFileSync(path.join(appDir, 'team4_setup.json'), 'utf-8')
            configValues.team4 = JSON.parse(buff)
        } catch (err) {
            console.log(err)
        }

        return configValues
    })
    ipcMain.handle('load_version', () => { 
        return app.getVersion()
    })
    ipcMain.handle('load_setup', (): null | ConfigValues => {
        return configValues
    })

    ipcMain.handle('load_team_setup', (): null | TeamsConfig => {
        return configValues.teams
    })

    ipcMain.handle('load_team4_setup', (): null | { team: Team4Config[]; setup: SetupConfig } => {
        return { team: configValues.team4, setup: configValues.setup }
    })

    ipcMain.handle('load_single_setup', (): null | SingleConfig => {
        return configValues.single
    })

    ipcMain.handle('load_sprint_setup', (): null | SprintConfig => {
        return configValues.sprint
    })

    ipcMain.handle('load_adv_setup', (): null | { adv: AdvConfig[]; setup: SetupConfig } => {
        console.log(configValues.adv)
        return { adv: configValues.adv, setup: configValues.setup }
    })

    ipcMain.handle('load_league_setup', (): null | { team: Team4Config[]; setup: SetupConfig } => {
        return { team: configValues.team, setup: configValues.setup }
    })

    let tp: null | PlayerProcessing = null
    let tpIntervalId: ReturnType<typeof setInterval>
    ipcMain.on('team_processing_start', () => {
        console.log('team_processing_start')
        if (tp == null) {
            tp = new PlayerProcessing(null, configValues.teams, configValues.setup.cck2_output_path)
            tp.do()
            tpIntervalId = setInterval(() => {
                if (tp != null) tp.do()
            }, 1000)
        }
    })
    ipcMain.on('team_processing_stop', () => {
        console.log('team_processing_stop')
        if (tp != null) {
            clearInterval(tpIntervalId)
            tp = null
        }
    })
    let pp: null | PlayerProcessing = null
    let ppIntervalId: ReturnType<typeof setInterval>
    ipcMain.on('single_processing_start', () => {
        console.log('single_processing_start')
        if (pp == null) {
            const buff = fs.readFileSync(path.join(appDir, 'single_setup.json'), 'utf-8')
            const single_setup = JSON.parse(buff)
            pp = new PlayerProcessing(single_setup, null, configValues.setup.cck2_output_path)
            pp.do()
            ppIntervalId = setInterval(() => {
                if (pp != null) pp.do()
            }, 1000)
        }
    })
    ipcMain.on('single_processing_stop', () => {
        console.log('single_processing_stop')
        if (pp != null) {
            clearInterval(ppIntervalId)
            pp = null
        }
    })
    ipcMain.on('sprint_processing_start', () => {
        console.log('sprint_processing_start')
    })
    ipcMain.on('team_processing_stop', () => {
        console.log('team_processing_stop')
    })
    ipcMain.handle('select_directory', async (_, path: string) => {
        console.log('select_directory')
        return await dialog.showOpenDialog({ properties: ['openDirectory'], defaultPath: path })
    })

    createWindow()

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
