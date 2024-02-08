import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import * as path from 'path'
import * as fs from 'fs'
import * as os from 'os'
import express, { Express } from 'express'

import { ConfigValues } from '../renderer/src/cck2_live_interface/ConfigValues'
import { TeamConfig, AdvConfig } from '../renderer/src/cck2_live_interface/LiveConfig'

import TeamProcessing from './TeamProcessing'

const indexUrls = ['/', '/index.html']
const displayUrls = ['/TVLinks.html', '/TVRechts.html']
const streamUrls = ['/Stream.html']
const configUrls = ['/TVLinks.json', '/TVRechts.json', '/Stream.json']

let configValues: ConfigValues

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

function createConfig(outputId: number): { teams; werbung } {
    const teams: Array<TeamConfig> = []
    for (let i = 0; i < configValues.team.name.length; ++i) {
        teams.push({
            bild_heim: configValues.team.logo_home[i],
            bild_gast: configValues.team.logo_guest[i],
            anzahl_bahnen: Number(configValues.team.num_lanes[i]),
            anzahl_spieler: Number(configValues.team.num_players[i]),
            anzeigedauer_s: Number(configValues.team.time_values[i][outputId]),
            bahn_anzeigen: configValues.setup.lanes[outputId],
            token_datei: configValues.team.cck2_file[i],
            anzahl_saetze: 4,
            satzpunkte_anzeigen: configValues.team.set_points[i] ? 'ja' : 'nein'
        } as TeamConfig)
    }
    const adv: Array<AdvConfig> = []
    for (let i = 0; i < configValues.adv.logo.length; ++i) {
        adv.push({
            bild: configValues.adv.logo[i],
            werbung_anzeigen: configValues.setup.adv[outputId],
            anzeigedauer_s: configValues.adv.time_values[i][outputId]
        } as AdvConfig)
    }

    return { teams: teams, werbung: adv }
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
try {
    let buff = fs.readFileSync(path.join(appDir, 'setup.json'), 'utf-8')
    const setup = JSON.parse(buff)
    buff = fs.readFileSync(path.join(appDir, 'team.json'), 'utf-8')
    const team = JSON.parse(buff)
    buff = fs.readFileSync(path.join(appDir, 'adv.json'), 'utf-8')
    const adv = JSON.parse(buff)
    configValues = { setup: setup, team: team, adv: adv }
} catch (err) {
    console.log(err)
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
        res.sendFile(path.resolve('./static-html/display.html'))
    } else if (streamUrls.includes(url)) {
        res.sendFile(path.resolve('./static-html/stream.html'))
    } else if (configUrls.includes(url)) {
        const id = configUrls.indexOf(url)
        res.json(createConfig(id))
    } else if (configValues.team.cck2_file.indexOf(url.slice(1)) >= 0) {
        res.sendFile(path.resolve(configValues.setup.cck2_output_path + url))
    } else if (url.search('result') >= 0 || url.search('team_') >= 0 || url.search('sv') >= 0) {
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
        width: 900,
        height: 670,
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
    ipcMain.on('save_setup', (event, data) => {
        fs.writeFileSync(path.join(appDir, 'setup.json'), JSON.stringify(data))
        UpdateFileLookup(data)
        configValues.setup = { ...data }
    })
    ipcMain.on('save_league_team', (event, data) => {
        console.log(JSON.stringify(data))
        fs.writeFileSync(path.join(appDir, 'team.json'), JSON.stringify(data))
        configValues.team = { ...data }
    })
    ipcMain.on('save_league_adv', (event, data) => {
        fs.writeFileSync(path.join(appDir, 'adv.json'), JSON.stringify(data))
        configValues.adv = { ...data }
    })
    ipcMain.on('save_team_setup', (event, data) => {
        fs.writeFileSync(path.join(appDir, 'team_setup.json'), JSON.stringify(data))
    })
    ipcMain.handle('logo', (event, type: string, name: string, filepath: string) => {
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
        let buff = fs.readFileSync(path.join(appDir, 'setup.json'), 'utf-8')
        const setup = JSON.parse(buff)
        buff = fs.readFileSync(path.join(appDir, 'team.json'), 'utf-8')
        const team = JSON.parse(buff)
        buff = fs.readFileSync(path.join(appDir, 'adv.json'), 'utf-8')
        const adv = JSON.parse(buff)

        configValues = { setup: setup, team: team, adv: adv }

        return { config: configValues, version: app.getVersion() }
    })

    ipcMain.handle('load_team_setup', () => {
        try {
            const buff = fs.readFileSync(path.join(appDir, 'team_setup.json'), 'utf-8')
            const team_setup = JSON.parse(buff)
            return team_setup
        } catch (error) {
            return null
        }
    })

    ipcMain.handle('load_single_setup', () => {
        return null
    })

    ipcMain.handle('load_sprint_setup', () => {
        return null
    })

    let tp: null | TeamProcessing = null
    let tpIntervalId: ReturnType<typeof setInterval>
    ipcMain.on('team_processing_start', () => {
        console.log('team_processing_start')
        if (tp == null) {
            const buff = fs.readFileSync(path.join(appDir, 'team_setup.json'), 'utf-8')
            const team_setup = JSON.parse(buff)
            team_setup.cck2_output_files = path.join(
                configValues.setup.cck2_output_path,
                team_setup.cck2_output_files
            )
            tp = new TeamProcessing(team_setup)
            tp.do()
            tpIntervalId = setInterval(() => {
                if (tp != null) tp.do()
            }, 3000)
        }
    })
    ipcMain.on('team_processing_stop', () => {
        console.log('team_processing_stop')
        if (tp != null) {
            clearInterval(tpIntervalId)
            tp = null
        }
    })
    ipcMain.on('single_processing_start', () => {
        console.log('single_processing_start')
    })
    ipcMain.on('single_processing_stop', () => {
        console.log('single_processing_stop')
    })
    ipcMain.on('sprint_processing_start', () => {
        console.log('sprint_processing_start')
    })
    ipcMain.on('team_processing_stop', () => {
        console.log('team_processing_stop')
    })
    ipcMain.handle('select_directory', async (_event: Electron.IpcMainInvokeEvent, path: string) => {
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
