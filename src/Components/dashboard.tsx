import './dashboard.scss';
import { useMemo, useState } from 'react';
import { MainPane } from './cards/main-pane/main-pane';
import { Repository } from '../services/database/repository';
import { CheckableItem, DailyStoredData } from '../services/database/entries';
import { SimpleListCard } from './cards/simple-list-card/simple-list-card';
import { FoodCard } from './cards/food-card/food-card';

const today = new Date().toISOString().split('T')[0];

export const Dashboard = () => {
    const [version, setVersion] = useState(0);
    const [selectedDate, setSelectedDate] = useState(today);

    const persistentData = useMemo(
        () => new Repository().getPersistentData(),
        [version]);

    const dailyData = useMemo(
        () => new Repository().getOrCreateDailyData(selectedDate),
        [selectedDate, version]);

    const incrementVersion = () => {
        setVersion(prev => prev + 1);
    }

    const updatePersistentData = (newData: Partial<typeof persistentData>) => {
        new Repository().savePersistentData({ ...persistentData, ...newData });
        incrementVersion();
    }

    const onDailyDataChange = (newData: Partial<typeof dailyData>) => {
        const updatedData = { ...dailyData, ...newData };
        new Repository().saveDailyData(selectedDate, updatedData);
        incrementVersion();
    }

    const getPersistentSimpleListProps = (key: keyof typeof persistentData) => ({
        items: persistentData[key] as string[],
        onChange: (newItems: string[]) => {
            updatePersistentData({ [key]: newItems });
        },
        className: key,
    });

    const getDailySimpleListProps = (key: keyof typeof dailyData) => ({
        items: dailyData[key] as string[],
        onChange: (newItems: string[]) =>
            onDailyDataChange({ ...dailyData, [key]: newItems }),
        className: key,
    });

    return (
        <div className="dashboard">
            <SimpleListCard {...getPersistentSimpleListProps('debts')} title="Долги" />
            <SimpleListCard {...getPersistentSimpleListProps('remember')} title="Не забыть" />
            <SimpleListCard {...getDailySimpleListProps('balance')} title="Доходы/расходы" />
            <SimpleListCard {...getDailySimpleListProps('thoughts')} title="Мысли" />

            <MainPane
                className="main-pane"
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
            />

            <SimpleListCard {...getPersistentSimpleListProps('globalPlans')} title="Глобальные планы" />
            <SimpleListCard {...getPersistentSimpleListProps('nearPlans')} title="Ближайшие планы" />
            <SimpleListCard {...getDailySimpleListProps('goodThings')} title="Хорошее за день" />
            <FoodCard
                className="food"
                data={dailyData.food}
                onChange={(newFood) => {
                    onDailyDataChange({ ...dailyData, food: newFood });
                }} />
        </div>
    );
};