import { StatisticsCounts } from "../../services/statistics-service";

export const StatisticsParameters: Record<
    keyof Omit<StatisticsCounts, 'date' | 'parsedDate'>,
    { label: string }
> = {
    energy: { label: 'Настроение' },
    tiredness: { label: 'Усталость' },
    sleepHours: { label: 'Часы сна' },
    tasksDonePercent: { label: 'Выполнено задач' },
};