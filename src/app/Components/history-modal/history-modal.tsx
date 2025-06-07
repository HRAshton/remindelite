import './history-modal.scss';
import Modal from 'react-modal';

export interface HistoryModalProps {
    title: string;
    historyEntries: Record<string, string[]> | undefined;
    onClose: () => void;
}

export const HistoryModal = (props: HistoryModalProps) => {
    const { historyEntries, onClose } = props;

    return (
        <Modal
            appElement={document.getElementById('modal-root')}
            isOpen={!!historyEntries}
            onRequestClose={onClose}
            shouldCloseOnOverlayClick={true}
            shouldCloseOnEsc={true}
            className="history-modal"
        >
            <div className="history-modal-header">
                <h2>{props.title}</h2>
                <button className="close-button" onClick={onClose}>
                    &times;
                </button>
            </div>
            <div className="history-modal-content">
                {Object.entries(historyEntries || {}).length === 0 ? (
                    <p>История пуста.</p>
                ) : (
                    Object.entries(historyEntries).map(([date, entries]) => (
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
            </div>
        </Modal>
    );
}