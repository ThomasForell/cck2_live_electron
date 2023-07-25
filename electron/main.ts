import { app, BrowserWindow, nativeTheme } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import * as express from 'express';
import {Server} from 'socket.io';
import {createServer} from 'http';
import * as fs from 'fs';

let express_app = express();
express_app.use( express.static('./public-live') );
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

// scan team and adv logos
let dataTeamLogos = fs.readdirSync(`${__dirname}/../../public-live/Logos`);
let dataAdvLogos = fs.readdirSync(`${__dirname}/../../public-live/Werbung`); 

// communication
const httpServer = createServer();
const io = new Server(httpServer, {cors: {origin: "http://localhost:3000"}});
io.on('connection', (socket) => {
  socket.on("save_setup", (data) => {fs.writeFileSync("app-data/setup.json", JSON.stringify(data));});
  socket.on("save_team", (data) => {fs.writeFileSync("app-data/team.json", JSON.stringify(data));});
  socket.on("save_adv", (data) => {fs.writeFileSync("app-data/adv.json", JSON.stringify(data));});
});
io.on('connection', (socket ) => {
  socket.on("load", () => {
    let buff = fs.readFileSync("app-data/setup.json", "utf-8"); 
    const dataSetup = JSON.parse(buff);
    buff = fs.readFileSync("app-data/team.json", "utf-8");
    const dataTeam = JSON.parse(buff);
    buff = fs.readFileSync("app-data/adv.json", "utf-8");
    const dataAdv = JSON.parse(buff);
    
    socket.emit("load return", {setup: dataSetup, team: dataTeam, adv: dataAdv}, dataTeamLogos, dataAdvLogos);
  });
});
httpServer.listen(1512);
