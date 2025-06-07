import './main-pane.scss';
import { useMemo } from 'react';
import { CheckableItem } from "../../../../common/entries";
import { MainPaneHeader } from "../../main-pane-header/main-pane-header";
import { BaseCard } from "../base-card/base-card";
import { CheckableList } from '../../shared/checkable-list/checkable-list';

export interface MainPaneProps {
    currentDate: string;
    onDateChange: (newDate: string) => void;

    recurringTasks: CheckableItem[];
    onRecurringTasksChange: (newTasks: CheckableItem[]) => void;

    temporaryTasks: Record<string, CheckableItem[]>;
    onTemporaryTasksChange: (newTasks: Record<string, CheckableItem[]>) => void;

    energy: number;
    onEnergyChange: (newEnergy: number) => void;

    tiredness: number;
    onTirednessChange: (newTiredness: number) => void;

    sleepHours: number;
    onSleepHoursChange: (newSleepHours: number) => void;

    openStatisticsModal: () => void;

    className: string;
}

const calculateCompletedTasks = (props: MainPaneProps): number | null => {
    const recurringTasksCount = props.recurringTasks.length;
    const temporaryTasksCount = Object.values(props.temporaryTasks)
        .reduce((sum, tasks) => sum + tasks.length, 0);
    const totalTasksCount = recurringTasksCount + temporaryTasksCount;

    const completedRecurringTasks = props.recurringTasks.filter(task => task.checked).length;
    const completedTemporaryTasks = Object.values(props.temporaryTasks)
        .reduce((sum, tasks) => sum + tasks.filter(task => task.checked).length, 0);
    const totalCompletedTasks = completedRecurringTasks + completedTemporaryTasks;

    return totalTasksCount > 0
        ? Math.round((totalCompletedTasks / totalTasksCount) * 100)
        : null;
}

export const MainPane = (props: MainPaneProps) => {
    const importantTasksMarkers = [
        "Важное",
        "Рабочее",
        "Учеба",
        "Хобби",
        "Отдых",
    ];

    const completed = useMemo(
        () => calculateCompletedTasks(props),
        [props.recurringTasks, props.temporaryTasks],
    );

    return (
        <BaseCard
            className={`main-pane ${props.className}`}
            header={
                <MainPaneHeader
                    currentDate={props.currentDate}
                    onDateChange={props.onDateChange}
                />
            }
        >
            <div className="main-pane-content-item non-daily-tasks">
                <h3>Я хочу делать ежедневно</h3>
                <CheckableList
                    items={props.recurringTasks}
                    onChange={props.onRecurringTasksChange}
                    className="recurring-tasks"
                />
            </div>

            <div className="main-pane-content-item daily-tasks">
                <h3>Я хочу сделать на день</h3>
                {importantTasksMarkers.map((marker) => (
                    <div key={marker}>
                        <h4>{marker}</h4>
                        <CheckableList
                            items={props.temporaryTasks[marker] || []}
                            onChange={(newTasks: CheckableItem[]) => {
                                props.onTemporaryTasksChange({
                                    ...props.temporaryTasks,
                                    [marker]: newTasks,
                                });
                            }}
                        />
                    </div>
                ))}
            </div>

            <div className="stats-summary">
                <span>Настроение дня:</span>
                <input
                    className="stats-summary-input"
                    type="number"
                    value={props.energy}
                    onChange={(e) => props.onEnergyChange(Number(e.target.value))}
                    min="0"
                    max="100"
                />
                <span>%</span>

                <span>Усталость дня:</span>
                <input
                    className="stats-summary-input"
                    type="number"
                    value={props.tiredness}
                    onChange={(e) => props.onTirednessChange(Number(e.target.value))}
                    min="0"
                    max="100"
                />
                <span>%</span>

                <span>Часы сна:</span>
                <input
                    className="stats-summary-input"
                    type="number"
                    value={props.sleepHours}
                    onChange={(e) => props.onSleepHoursChange(Number(e.target.value))}
                    min="0"
                    max="24"
                />
                <span>%</span>

                <span className="completed-title">
                    Выполнено:
                </span>
                <span className="completed-value">
                    {completed}
                </span>
                <span>%</span>
            </div>

            <div className="stats-details">
                <button onClick={props.openStatisticsModal}>
                    Статистика
                </button>
            </div>
        </BaseCard>
    );
}