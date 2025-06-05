import './main-pane-header.scss';

export interface MainPaneHeaderProps {
    currentDate: string;
    onDateChange: (newDate: string) => void;
}

export const MainPaneHeader = (props: MainPaneHeaderProps) => {
    const onDateChange = (days: number) => {
        const currentDate = new Date(props.currentDate);
        currentDate.setDate(currentDate.getDate() + days);
        props.onDateChange(currentDate.toISOString().split('T')[0]);
    }

    const resetDate = () => {
        const today = new Date();
        props.onDateChange(today.toISOString().split('T')[0]);
    }

    const formattedDate = new Date(props.currentDate).toLocaleDateString(
        'ru-RU',
        { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="main-pane-header">
            <button onClick={() => onDateChange(-1)}>
                −
            </button>

            <h2>{formattedDate}</h2>

            <button onClick={resetDate}>
                C
            </button>

            <button onClick={() => onDateChange(1)}>
                +
            </button>
        </div>
    );
}