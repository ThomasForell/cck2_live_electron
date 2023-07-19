import { app, BrowserWindow, nativeTheme } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import * as express from 'express';
import {Server} from 'socket.io';
import {createServer} from 'http';

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
    // 'build/index.html'
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

const httpServer = createServer();
const io = new Server(httpServer, {cors: {origin: "http://localhost:3000"}});
io.on('connection', (socket) => {
  socket.on("save_setup", (data) => {console.log(data);});
  socket.on("save_team", (data) => {console.log(data);});
  socket.on("save_adv", (data) => {console.log(data);});
});
httpServer.listen(1512);