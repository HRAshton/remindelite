import { DailyStoredData, VERSION } from "./entries";

export class Repository {
    public getOrCreate(date: string): DailyStoredData {
        const rawData = localStorage.getItem(`${VERSION}:daily:${date}`);

        return rawData
            ? JSON.parse(rawData) as DailyStoredData
            : {
                debts: [],
                remember: [],
                balance: [],
                thoughts: [],

                recurringTasks: this.getLastRecurringTasks() || [],
                temporaryTasks: {},
                energy: 0,

                globalPlans: [],
                nearPlans: [],
                goodThings: [],
                food: {
                    comment: '',
                    image: '',
                },
            };
    }

    public save(date: string, data: DailyStoredData): void {
        try {
            localStorage.setItem(`${VERSION}:daily:${date}`, JSON.stringify(data));
            this.saveLastRecurringTasks(data.recurringTasks);
        } catch (error) {
            console.error("Error saving daily data to localStorage:", error);
            alert("Не удалось сохранить данные в локальное хранилище");
            throw new Error("Failed to save daily data");
        }
    }

    private getLastRecurringTasks(): DailyStoredData["recurringTasks"] | null {
        try {
            const rawData = localStorage.getItem(`${VERSION}:last-recurring-tasks`);
            if (!rawData) {
                return null;
            }

            const tasks = JSON.parse(rawData) as string[];
            return tasks.map(task => ({ label: task, checked: false }));
        } catch (error) {
            console.error("Error parsing last recurring tasks from localStorage:", error);
            alert("Не удалось загрузить последние повторяющиеся задачи из локального хранилища");
            return null;
        }
    }

    private saveLastRecurringTasks(recurringTasks: DailyStoredData["recurringTasks"]): void {
        try {
            const tasks = recurringTasks
                .map(task => task.label.trim())
                .filter(task => task !== "");
            localStorage.setItem(`${VERSION}:last-recurring-tasks`, JSON.stringify(tasks));
        } catch (error) {
            console.error("Error saving last recurring tasks to localStorage:", error);
            alert("Не удалось сохранить последние повторяющиеся задачи в локальное хранилище");
            throw new Error("Failed to save last recurring tasks");
        }
    }
}