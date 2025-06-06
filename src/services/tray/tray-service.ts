import { Menu, Tray } from "electron";
import { WindowService } from "../window-service";

export class TrayService {
    private tray: Tray | null = null;

    constructor(
        private readonly windowService: WindowService,
        private readonly iconPath: string,
        private readonly app: Electron.App,
    ) {
    }

    initialize(): void {
        this.tray = new Tray(this.iconPath);
        const contextMenu = Menu.buildFromTemplate([
            {
                id: 'alwaysOnTop',
                label: 'Поверх всех окон',
                type: 'checkbox',
                checked: this.windowService.isAlwaysOnTop,
                click: () => {
                    this.windowService.toggleAlwaysOnTop();
                    contextMenu.getMenuItemById('alwaysOnTop').checked
                        = this.windowService.isAlwaysOnTop;
                },
            },
            {
                id: 'quit',
                label: 'Выход',
                click: () => { this.app.quit(); },
            },
        ]);

        this.tray.setToolTip('My Electron App');
        this.tray.setContextMenu(contextMenu);

        this.tray.on('double-click', () => {
            this.windowService.toggleWindow();
        });
    }

    destroy(): void {
        if (!this.tray) return;

        this.tray.destroy();
        this.tray = null;
    }
}