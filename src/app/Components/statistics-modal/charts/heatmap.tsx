import { useState } from 'react';
import type { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import { StatisticsCounts } from "../../../services/statistics-service";
import { StatisticsParameters } from '../statistics-constants';
import { groupBy } from '../../../helpers/list-helpers';

export interface StatisticsChartProps {
    groupedStatistics: StatisticsCounts[];
}

export const Heatmap: React.FC<StatisticsChartProps> = ({ groupedStatistics }) => {
    const [parameter, setParameter] = useState<keyof typeof StatisticsParameters>('energy');

    const options: ApexOptions = {
        chart: {
            type: 'heatmap',
        },
        stroke: {
            width: 0
        },
        dataLabels: {
            enabled: true
        },
        legend: {
            show: false,
        },
        plotOptions: {
            heatmap: {
                radius: 0,
                colorScale: {
                    ranges: [
                        {
                            from: 0,
                            to: 100,
                            color: "#4caf50",
                            name: "low"
                        }
                    ]
                }
            }
        },
    }

    const currentYear = new Date().getFullYear();
    const allDatesInYear = Array.from(
        { length: 366 },
        (_, i) => new Date(currentYear, 0, i + 1),
    ).filter(date => date.getFullYear() === currentYear);

    const series: ApexAxisChartSeries = Object.values(groupBy(allDatesInYear, (date) => date.getMonth()))
        .map((group) => ({
            name: group[0].toLocaleString('ru', { month: 'long' }),
            data: group.map(date => {
                const dateString = date.toISOString().split('T')[0];
                const stat = groupedStatistics.find(item => item.parsedDate.toISOString().split('T')[0] === dateString);
                return {
                    x: dateString,
                    y: stat ? stat[parameter] : '',
                };
            })
        }));

    return (
        <>
            <span className="statistics-inline">
                <label htmlFor="parameter-select">Параметр:</label>
                <select
                    id="parameter-select"
                    value={parameter}
                    onChange={(e) => setParameter(e.target.value as keyof typeof StatisticsParameters)}
                >
                    {Object.keys(StatisticsParameters)
                        .map((param: keyof typeof StatisticsParameters) => (
                            <option key={param} value={param}>
                                {StatisticsParameters[param].label}
                            </option>
                        ))}
                </select>
            </span>

            <ReactApexChart
                options={options}
                series={series}
                type="heatmap"
            />
        </>
    );
};