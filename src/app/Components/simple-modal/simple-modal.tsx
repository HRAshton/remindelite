import './simple-modal.scss';
import Modal from 'react-modal';

export interface SimpleModalProps {
    title: string;
    isOpen: boolean;
    children: React.ReactNode;
    onClose: () => void;
    className?: string;
}

export const SimpleModal: React.FC<SimpleModalProps> = (props) => (
    <Modal
        appElement={document.getElementById('modal-root')}
        isOpen={props.isOpen}
        onRequestClose={props.onClose}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        className={`simple-modal ${props.className || ''}`}
    >
        <div className="simple-modal-header">
            <h2>{props.title}</h2>
            <button className="close-button" onClick={props.onClose}>
                &times;
            </button>
        </div>

        <div className="simple-modal-content">
            {props.children}
        </div>
    </Modal>
);