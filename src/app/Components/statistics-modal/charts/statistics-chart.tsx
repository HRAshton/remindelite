import { useState } from "react";
import type { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import { groupBy } from "../../../helpers/list-helpers";
import { Grouping, StatisticsCounts, StatisticsService } from "../../../services/statistics-service";
import { StatisticsParameters } from "../statistics-constants";

export interface StatisticsChartProps {
    statistics: StatisticsCounts[];
}

export const StatisticsChart: React.FC<StatisticsChartProps> = (props) => {
    const [grouping, setGrouping] = useState<Grouping>(Grouping.Day);

    const groupedStatistics = StatisticsService.groupBy(props.statistics, grouping);

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
        <>
            <span className="statistics-inline">
                <label htmlFor="grouping-select">Группировка:</label>
                <select
                    id="grouping-select"
                    value={grouping}
                    onChange={(e) => {
                        setGrouping(e.target.value as Grouping);
                    }}
                >
                    <option value={Grouping.Day}>По дням</option>
                    <option value={Grouping.Week}>По неделям</option>
                    <option value={Grouping.Month}>По месяцам</option>
                </select>
            </span>

            <ReactApexChart
                options={options}
                series={series}
            />
        </>
    );
};