import type { StatisticsData } from '../../services/statisticsService';
import { SimpleModal } from '../simple-modal/simple-modal';
import './statistics-modal.scss';

export interface StatisticsModalProps {
    onClose: () => void;
    statistics: StatisticsData | undefined;
}

export const StatisticsModal: React.FC<StatisticsModalProps> = (props) => {
    return (
        <SimpleModal
            title="Статистика"
            isOpen={!!props.statistics}
            onClose={props.onClose}
        >
            <ul>
                {Object.entries(props.statistics || {}).map(([key, value]) => (
                    <li key={key}>
                        <strong>{key}:</strong> {value}
                    </li>
                ))}
            </ul>
        </SimpleModal>
    );
}
