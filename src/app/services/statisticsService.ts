import { Repository } from "./database/repository";

export interface StatisticsData {
    [key: string]: number;
}

export class StatisticsService {
        public constructor(private readonly repository: Repository) {
    }

    public async getStatistics(): Promise<StatisticsData> {
        return {};
    }
}
