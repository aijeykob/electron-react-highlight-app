import {app, BrowserWindow} from "electron";
import * as path from "path";
import installExtension, {REACT_DEVELOPER_TOOLS} from "electron-devtools-installer";
import electronReload from "electron-reload";
import BrowserWindowController from "./BrowserWindowController";
import {registerIpcHandlers} from "./ipcHandlers";
import config from "./config";

function createWindow() {
    const win = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            nodeIntegrationInWorker: false,
            webviewTag: true,
            preload: path.join(__dirname, "preload.js")
        }
    });

    if (app.isPackaged) {
        win.loadURL(`file://${__dirname}/../index.html`);
    } else {
        win.loadURL(`${config.apiUrl}/index.html`);
        electronReload(__dirname, {
            electron: path.join(
                __dirname,
                "..",
                "..",
                "node_modules",
                ".bin",
                "electron" + (process.platform === "win32" ? ".cmd" : "")
            ),
            forceHardReset: true,
            hardResetMethod: "exit"
        });
    }
    const bwController = new BrowserWindowController(win);
    registerIpcHandlers(bwController);
}

app.whenReady().then(() => {
    // DevTools
    installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log("An error occurred: ", err));

    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
            app.quit();
        }
    });
});
