import type { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import { StatisticsCounts } from "../../../services/statistics-service";
import { StatisticsParameters } from "../statistics-constants";
import { groupBy } from "../../../helpers/list-helpers";

export interface StatisticsChartProps {
    groupedStatistics: StatisticsCounts[];
}

export const StatisticsChart: React.FC<StatisticsChartProps> = ({ groupedStatistics }) => {
    const allDates = groupedStatistics
        .map(item => item.parsedDate)
        .sort((a, b) => a.getTime() - b.getTime());
    const options: ApexOptions = {
        chart: {
            type: 'area',
        },
        xaxis: {
            type: 'datetime',
        },
        yaxis: Object.entries(groupBy(Object.values(StatisticsParameters),
            ({ measure }) => measure,
        )).map(([measure, params]) => ({
            seriesName: params.map(param => param.label),
            labels: {
                formatter: (val: number) => `${Math.round(val)} ${measure}`,
            },
        })),
        stroke: {
            curve: 'smooth',
        },
    }

    const series: ApexAxisChartSeries = Object.keys(StatisticsParameters)
        .map((param: keyof typeof StatisticsParameters) => ({
            name: StatisticsParameters[param].label,
            data: groupedStatistics.map(item => ({
                x: item.parsedDate.getTime(),
                y: item[param]
            })),
        }));

    return (
        <ReactApexChart
            options={options}
            series={series}
        />
    );
};