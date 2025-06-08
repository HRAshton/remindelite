import './statistics-modal.scss';
import 'react-tabs/style/react-tabs.css';
import { useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Repository } from '../../../common/repository';
import { StatisticsService, Grouping, type StatisticsData } from '../../services/statistics-service';
import { SimpleModal } from '../simple-modal/simple-modal';
import { StatisticsChart } from './charts/statistics-chart';
import { Heatmap } from './charts/heatmap';

export interface StatisticsModalProps {
    repository: Repository;
    onClose: () => void;
}

export const StatisticsModal: React.FC<StatisticsModalProps> = (props) => {
    const [statistics, setStatistics] = useState<StatisticsData | null>(null);
    const [grouping, setGrouping] = useState<Grouping>(Grouping.Day);

    useEffect(() => {
        const statisticsService = new StatisticsService(props.repository);
        statisticsService.getStatistics().then(setStatistics);
    }, [props.repository]);

    const groupedStatistics = StatisticsService.groupBy(statistics?.countsByDay, grouping);

    return (
        <SimpleModal
            title="Статистика"
            isOpen={!!statistics}
            onClose={props.onClose}
        >
            {!statistics && <p>Загрузка статистики...</p>}

            {statistics && [
                <div className="statistics-controls" key="controls">
                    Группировка:
                    <select
                        value={grouping}
                        onChange={(e) => {
                            setGrouping(e.target.value as Grouping);
                        }}
                    >
                        <option value={Grouping.Day}>По дням</option>
                        <option value={Grouping.Week}>По неделям</option>
                        <option value={Grouping.Month}>По месяцам</option>
                    </select>
                </div>,
                <Tabs key="tabs" className="statistics-tabs">
                    <TabList>
                        <Tab>График</Tab>

                        <Tab>Heatmap</Tab>
                    </TabList>

                    <TabPanel>
                        <div className="statistics-chart">
                            <h3>График средних значений</h3>

                            <StatisticsChart groupedStatistics={groupedStatistics} />
                        </div>
                    </TabPanel>

                    <TabPanel>
                        <div className="statistics-heatmap">
                            <h3>Тепловая карта</h3>

                            <Heatmap groupedStatistics={statistics.countsByDay} />
                        </div>
                    </TabPanel>
                </Tabs>
            ]}
        </SimpleModal>
    );
}
