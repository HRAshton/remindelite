import './heatmap.scss';
import { useState } from 'react';
import type { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import { StatisticsCounts } from "../../../services/statistics-service";
import { StatisticsParameters } from '../statistics-constants';

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

    // Generates month names in Russian
    const series: ApexAxisChartSeries = Array.from({ length: 12 })
        .map((_, i) => new Date(2000, i, 1))
        .map(date => new Intl.DateTimeFormat('ru', { month: 'long' }).format(date))
        .map((month, monthIndex) => ({
            name: month,
            data: groupedStatistics
                .map(item => {
                    const date = new Date(item.parsedDate);
                    return date.getMonth() === monthIndex
                        ? { x: date.getDate(), y: Math.round(item[parameter]) }
                        : null;
                })
                .filter(item => item !== null) as { x: number, y: number }[]
        }));

    return (
        <>
            <span className="statistics-heatmap-options">
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