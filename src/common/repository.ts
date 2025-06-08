import type { DailyStoredData, MonthlyStoredData, PersistentData } from "./entries";

interface ExternalStorage {
    getData(key: string): Promise<string | null>;
    setData(key: string, value: string): Promise<void>;
    getAllData(): Promise<Record<string, string>>;
}

export class Repository {
    public constructor(private readonly externalStorage: ExternalStorage) {
    }

    public async getPersistentData(): Promise<PersistentData> {
        const rawData = await this.externalStorage.getData(`persistent`);

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
            this.externalStorage.setData(`persistent`, JSON.stringify(data));
        } catch (error) {
            console.error("Error saving persistent data to externalStorage:", error);
            alert("Не удалось сохранить данные в локальное хранилище");
            throw new Error("Failed to save persistent data");
        }
    }

    public async getOrCreateMonthlyData(date: string): Promise<MonthlyStoredData> {
        if (date.length !== 7) {
            throw new Error("Invalid date format for monthly data. Expected format: YYYY-MM");
        }
        const rawData = await this.externalStorage.getData(`monthly:${date}`);
        if (rawData) {
            return JSON.parse(rawData) as MonthlyStoredData;
        }

        // If no data exists, create a new MonthlyStoredData object
        return {
            date,
            balance: [],
        };
    }

    public async saveMonthlyData(date: string, data: MonthlyStoredData): Promise<void> {
        try {
            if (date !== data.date || date.length !== 7) {
                throw new Error("Invalid date format for monthly data. Expected format: YYYY-MM");
            }

            this.externalStorage.setData(`monthly:${date}`, JSON.stringify(data));
        } catch (error) {
            console.error("Error saving monthly data to externalStorage:", error);
            alert("Не удалось сохранить данные в локальное хранилище");
            throw new Error("Failed to save monthly data");
        }
    }

    public async getDailyData(date: string): Promise<DailyStoredData | null> {
        const rawData = await this.externalStorage.getData(`daily:${date}`);
        return rawData ? JSON.parse(rawData) as DailyStoredData : null;
    }

    public async getOrCreateDailyData(date: string): Promise<DailyStoredData> {
        const existingData = await this.getDailyData(date);
        return existingData ?? {
            date,

            thoughts: [],

            recurringTasks: await this.getLastRecurringTasks() || [],
            temporaryTasks: {},
            energy: 0,
            tiredness: 0,
            sleepHours: 0,

            goodThings: [],
            food: [],
        };
    }

    public async saveDailyData(date: string, data: DailyStoredData): Promise<void> {
        try {
            if (date !== data.date || date.length !== 10) {
                throw new Error("Invalid date format for daily data. Expected format: YYYY-MM-DD");
            }
            this.externalStorage.setData(`daily:${date}`, JSON.stringify(data));
            this.saveLastRecurringTasks(data.recurringTasks);
        } catch (error) {
            console.error("Error saving daily data to externalStorage:", error);
            alert("Не удалось сохранить данные в локальное хранилище");
            throw new Error("Failed to save daily data");
        }
    }

    public async getHistoricalData(key: keyof DailyStoredData): Promise<Record<string, string[]>> {
        const result: Record<string, string[]> = {};

        const allItems = await this.externalStorage.getAllData();

        const keys = Object.keys(allItems)
            .filter(key => key.startsWith(`daily:`))
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
            const rawData = await this.externalStorage.getData(`last-recurring-tasks`);
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

    public async getAllForStatistics(): Promise<DailyStoredData[]> {
        const allItems = await this.externalStorage.getAllData();
        const dailyData = Object.keys(allItems)
            .filter(key => key.startsWith(`daily:`))
            .map(key => JSON.parse(allItems[key]));

        return dailyData;
    }

    private async saveLastRecurringTasks(recurringTasks: DailyStoredData["recurringTasks"]): Promise<void> {
        try {
            const tasks = recurringTasks
                .map(task => task.label.trim())
                .filter(task => task !== "");
            await this.externalStorage.setData(`last-recurring-tasks`, JSON.stringify(tasks));
        } catch (error) {
            console.error("Error saving last recurring tasks to externalStorage:", error);
            alert("Не удалось сохранить последние повторяющиеся задачи в локальное хранилище");
            throw new Error("Failed to save last recurring tasks");
        }
    }
}