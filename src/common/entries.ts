export interface FoodData {
    comment: string;
    image: string | '';
}

export interface CheckableItem {
    label: string;
    checked: boolean;
}

export interface DailyStoredData {
    date: string;

    thoughts: string[];

    recurringTasks: CheckableItem[];
    temporaryTasks: Record<string, CheckableItem[]>;
    energy: number;
    tiredness: number;
    sleepHours: number;

    goodThings: string[];
    food: FoodData[];
}

export interface MonthlyStoredData {
    date: string;
    balance: string[];
}

export interface PersistentData {
    debts: string[];
    remember: string[];
    globalPlans: string[];
    nearPlans: string[];
}