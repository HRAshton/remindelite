import type { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import { StatisticsCounts } from "../../../services/statistics-service";
import { StatisticsParameters } from "../statistics-constants";

export interface StatisticsChartProps {
    groupedStatistics: StatisticsCounts[];
}

export const StatisticsChart: React.FC<StatisticsChartProps> = ({ groupedStatistics }) => {
    const options: ApexOptions = {
        chart: {
            type: 'area',
        },
        xaxis: {
            type: 'datetime',
            categories: groupedStatistics
                .map(item => item.parsedDate.getTime()),
        },
        yaxis: {
            seriesName: Object
                .values(StatisticsParameters)
                .map(param => param.label),
            labels: {
                formatter: (val) => `${Math.round(val)}%`,
            },
        },
        stroke: {
            curve: 'smooth',
        },
    }

    const series: ApexAxisChartSeries = Object.keys(StatisticsParameters)
        .map((param: keyof typeof StatisticsParameters) => ({
            name: StatisticsParameters[param].label,
            data: groupedStatistics.map(item => item[param]),
        }));

    return (
        <ReactApexChart
            options={options}
            series={series}
        />
    );
};