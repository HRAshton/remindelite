import { useMemo } from 'react';
import { SimpleTextListCard } from '../simple-list-card/simple-list-card';

export interface BalanceCardProps {
    data: string[];
    onChange: (newData: string[]) => void;
    className: string;
}

export const BalanceCard = (props: BalanceCardProps) => {
    const totalCounts = useMemo(() => {
        let incomes = 0;
        let expenses = 0;
        props.data.forEach(item => {
            const parts = item.split(' ', 2);
            const amount = parseFloat(parts[0]);
            if (isFinite(amount)) {
                if (amount > 0) {
                    incomes += amount;
                } else {
                    expenses += Math.abs(amount);
                }
            }
        });
        const sum = incomes - expenses;
        return { incomes, expenses, sum };
    }, [props.data]);

    return (
        <SimpleTextListCard
            items={props.data}
            onChange={props.onChange}
            className={props.className}
            title="Доходы/Расходы"
            isValidNewItem={(item) => {
                const parts = item.split(' ', 2);
                const amount = parseFloat(parts[0]);
                if (!isFinite(amount)) return false;

                return true;
            }}
            footer={
                <div className="balance-card-footer">
                    <span>{totalCounts.incomes.toFixed(2)}</span>
                    {' - '}
                    <span>{totalCounts.expenses.toFixed(2)}</span>
                    {' = '}
                    <span>
                        {totalCounts.sum > 0 && '+'}
                        {totalCounts.sum.toFixed(2)}
                    </span>
                </div>
            }
        />
    );
}