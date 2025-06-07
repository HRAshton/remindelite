import './dashboard.scss';
import { useEffect, useMemo, useState } from 'react';
import { MainPane } from './cards/main-pane/main-pane';
import { Repository } from '../services/database/repository';
import { CheckableItem } from '../services/database/entries';
import { SimpleListCard } from './cards/simple-list-card/simple-list-card';
import { FoodCard } from './cards/food-card/food-card';
import { HistoryModal } from './history-modal/history-modal';
import { StatisticsModal } from './statistics-modal/statistics-modal';
import { StatisticsData, StatisticsService } from '../services/statisticsService';

type HistoryModalData = {
    title: string;
    historyEntries: Record<string, string[]>;
};

const today = new Date().toISOString().split('T')[0];

const useMemoAsync = <T extends unknown>(fn: () => Promise<T>, deps: any[]) => {
    const [value, setValue] = useState<T | undefined>(undefined);
    useEffect(() => {
        let isMounted = true;
        fn().then(result => {
            if (isMounted) {
                setValue(result);
            }
        });
        return () => {
            isMounted = false;
        };
    }, deps);
    return value;
};

export const Dashboard = () => {
    const [version, setVersion] = useState(0);
    const [selectedDate, setSelectedDate] = useState(today);
    const [historyModalData, setHistoryModalData]
        = useState<HistoryModalData | undefined>(undefined);
    const [statisticsModalData, setStatisticsModalData]
        = useState<StatisticsData | undefined>(undefined);

    const repository = useMemo(() => Repository.instance, []);
    const statisticsService = useMemo(
        () => new StatisticsService(repository),
        [repository]);

    const persistentData = useMemoAsync(
        () => repository.getPersistentData(),
        [version]);

    const dailyData = useMemoAsync(
        () => repository.getOrCreateDailyData(selectedDate),
        [selectedDate, version]);

    if (!persistentData || !dailyData) {
        return <div className="loading">Загрузка...</div>;
    }

    const incrementVersion = () => {
        setVersion(prev => prev + 1);
    }

    const updatePersistentData = async (newData: Partial<typeof persistentData>) => {
        await repository.savePersistentData({ ...persistentData, ...newData });
        incrementVersion();
    }

    const onDailyDataChange = (newData: Partial<typeof dailyData>) => {
        const updatedData = { ...dailyData, ...newData };
        repository.saveDailyData(selectedDate, updatedData);
        incrementVersion();
    }

    const getPersistentSimpleListProps = (key: keyof typeof persistentData) => ({
        items: persistentData[key] as string[],
        onChange: (newItems: string[]) => {
            updatePersistentData({ [key]: newItems });
        },
        className: key,
    });

    const showHistory = async (key: keyof typeof dailyData, dataName: string) => {
        const historyEntries = await repository.getHistoricalData(key);
        const title = `История записей: ${dataName}`;
        setHistoryModalData({ title, historyEntries });
    };

    const getDailySimpleListProps = (key: keyof typeof dailyData, title: string) => ({
        title,
        items: dailyData[key] as string[],
        onChange: (newItems: string[]) =>
            onDailyDataChange({ ...dailyData, [key]: newItems }),
        className: key,
        onTitleClick: () => showHistory(key, title),
    });

    const openStatisticsModal = async () => {
        const statistics = await statisticsService.getStatistics();
        setStatisticsModalData(statistics);
    };

    return (
        <div className="dashboard">
            <SimpleListCard {...getPersistentSimpleListProps('debts')} title="Долги" />
            <SimpleListCard {...getPersistentSimpleListProps('remember')} title="Не забыть" />
            <SimpleListCard {...getDailySimpleListProps('balance', "Доходы/расходы")} />
            <SimpleListCard {...getDailySimpleListProps('thoughts', "Мысли")} />

            <MainPane
                className="main-pane"
                openStatisticsModal={openStatisticsModal}
                currentDate={selectedDate}
                onDateChange={setSelectedDate}
                recurringTasks={dailyData.recurringTasks}
                onRecurringTasksChange={(newTasks: CheckableItem[]) => {
                    onDailyDataChange({ ...dailyData, recurringTasks: newTasks });
                }}
                temporaryTasks={dailyData.temporaryTasks}
                onTemporaryTasksChange={(newTasks: Record<string, CheckableItem[]>) => {
                    onDailyDataChange({ ...dailyData, temporaryTasks: newTasks });
                }}
                energy={dailyData.energy}
                onEnergyChange={(newEnergy: number) => {
                    onDailyDataChange({ ...dailyData, energy: newEnergy });
                }}
                tiredness={dailyData.tiredness}
                onTirednessChange={(newTiredness: number) => {
                    onDailyDataChange({ ...dailyData, tiredness: newTiredness });
                }}
                sleepHours={dailyData.sleepHours}
                onSleepHoursChange={(newSleepHours: number) => {
                    onDailyDataChange({ ...dailyData, sleepHours: newSleepHours });
                }}
            />

            <SimpleListCard {...getPersistentSimpleListProps('globalPlans')} title="Глобальные планы" />
            <SimpleListCard {...getPersistentSimpleListProps('nearPlans')} title="Ближайшие планы" />
            <SimpleListCard {...getDailySimpleListProps('goodThings', "Хорошее за день")} />
            <FoodCard
                className="food"
                data={dailyData.food}
                onChange={(newFood) => {
                    onDailyDataChange({ ...dailyData, food: newFood });
                }} />


            <HistoryModal
                title={historyModalData?.title}
                historyEntries={historyModalData?.historyEntries}
                onClose={() => setHistoryModalData(undefined)}
            />

            <StatisticsModal
                statistics={statisticsModalData}
                onClose={() => setStatisticsModalData(undefined)}
            />
        </div>

    )
};