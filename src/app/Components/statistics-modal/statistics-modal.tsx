import './statistics-modal.scss';
import 'react-tabs/style/react-tabs.css';
import { useEffect, useMemo, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Repository } from '../../../common/repository';
import { StatisticsService, Grouping, type StatisticsData } from '../../services/statistics-service';
import { SimpleModal } from '../simple-modal/simple-modal';

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

    const groupedStatistics = useMemo(
        () => StatisticsService.groupBy(statistics?.countsByDay, grouping),
        [statistics, grouping]
    );

    return (
        <SimpleModal
            title="Статистика"
            isOpen={!!statistics}
            onClose={props.onClose}
        >
            {!statistics && <p>Загрузка статистики...</p>}

            {statistics && [
                <div>
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
                <Tabs>
                    <TabList>
                        <Tab>График</Tab>
                    </TabList>

                    <TabPanel>
                        <div className="statistics-chart">
                            <h3>График средних значений</h3>
                            
                            {JSON.stringify(groupedStatistics, null, 2)}
                        </div>
                    </TabPanel>
                </Tabs>
            ]}
        </SimpleModal>
    );
}
