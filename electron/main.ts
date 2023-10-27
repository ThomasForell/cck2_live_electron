import { app, BrowserWindow, nativeTheme, dialog, ipcMain } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import * as express from 'express';
import * as fs from 'fs';
import * as os from 'os';

import {ConfigValues} from '../cck2_live_interface/ConfigValues';
import {TeamConfig, AdvConfig} from '../cck2_live_interface/LiveConfig';

const indexUrls = ["/", "/index.html"]
const displayUrls = ["/TVLinks.html", "/TVRechts.html"];
const streamUrls = ["/Stream.html"];
const configUrls = ["/TVLinks.json", "/TVRechts.json", "/Stream.json"];

let configValues: ConfigValues;

const appDir = os.homedir() + "/cck2_live_electron";

function createIndex(req, res) {
  let index =       
    '<!DOCTYPE html><html><head><meta charset="utf-8"/></head>'
    + '<body>'
    +   '<style> html * {font-family: Geneva, sans-serif} </style>'
    +   '<h1>Ausgabedateien</h1>'
    +   '<h2>Ergebnisanzeige</h2>'
    +   '<ul>';
  for (const f of displayUrls) {
    index += '<li> <a href="' + req.protocol + '://' + req.get('host')  + f + '">' + req.protocol + '://' + req.get('host')  + f + '</a>';
  }
  index += 
        '</ul>'
    +   '<h2>Streamoverlay</h2>'
    +   '<ul>';
  for (const f of streamUrls) {
    index += '<li> <a href="' + req.protocol + '://' + req.get('host')  + f + '">' + req.protocol + '://' + req.get('host')  + f + '</a>';
  }
  index +=
        '</ul>'
    +   '<h2>Token Datei für CCK2</h2>'
    +   '<ul>'
    +   '<li> <a href="' + req.protocol + '://' + req.get('host')  + '/tokens_team.json' + '">' + req.protocol + '://' + req.get('host')  + '/tokens_team.json' + '</a>'
    +   '</ul>'
    +   '</body>'
    + '</html>';
  res.send(index);
}

function createConfig(outputId: number) {
  let teams: Array<TeamConfig> = [];
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
        satzpunkte_anzeigen: (configValues.team.set_points[i]) ? "ja" : "nein"} as TeamConfig);
  }
  let adv: Array<AdvConfig> = [];
  for (let i = 0; i < configValues.adv.logo.length; ++i) {
    adv.push({bild: configValues.adv.logo[i], 
      werbung_anzeigen: configValues.setup.adv[outputId],
      anzeigedauer_s:configValues.adv.time_values[i][outputId] } as AdvConfig);
  }

  return {teams: teams, werbung: adv}; 
}

function UpdateFileLookup(setup: ConfigValues["setup"]) {
  displayUrls.length = 0;
  streamUrls.length = 0;
  configUrls.length = 0;
  
  for (let i = 0; i < setup.output_name.length; ++i) {
    const name = setup.output_name[i];
    configUrls.push("/" + name + ".json");
    if (setup.type[i] == "stream") {
      streamUrls.push("/" + name + ".html");
    } 
    else {
      displayUrls.push("/" + name + ".html");
    }
  }
}

// initialize user directory
if (!fs.existsSync(appDir)) {
  fs.mkdirSync(appDir);
}
if (!fs.existsSync(path.join(appDir, "logos"))) {
  fs.mkdirSync(path.join(appDir, "logos"));
}
if (!fs.existsSync(path.join(appDir, "logos", "team"))) {
  fs.mkdirSync(path.join(appDir, "logos", "team"));
}
if (!fs.existsSync(path.join(appDir, "logos", "adv"))) {
  fs.mkdirSync(path.join(appDir, "logos", "adv"));
}
if (!fs.existsSync(path.join(appDir, "setup.json"))) {
  fs.copyFileSync(path.join("app-data", "setup.json"), path.join(appDir, "setup.json"));
}
if (!fs.existsSync(path.join(appDir, "team.json"))) {
  fs.copyFileSync(path.join("app-data", "team.json"), path.join(appDir, "team.json"));
}
if (!fs.existsSync(path.join(appDir, "adv.json"))) {
  fs.copyFileSync(path.join("app-data", "adv.json"),path.join(appDir, "adv.json"));
}

try {
  let buff = fs.readFileSync(path.join(appDir, "setup.json"), "utf-8"); 
  const setup = JSON.parse(buff);
  UpdateFileLookup(setup);
}
catch (err) {
  console.log(err);
}

// init
try {
  var buff = fs.readFileSync(path.join(appDir, "setup.json"), "utf-8");
  var setup = JSON.parse(buff);
  buff = fs.readFileSync(path.join(appDir, "team.json"), "utf-8");
  var team = JSON.parse(buff);
  buff = fs.readFileSync(path.join(appDir, "adv.json"), "utf-8");
  var adv = JSON.parse(buff);
  configValues = { setup: setup, team: team, adv: adv };
}
catch (err) {
  console.log(err);
}

let express_app = express();
express_app.use( express.static('./static-html') );
express_app.use( express.static(appDir) );  // serve logo files
express_app.use( (req, res, next) => { 
  var url = req.originalUrl;
  if (url.indexOf("?") >= 0) {
    url = url.slice(0, url.indexOf("?"));
  }
  if (indexUrls.includes(url)) {
    createIndex(req, res);
  }  
  else if (displayUrls.includes(url)) {
    res.sendFile(path.resolve('./static-html/display.html'));
  }
  else if (streamUrls.includes(url)) {
    res.sendFile(path.resolve('./static-html/stream.html'));
  }
  else if (configUrls.includes(url)) {
    const id = configUrls.indexOf(url);
    res.json(createConfig(id));
  }
  else if (configValues.team.cck2_file.indexOf(url.slice(1)) >= 0) {
    res.sendFile(path.resolve(configValues.setup.cck2_output_path + url));
  }
  else {
    next();
  }
} );

express_app.listen(80).on("error", () => {
    dialog.showErrorBox("Fehler beim Programmstart", 
      "Es ist bereits eine Instanz von CCK2 Live Elektron geöffnet\n"
      + "oder eine andere Anwendung nutzt Port 80.\n"
      + "Bitte beenden sie diese Anwendung und starten sie danch CCK2 Live Elektron erneut. \n\n" 
      + "Das Programm nach dem Drücken von OK beendet.");
    app.exit(-1);
  }
)

let win: BrowserWindow | null = null;

nativeTheme.themeSource = "dark";

function createWindow() {
  win = new BrowserWindow({
    useContentSize: true,
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  })

  // DevTools
  if (isDev) {
    installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));
    win.webContents.openDevTools();
  }

  if (isDev) {
    win.loadURL('http://localhost:3000/index.html');
  } else {
    win.loadURL(`file://${__dirname}/../index.html`);
  }

  win.on('closed', () => win = null);
  win.setMenuBarVisibility(isDev);

  // Hot Reloading
  if (isDev) {
    // 'node_modules/.bin/electronPath'
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
      forceHardReset: true,
      hardResetMethod: 'exit'
    });
  }

  // communication using ipcMain 
  ipcMain.on("save_setup", (event, data) => {fs.writeFileSync(path.join(appDir, "setup.json"), JSON.stringify(data)); UpdateFileLookup(data); configValues.setup = {...data};});
  ipcMain.on("save_league_team", (event, data) => { console.log(JSON.stringify(data)); fs.writeFileSync(path.join(appDir, "team.json"), JSON.stringify(data)); configValues.team = {...data};});
  ipcMain.on("save_league_adv", (event, data) => {fs.writeFileSync(path.join(appDir, "adv.json"), JSON.stringify(data)); configValues.adv = {...data};});
  ipcMain.on("save_team_setup", (event, data) => {fs.writeFileSync(path.join(appDir, "team_setup.json"), JSON.stringify(data)); })
  ipcMain.handle("logo", (event, type: string, name: string, filepath: string) => {
    let target = path.join(appDir, "logos", "team", name);
    if (type === "adv") {
      target = path.join(appDir, "logos", "adv", name);
    }
    try {
      fs.copyFileSync(filepath, target); 
    } catch {
      console.log("cannot copy file: " + filepath + " to " + target);
      return null;
    }
    return name;
  });

  ipcMain.handle("load", () => {
    let buff = fs.readFileSync(path.join(appDir, "setup.json"), "utf-8"); 
    const setup = JSON.parse(buff);
    buff = fs.readFileSync(path.join(appDir, "team.json"), "utf-8");
    const team = JSON.parse(buff);
    buff = fs.readFileSync(path.join(appDir, "adv.json"), "utf-8");
    const adv = JSON.parse(buff);
    
    configValues = {setup: setup, team: team, adv: adv};

    return {config: configValues, version: app.getVersion()};
  });

  ipcMain.handle("load_team_setup", () => {
    try {
        const buff = fs.readFileSync(path.join(appDir, "team_setup.json"), "utf-8");
        const team_setup = JSON.parse(buff);
        return team_setup;
    }
    catch (error) {
        return null;
    }
  });
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

// check for update
async function Check4Update() {
  const serverVersionFile = "https://skv-lorsch.de/live/cck2_live_electron_latest.json";
  fetch(serverVersionFile)
    .then((response) => {return response.json()})
    .then((v) => {
      if (v.version > app.getVersion()) {
        dialog.showMessageBox({
          "type": "info",
          "title": "Neue Version verfügbar", 
          "message": "Es steht eine neue Version von CCK2 Live Electron zum Download zur verfügung.\n"
            + "Die neue Version kann im Info-Bereich der Anwendung heruntergeladen werden.",
          "buttons": []})
          }  
      }  
    );
};
setTimeout(Check4Update, 5000);

