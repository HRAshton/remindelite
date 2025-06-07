import { BrowserWindow } from "electron";
import { Config } from "../../common/config";

export class WindowService {
    private _mainWindow: BrowserWindow | null = null;
    private _isAlwaysOnTop: boolean = Config.AlwaysOnTopDefault;

    constructor(
        private readonly MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string,
        private readonly MAIN_WINDOW_WEBPACK_ENTRY: string,
        private readonly iconPath: string,
    ) {
    }

    get isAlwaysOnTop(): boolean {
        return this._isAlwaysOnTop;
    }

    toggleWindow(): void {
        if (!this._mainWindow) {
            this._mainWindow = this.createWindow();
            this._mainWindow.on('closed', () => {
                this._mainWindow = null;
            });
            return;
        }

        // If the window exists, toggle its visibility
        if (this._mainWindow.isVisible()) {
            this._mainWindow.close();
        } else {
            this._mainWindow.show();
        }
    }

    toggleAlwaysOnTop(): boolean {
        this._isAlwaysOnTop = !this._isAlwaysOnTop;

        if (this._mainWindow) {
            this._mainWindow.setAlwaysOnTop(this._isAlwaysOnTop);
        }

        return this._isAlwaysOnTop;
    }

    private createWindow(): BrowserWindow {
        const window = new BrowserWindow({
            icon: this.iconPath,
            height: 1080,
            width: 1140,
            alwaysOnTop: this._isAlwaysOnTop,
            webPreferences: {
                preload: this.MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
                nodeIntegration: true,
            },
        });

        window.loadURL(this.MAIN_WINDOW_WEBPACK_ENTRY);

        // Uncomment to open DevTools
        // window.webContents.openDevTools({ mode: 'detach' });

        return window;
    }
}