import { getWeek } from "../helpers/date-helpers";
import { groupBy, avgOf } from "../helpers/list-helpers";
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
}

export interface StatisticsData {
    countsByDay: StatisticsCounts[];
}

export class StatisticsService {
    public constructor(private readonly repository: Repository) {
    }

    public async getStatistics(): Promise<StatisticsData> {
        const allData = await this.repository.getAllForStatistics();
        const sortedData = allData.sort((a, b) => a.date.localeCompare(b.date));

        const countsByDay: StatisticsCounts[] = [];
        for (const dailyData of sortedData) {
            const currentDayStats: StatisticsCounts = {
                date: dailyData.date,
                parsedDate: new Date(dailyData.date),
                energy: dailyData.energy,
                tiredness: dailyData.tiredness,
                sleepHours: dailyData.sleepHours,
                tasksDonePercent: -1,
            };

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
}
