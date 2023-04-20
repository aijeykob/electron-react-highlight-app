import {BrowserView, BrowserWindow, ipcMain} from "electron";
import contextMenu from "electron-context-menu";

class BrowserWindowController {
    mainWindow;
    browserView!: BrowserView;
    constructor(mainWindow: BrowserWindow) {
        this.mainWindow = mainWindow;
    }

    async createBrowserView(pageURL: string) {
        try {
            new URL(pageURL);
        } catch (error) {
            throw new Error("Invalid URL format");
        }
        if (this.browserView) {
            this.mainWindow.removeBrowserView(this.browserView);
        }

        this.browserView = new BrowserView();
        this.mainWindow.setBrowserView(this.browserView);
        await this.browserView.webContents.loadURL(pageURL);

        const winBounds = this.mainWindow.getBounds();
        const browserViewWidth = 400;
        const browserViewHeight = winBounds.height;
        const browserViewX = winBounds.width - browserViewWidth - 100;
        const browserViewY = 180;
        this.browserView.setBounds({
            x: browserViewX,
            y: browserViewY,
            width: browserViewWidth,
            height: browserViewHeight
        });
        this.browserView.setAutoResize({
            width: true,
            height: true,
            horizontal: true,
            vertical: false
        });
        this.createContextMenu();
        this.browserView.webContents.on("before-input-event", (event, input) => {
            if (input.type === "keyDown" && input.key === "c" && input.control) {
                this.browserView.webContents.copy();
            }
        });
    }

    createContextMenu() {
        contextMenu({
            window: this.browserView.webContents,
            shouldShowMenu: (event, params) => {
                return params.selectionText.trim().length > 0;
            },
            menu: (actions, props, browserWindow) => {
                return [
                    {
                        label: "Save highlight",
                        click: async () => {
                            const selectedText = props.selectionText;
                            const pageTitle = await this.browserView.webContents.executeJavaScript("document.title");
                            const pageURL = this.browserView.webContents.getURL();
                            ipcMain.emit("save-selected-text", null, {
                                url: pageURL,
                                title: pageTitle,
                                text: selectedText
                            });
                        }
                    }
                ];
            }
        });
    }

    getWindow() {
        return this.mainWindow;
    }
}

export default BrowserWindowController;
