import { app, BrowserWindow, nativeTheme } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import * as express from 'express';
import {Server} from 'socket.io';
import {createServer} from 'http';
import * as fs from 'fs';

import {ConfigValues} from '../cck2_live_interface/ConfigValues';
import {LiveConfig, TeamConfig, AdvConfig} from '../cck2_live_interface/LiveConfig';

const indexUrls = ["/", "/index.html"]
const displayUrls = ["/TVLinks.html", "/TVRechts.html"];
const streamUrls = ["/Stream.html"];
const configUrls = ["/TVLinks.json", "/TVRechts.json", "/Stream.json"];

let configValues: ConfigValues;

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
  console.log("createConfig " + outputId);
  let teams: Array<TeamConfig> = [];
  for (let i = 0; i < configValues.team.name.length; ++i) {
    teams.push({
        bild_heim: configValues.team.logo_home[i], 
        bild_gast: configValues.team.logo_guest[i], 
        anzahl_bahnen: Number(configValues.team.num_lanes[i]), 
        anzahl_spieler: Number(configValues.team.num_players[i]), 
        anzeigedauer_s: Number(configValues.team.time_values[i][outputId]), 
        token_bahn: configValues.team.cck2_file[i], 
        token_datei: configValues.team.cck2_file[i], 
        anzahl_saetze: 4, 
        satzpunkte_anzeigen: (configValues.team.set_points[i]) ? "ja" : "nein"} as TeamConfig);
  }
  let adv: Array<AdvConfig> = [];
  for (let i = 0; i < configValues.adv.logo.length; ++i) {
    adv.push({bild: configValues.adv.logo[i], anzeigedauer_s:configValues.adv.time_values[i][outputId] } as AdvConfig)
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

try {
  let buff = fs.readFileSync("app-data/setup.json", "utf-8"); 
  const setup = JSON.parse(buff);
  UpdateFileLookup(setup);
}
catch (err) {
  console.log(err);
}


let express_app = express();
express_app.use( express.static('./public-live') );
express_app.use( (req, res, next) => { 
  if (indexUrls.includes(req.originalUrl)) {
    createIndex(req, res);
  }  
  else if (displayUrls.includes(req.originalUrl)) {
    res.sendFile(path.resolve(`${__dirname}/../../static-html/display.html`));
  }
  else if (streamUrls.includes(req.originalUrl)) {
    res.sendFile(path.resolve(`${__dirname}/../../static-html/stream.html`));
  }
  else if (configUrls.indexOf(req.originalUrl) >= 0) {
    const id = configUrls.indexOf(req.originalUrl);
    res.json(createConfig(id));
  }
  else {
    next();
  }
} );
express_app.listen(80);

let win: BrowserWindow | null = null;

nativeTheme.themeSource = "dark";

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  if (isDev) {
    win.loadURL('http://localhost:3000/index.html');
  } else {
    win.loadURL(`file://${__dirname}/../index.html`);
  }

  win.on('closed', () => win = null);

  // Hot Reloading
  if (isDev) {
    // 'node_modules/.bin/electronPath'
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
      forceHardReset: true,
      hardResetMethod: 'exit'
    });
  }

  // DevTools
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));

  if (isDev) {
    win.webContents.openDevTools();
  }
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

// communication
const httpServer = createServer();
const io = new Server(httpServer, {cors: {origin: "http://localhost:3000"}, maxHttpBufferSize: 1e8});
io.on('connection', (socket) => {
  socket.on("save_setup", (data) => {fs.writeFileSync("app-data/setup.json", JSON.stringify(data)); UpdateFileLookup(data)});
  socket.on("save_team", (data) => {fs.writeFileSync("app-data/team.json", JSON.stringify(data));});
  socket.on("save_adv", (data) => {fs.writeFileSync("app-data/adv.json", JSON.stringify(data));});

  socket.on("logo", (type: string, name: string, file: any, callback: any) => {
    let target = "public-live/logos/team/" + name;
    if (type === "adv") {
      target = "public-live/logos/adv/" + name;
    }
    fs.writeFile(target, file, (err) => {
      if (err) {
        console.log(err);
      }
      else {
        callback(name);
      }});
  });

  socket.on("load", () => {
    let buff = fs.readFileSync("app-data/setup.json", "utf-8"); 
    const setup = JSON.parse(buff);
    buff = fs.readFileSync("app-data/team.json", "utf-8");
    const team = JSON.parse(buff);
    buff = fs.readFileSync("app-data/adv.json", "utf-8");
    const adv = JSON.parse(buff);
    
    configValues = {setup: setup, team: team, adv: adv};

    socket.emit("load return", configValues);
  });
});
httpServer.listen(1512);
