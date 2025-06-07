import { DailyStoredData, PersistentData, VERSION } from "./entries";
import { ExternalStorage } from "./external-storage";

export class Repository {
    private static _instance: Repository | null = null;
    private readonly _externalStorage: ExternalStorage;

    private constructor() {
        this._externalStorage = new ExternalStorage();
    }

    public static get instance(): Repository {
        if (!Repository._instance) {
            Repository._instance = new Repository();
        }
        return Repository._instance;
    }

    public async getPersistentData(): Promise<PersistentData> {
        const rawData = await this._externalStorage.getItem(`${VERSION}:persistent`);

        return rawData
            ? JSON.parse(rawData) as PersistentData
            : {
                debts: [],
                remember: [],
                globalPlans: [],
                nearPlans: [],
            };
    }

    public async savePersistentData(data: PersistentData): Promise<void> {
        try {
            this._externalStorage.setItem(`${VERSION}:persistent`, JSON.stringify(data));
        } catch (error) {
            console.error("Error saving persistent data to externalStorage:", error);
            alert("Не удалось сохранить данные в локальное хранилище");
            throw new Error("Failed to save persistent data");
        }
    }

    public async getOrCreateDailyData(date: string): Promise<DailyStoredData> {
        const rawData = await this._externalStorage.getItem(`${VERSION}:daily:${date}`);

        return rawData
            ? JSON.parse(rawData) as DailyStoredData
            : {
                date,

                balance: [],
                thoughts: [],

                recurringTasks: await this.getLastRecurringTasks() || [],
                temporaryTasks: {},
                energy: 0,
                tiredness: 0,
                sleepHours: 0,

                goodThings: [],
                food: {
                    comment: '',
                    image: '',
                },
            };
    }

    public async saveDailyData(date: string, data: DailyStoredData): Promise<void> {
        try {
            this._externalStorage.setItem(`${VERSION}:daily:${date}`, JSON.stringify(data));
            this.saveLastRecurringTasks(data.recurringTasks);
        } catch (error) {
            console.error("Error saving daily data to externalStorage:", error);
            alert("Не удалось сохранить данные в локальное хранилище");
            throw new Error("Failed to save daily data");
        }
    }

    public async getHistoricalData(key: keyof DailyStoredData): Promise<Record<string, string[]>> {
        const result: Record<string, string[]> = {};

        const allItems = await this._externalStorage.getAllData();

        const keys = Object.keys(allItems)
            .filter(key => key.startsWith(`${VERSION}:daily:`))
            .map(key => JSON.parse(allItems[key] || '{}'))
            .filter((data: DailyStoredData) =>
                data[key] !== undefined
                && Array.isArray(data[key])
                && (data[key] as string[]).length > 0)
            .forEach((data: DailyStoredData) => {
                const date = data.date;
                if (!result[date]) {
                    result[date] = [];
                }
                result[date].push(...(data[key] as string[]));
            });

        return result;
    }

    private async getLastRecurringTasks(): Promise<DailyStoredData["recurringTasks"] | null> {
        try {
            const rawData = await this._externalStorage.getItem(`${VERSION}:last-recurring-tasks`);
            if (!rawData) {
                return null;
            }

            const tasks = JSON.parse(rawData) as string[];
            return tasks.map(task => ({ label: task, checked: false }));
        } catch (error) {
            console.error("Error parsing last recurring tasks from externalStorage:", error);
            alert("Не удалось загрузить последние повторяющиеся задачи из локального хранилища");
            return null;
        }
    }

    private async saveLastRecurringTasks(recurringTasks: DailyStoredData["recurringTasks"]): Promise<void> {
        try {
            const tasks = recurringTasks
                .map(task => task.label.trim())
                .filter(task => task !== "");
            await this._externalStorage.setItem(`${VERSION}:last-recurring-tasks`, JSON.stringify(tasks));
        } catch (error) {
            console.error("Error saving last recurring tasks to externalStorage:", error);
            alert("Не удалось сохранить последние повторяющиеся задачи в локальное хранилище");
            throw new Error("Failed to save last recurring tasks");
        }
    }
}