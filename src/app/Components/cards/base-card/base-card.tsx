import './base-card.scss';

export interface BaseCardProps {
    header: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    onHeaderClick?: () => void;
    footer?: React.ReactNode;
}

export const BaseCard = (props: BaseCardProps) => {
    return (
        <div className={`card ${props.className}`}>
            <div
                className={`card-header ${props.onHeaderClick ? 'card-header-clickable' : ''}`}
                onClick={props.onHeaderClick}
            >
                {props.header}
            </div>
            <hr />
            <div className="card-content">
                {props.children}
            </div>
            {props.footer && (
                <div className="card-footer">
                    {props.footer}
                </div>
            )}
        </div>
    );
};