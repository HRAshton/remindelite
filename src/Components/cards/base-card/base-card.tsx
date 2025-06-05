import './base-card.scss';

export interface BaseCardProps {
    className?: string;
    header: React.ReactNode;
    children: React.ReactNode;
}

export const BaseCard = ({ header, children, className }: BaseCardProps) => {
    return (
        <div className={`card ${className}`}>
            <div className="card-header">
                {header}
            </div>
            <hr />
            <div className="card-content">
                {children}
            </div>
        </div>
    );
};