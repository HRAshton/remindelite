import { useMemo } from 'react';
import { parseBalance } from '../../../helpers/parsing-helpers';
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
            const balance = parseBalance(item);
            if (!balance) return;

            if (balance[0] > 0) {
                incomes += balance[0];
            } else {
                expenses += Math.abs(balance[0]);
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
            isValidNewItem={(item) => !!parseBalance(item)}
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