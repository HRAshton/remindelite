export const VERSION = '1';

export interface FoodData {
    comment: string;
    image: string;
}

export interface CheckableItem {
    label: string;
    checked: boolean;
}

export interface DailyStoredData {
    debts: string[];
    remember: string[];
    balance: string[];
    thoughts: string[];

    recurringTasks: CheckableItem[];
    temporaryTasks: Record<string, CheckableItem[]>;
    energy: number;

    globalPlans: string[];
    nearPlans: string[];
    goodThings: string[];
    food: FoodData;
}
