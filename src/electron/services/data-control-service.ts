import fs from 'fs';
import { dialog, shell } from 'electron';

export class DataControlService {
    constructor(private readonly dbPath: string) {
    }

    async export(): Promise<void> {
        const destination = await dialog.showSaveDialog({
            title: 'Сохранить бекап',
            defaultPath: this.dbPath,
            filters: [{ name: 'JSON', extensions: ['json'] }],
        });

        if (destination.canceled || !destination.filePath) {
            return;
        }

        fs.copyFile(
            this.dbPath,
            destination.filePath,
            (err: NodeJS.ErrnoException | null) => {
                if (err) {
                    dialog.showErrorBox('Ошибка', `Не удалось сохранить бекап: ${err.message}`);
                } else {
                    dialog.showMessageBox({
                        type: 'info',
                        title: 'Успех',
                        message: 'Бекап успешно сохранен.',
                    });
                }
            },
        );

        shell.showItemInFolder(destination.filePath);
    }

    async import(): Promise<void> {
        dialog.showMessageBoxSync({
            type: 'info',
            title: 'Импорт бекапа',
            message: 'Только вручную. '
                + 'Нужно закрыть приложение и заменить файл базы данных на бекап. '
                + 'После этого перезапустить приложение.'
                + 'Файл базы данных: ' + this.dbPath
        });

        shell.showItemInFolder(this.dbPath);
    }

    async drop(): Promise<void> {
        dialog.showMessageBoxSync({
            type: 'info',
            title: 'Удаление данных',
            message: 'Только вручную. '
                + 'Нужно закрыть приложение и удалить файл базы данных. '
                + 'После этого перезапустить приложение.'
                + 'Файл базы данных: ' + this.dbPath
        });

        shell.showItemInFolder(this.dbPath);
    }
}