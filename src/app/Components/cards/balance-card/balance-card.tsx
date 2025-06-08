import { SimpleTextListCard } from '../simple-list-card/simple-list-card';

export interface BalanceCardProps {
    data: string[];
    onChange: (newData: string[]) => void;
    onTitleClick: () => void;
    className: string;
}

export const BalanceCard = (props: BalanceCardProps) => {
    return (
        <SimpleTextListCard
            items={props.data}
            onChange={props.onChange}
            className={props.className}
            title="Доходы/Расходы"
            onTitleClick={props.onTitleClick}
            isValidNewItem={(item) => {
                const parts = item.split(' ', 2);
                const amount = parseFloat(parts[0]);
                if (!isFinite(amount)) return false;

                return true;
            }}
        />
    );
}