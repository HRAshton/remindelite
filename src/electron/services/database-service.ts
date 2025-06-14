import { ipcMain } from 'electron';
import Database from 'better-sqlite3';

export class DatabaseService {
    private readonly db: Database.Database;

    constructor(dbPath: string) {
        this.db = new Database(dbPath);
    }

    public initialize(): void {
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS data (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            );
        `);

        ipcMain.handle('getData', (_, key) => this.getData(key));
        ipcMain.handle(
            'setData',
            (_, key, value) => this.setData(key, value),
        );
        ipcMain.handle('getAllData', () => this.getAllData());
    }

    public commit(): void {
        // In better-sqlite3, changes are automatically committed, so this is a no-op.
        // If you were using a different library that requires explicit commits, you would call db.exec('COMMIT');
    }

    public async getData(key: string): Promise<string | null> {
        const stmt = this.db.prepare('SELECT value FROM data WHERE key = ?');
        const row = stmt.get(key) as { value: string } | undefined;
        return row ? row.value : null;
    }

    public async setData(key: string, value: string): Promise<void> {
        const stmt = this.db.prepare('INSERT OR REPLACE INTO data (key, value) VALUES (?, ?)');
        stmt.run(key, value);
    }

    public async getAllData(): Promise<Record<string, string>> {
        const stmt = this.db.prepare('SELECT key, value FROM data');
        const rows = stmt.all() as { key: string; value: string }[];
        return Object.fromEntries(rows.map(row => [row.key, row.value]));
    }
}