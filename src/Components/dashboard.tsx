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

    const dailyData = useMemo(() => {
        return new Repository().getOrCreate(selectedDate);
    }, [selectedDate, version]);

    const incrementVersion = () => {
        setVersion(prev => prev + 1);
    }

    const onDailyDataChange = (newData: DailyStoredData) => {
        new Repository().save(selectedDate, newData);
        incrementVersion();
    }

    const onChangeSimpleList = (key: keyof DailyStoredData, newItems: string[]) => {
        const updatedData = { ...dailyData, [key]: newItems };
        onDailyDataChange(updatedData);
    }

    const getSimpleListProps = (key: keyof DailyStoredData) => ({
        items: dailyData[key] as string[],
        onChange: (newItems: string[]) => onChangeSimpleList(key, newItems),
        className: key,
    });

    return (
        <div className="dashboard">
            <SimpleListCard {...getSimpleListProps('debts')} title="Долги" />
            <SimpleListCard {...getSimpleListProps('remember')} title="Не забыть" />
            <SimpleListCard {...getSimpleListProps('balance')} title="Доходы/расходы" />
            <SimpleListCard {...getSimpleListProps('thoughts')} title="Мысли" />

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

            <SimpleListCard {...getSimpleListProps('globalPlans')} title="Глобальные планы" />
            <SimpleListCard {...getSimpleListProps('nearPlans')} title="Ближайшие планы" />
            <SimpleListCard {...getSimpleListProps('goodThings')} title="Хорошее за день" />
            <FoodCard
                className="food"
                data={dailyData.food}
                onChange={(newFood) => {
                    onDailyDataChange({ ...dailyData, food: newFood });
                }} />
        </div>
    );
};