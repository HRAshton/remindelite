import { Notification } from 'electron';
import { Config } from '../../common/config';
import { Repository } from '../../common/repository';

export class NotificationsService {
    public constructor(private readonly repository: Repository) {
    }

    public scheduleNotifications(): void {
        setInterval(() => this.notifyIfNeeded(), Config.NotificationInterval);
    }

    private async notifyIfNeeded(): Promise<void> {
        const today = new Date().toISOString().split('T')[0];
        const dailyData = await this.repository.getOrCreateDailyData(today);
        const tasks = [
            ...dailyData.recurringTasks,
            ...Object.values(dailyData.temporaryTasks).flat(),
        ];

        const areAllTasksDone = tasks.every(task => task.checked);
        if (!areAllTasksDone) {
            const pendingTasks = tasks.filter(task => !task.checked);
            const taskNames = pendingTasks.map(task => task.label).join(', ');
            this.notify(
                'Задачи на сегодня',
                `У вас есть невыполненные задачи на сегодня: ${taskNames}`,
            );
        }
    }

    private notify(title: string, body: string): void {
        new Notification({ title, body }).show();
    }
}