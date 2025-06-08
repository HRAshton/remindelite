import './dashboard.scss';
import { useEffect, useMemo, useState } from 'react';
import type { CheckableItem } from '../../common/entries';
import { Repository } from '../../common/repository';
import { MainPane } from './cards/main-pane/main-pane';
import { SimpleTextListCard } from './cards/simple-list-card/simple-list-card';
import { FoodCard } from './cards/food-card/food-card';
import { HistoryModal } from './history-modal/history-modal';
import { StatisticsModal } from './statistics-modal/statistics-modal';
import { ExternalStorage } from '../services/database/external-storage';
import { FoodModal } from './food-modal/food-modal';
import { BalanceCard } from './cards/balance-card/balance-card';

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
    const [isStatisticsModalOpen, setIsStatisticsModalOpen] = useState(false);
    const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);

    const repository = useMemo(() => new Repository(new ExternalStorage()), []);

    const persistentData = useMemoAsync(
        () => repository.getPersistentData(),
        [version]);

    const monthlyData = useMemoAsync(
        () => repository.getOrCreateMonthlyData(selectedDate.slice(0, 7)),
        [selectedDate, version]);

    const dailyData = useMemoAsync(
        () => repository.getOrCreateDailyData(selectedDate),
        [selectedDate, version]);

    if (!persistentData || !dailyData || !monthlyData) {
        return <div className="loading">Загрузка...</div>;
    }

    const incrementVersion = () => {
        setVersion(prev => prev + 1);
    }

    const onPersistentDataChange = async (newData: Partial<typeof persistentData>) => {
        await repository.savePersistentData({ ...persistentData, ...newData });
        incrementVersion();
    }

    const onMonthlyDataChange = (newData: Partial<typeof monthlyData>) => {
        const date = selectedDate.slice(0, 7); // YYYY-MM format
        const updatedData = { ...monthlyData, ...newData };
        repository.saveMonthlyData(date, updatedData);
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
            onPersistentDataChange({ [key]: newItems });
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
            onDailyDataChange({ [key]: newItems }),
        className: key,
        onTitleClick: () => showHistory(key, title),
    });

    return (
        <div className="dashboard">
            <SimpleTextListCard {...getPersistentSimpleListProps('debts')} title="Долги" />
            <SimpleTextListCard {...getPersistentSimpleListProps('remember')} title="Не забыть" />
            <BalanceCard
                className="balance"
                data={monthlyData.balance}
                onChange={(newData) => {
                    onMonthlyDataChange({ balance: newData });
                }}
            />
            <SimpleTextListCard {...getDailySimpleListProps('thoughts', "Мысли")} />

            <MainPane
                className="main-pane"
                openStatisticsModal={() => setIsStatisticsModalOpen(true)}
                currentDate={selectedDate}
                onDateChange={setSelectedDate}
                recurringTasks={dailyData.recurringTasks}
                onRecurringTasksChange={(newTasks: CheckableItem[]) => {
                    onDailyDataChange({ recurringTasks: newTasks });
                }}
                temporaryTasks={dailyData.temporaryTasks}
                onTemporaryTasksChange={(newTasks: Record<string, CheckableItem[]>) => {
                    onDailyDataChange({ temporaryTasks: newTasks });
                }}
                energy={dailyData.energy}
                onEnergyChange={(newEnergy: number) => {
                    onDailyDataChange({ energy: newEnergy });
                }}
                tiredness={dailyData.tiredness}
                onTirednessChange={(newTiredness: number) => {
                    onDailyDataChange({ tiredness: newTiredness });
                }}
                sleepHours={dailyData.sleepHours}
                onSleepHoursChange={(newSleepHours: number) => {
                    onDailyDataChange({ sleepHours: newSleepHours });
                }}
            />

            <SimpleTextListCard {...getPersistentSimpleListProps('globalPlans')} title="Глобальные планы" />
            <SimpleTextListCard {...getPersistentSimpleListProps('nearPlans')} title="Ближайшие планы" />
            <SimpleTextListCard {...getDailySimpleListProps('goodThings', "Хорошее за день")} />
            <FoodCard
                className="food"
                data={dailyData.food}
                onTitleClick={() => setIsFoodModalOpen(true)}
                onChange={(newFood) => {
                    onDailyDataChange({ food: newFood });
                }}
            />


            {historyModalData && (
                <HistoryModal
                    title={historyModalData.title}
                    historyEntries={historyModalData?.historyEntries}
                    onClose={() => setHistoryModalData(undefined)}
                />
            )}

            {isStatisticsModalOpen && (
                <StatisticsModal
                    repository={repository}
                    onClose={() => setIsStatisticsModalOpen(false)}
                />
            )}

            {isFoodModalOpen && (
                <FoodModal
                    foodData={dailyData.food}
                    onFoodDataChange={(food) => {
                        onDailyDataChange({ food });
                    }}
                    onClose={() => setIsFoodModalOpen(false)}
                />
            )}
        </div>

    )
};