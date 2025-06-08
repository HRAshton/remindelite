import { StatisticsCounts } from "../../services/statistics-service";

export const StatisticsParameters: Record<
    keyof Omit<StatisticsCounts, 'date' | 'parsedDate'>,
    {
        label: string;
        measure: string;
    }
> = {
    energy: { label: 'Настроение', measure: '%' },
    tiredness: { label: 'Усталость', measure: '%' },
    sleepHours: { label: 'Часы сна', measure: 'ч.' },
    tasksDonePercent: { label: 'Выполнено задач', measure: '%' },
};