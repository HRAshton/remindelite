export class ExternalStorage {
    public getData(key: string): Promise<string | null> {
        return window.electron.getData(key);
    }

    public setData(key: string, value: string): Promise<void> {
        return window.electron.setData(key, value);
    }

    public getAllData(): Promise<Record<string, string>> {
        return window.electron.getAllData();
    }
}