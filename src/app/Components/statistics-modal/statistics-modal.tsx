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

    useEffect(() => {
        const statisticsService = new StatisticsService(props.repository);
        statisticsService.getStatistics().then(setStatistics);
    }, [props.repository]);

    return (
        <SimpleModal
            title="Статистика"
            isOpen={!!statistics}
            onClose={props.onClose}
        >
            {!statistics && <p>Загрузка статистики...</p>}

            {statistics && (
                <Tabs>
                    <TabList>
                        <Tab>График</Tab>

                        <Tab>Heatmap</Tab>
                    </TabList>

                    <TabPanel>
                        <div className="statistics-chart">
                            <h3>График средних значений</h3>

                            <StatisticsChart statistics={statistics.countsByDay} />
                        </div>
                    </TabPanel>

                    <TabPanel>
                        <div className="statistics-heatmap">
                            <h3>Тепловая карта</h3>

                            <Heatmap groupedStatistics={statistics.countsByDay} />
                        </div>
                    </TabPanel>
                </Tabs>
            )}
        </SimpleModal>
    );
}
