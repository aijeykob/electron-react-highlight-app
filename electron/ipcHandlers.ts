import {ipcMain} from "electron";
import {loadData, saveSelectedText} from "./fileService";
import BrowserWindowController from "./BrowserWindowController";

export const registerIpcHandlers = (bwController: BrowserWindowController) => {
    const win = bwController.getWindow();
    ipcMain.handle("create-browser-view", async (_event, url) => {
        return bwController.createBrowserView(url);
    });

    ipcMain.handle("load-data", () => {
        return loadData();
    });

    ipcMain.on("save-selected-text", (_event, newData) => {
        const result = saveSelectedText(newData);
        if (result.success) {
            win.webContents.send("data-saved", result.data);
        } else {
            console.error("Error while saving data:", result.error);
        }
    });
};
