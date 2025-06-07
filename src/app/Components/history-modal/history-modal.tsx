import './history-modal.scss';
import { SimpleModal } from '../simple-modal/simple-modal';

export interface HistoryModalProps {
    title: string;
    historyEntries: Record<string, string[]> | undefined;
    onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = (props) => (
    <SimpleModal
        title={props.title}
        isOpen={!!props.historyEntries}
        onClose={props.onClose}
        className="history-modal"
    >
        {Object.entries(props.historyEntries || {}).length === 0 ? (
            <p>История пуста.</p>
        ) : (
            Object.entries(props.historyEntries).map(([date, entries]) => (
                <div key={date} className="history-entry">
                    <h3>{date}</h3>
                    <ul>
                        {entries.map((entry, index) => (
                            <li key={index}>{entry}</li>
                        ))}
                    </ul>
                </div>
            ))
        )}
    </SimpleModal>
);