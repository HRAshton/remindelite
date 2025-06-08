import { getWeek } from "../helpers/date-helpers";
import { groupBy, avgOf, sumOf } from "../helpers/list-helpers";
import { parseBalance } from "../helpers/parsing-helpers";
import { Repository } from "../../common/repository";

export enum Grouping {
    Day = 'day',
    Week = 'week',
    Month = 'month',
}

export interface StatisticsCounts {
    date: string;
    parsedDate: Date;

    energy: number;
    tiredness: number;
    sleepHours: number;

    tasksDonePercent: number;

    income?: number;
    expenses?: number;
    balance?: number;
}

export interface StatisticsData {
    countsByDay: StatisticsCounts[];
}

export class StatisticsService {
    public constructor(private readonly repository: Repository) {
    }

    public async getStatistics(): Promise<StatisticsData> {
        const dailyData = await this.repository.getAllDailyForStatistics();
        const sortedDailyData = dailyData.sort((a, b) => a.date.localeCompare(b.date));

        const monthlyData = await this.getBalanceStatistics();

        const countsByDay: StatisticsCounts[] = [];
        for (const dailyData of sortedDailyData) {
            const selectedMonthlyData = monthlyData
                .find(item => dailyData.date.startsWith(item.date));

            const currentDayStats: StatisticsCounts = {
                date: dailyData.date,
                parsedDate: new Date(dailyData.date),
                energy: dailyData.energy,
                tiredness: dailyData.tiredness,
                sleepHours: dailyData.sleepHours,
                tasksDonePercent: -1,
            };

            if (selectedMonthlyData) {
                currentDayStats.income = selectedMonthlyData.income;
                currentDayStats.expenses = selectedMonthlyData.expenses;
                currentDayStats.balance = selectedMonthlyData.balance;
            }

            // Calculate total tasks and done tasks
            const recurringTasksDone = dailyData.recurringTasks.filter(task => task.checked).length;
            const allTemporaryTasks = Object.values(dailyData.temporaryTasks).flat();
            const temporaryTasksDone = allTemporaryTasks
                .filter(task => task.checked)
                .length;
            currentDayStats.tasksDonePercent = (recurringTasksDone + temporaryTasksDone)
                / (dailyData.recurringTasks.length + allTemporaryTasks.length);

            countsByDay.push(currentDayStats);
        }

        return { countsByDay };
    }

    public static groupBy(
        dailyData: StatisticsCounts[] | null,
        grouping: Grouping,
    ): StatisticsCounts[] {
        if (!dailyData || dailyData.length === 0) {
            return [];
        }

        if (grouping === Grouping.Day) {
            return dailyData;
        }

        const groupedData: Record<string, StatisticsCounts[]> = groupBy(
            dailyData,
            item => grouping === Grouping.Week
                ? item.parsedDate.getFullYear() + '-' + getWeek(item.parsedDate)
                : item.parsedDate.getFullYear() + '-' + item.parsedDate.getMonth()
        );

        const result: StatisticsCounts[] = [];
        for (const key in groupedData) {
            const items = groupedData[key];

            const summableFields = Object.keys(items[0]).filter(
                (field: keyof StatisticsCounts) => field !== 'date' && field !== 'parsedDate'
            ) as (keyof Omit<StatisticsCounts, 'date' | 'parsedDate'>)[];

            const aggregated = {
                date: key,
                parsedDate: items[0].parsedDate,
                ...summableFields.reduce((acc, field) => {
                    acc[field] = avgOf(items, item => item[field]);
                    return acc;
                }, {} as Record<string, number>)
            } as StatisticsCounts;

            result.push(aggregated);
        }

        return result;
    }

    private async getBalanceStatistics(): Promise<Pick<
        StatisticsCounts,
        'date' | 'income' | 'expenses' | 'balance'
    >[]> {
        const monthlyData = await this.repository.getAllMonthlyForStatistics();
        return monthlyData.map(item => {
            const balances = item.balances.map(parseBalance);

            const income = sumOf(balances, balance => balance[0] > 0 ? balance[0] : 0);
            const expenses = sumOf(balances, balance => balance[0] < 0 ? -balance[0] : 0);

            return ({
                date: item.date,
                income,
                expenses,
                balance: income - expenses,
            });
        });
    }
}
