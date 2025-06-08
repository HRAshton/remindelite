import { FoodData } from "../../../../common/entries";
import { SimpleListCard } from '../simple-list-card/simple-list-card';

export interface FoodCardProps {
    data: FoodData[];
    onChange: (newData: FoodData[]) => void;
    onTitleClick: () => void;
    className: string;
}

export const FoodCard = (props: FoodCardProps) => {
    return (
        <SimpleListCard<FoodData>
            items={props.data}
            onChange={props.onChange}
            className={props.className}
            title="Еда"
            onTitleClick={props.onTitleClick}
            getItemText={(item) => item.comment}
            setItemText={(item, text) => ({ ...item, comment: text })}
            createNewItem={() => ({ comment: '', image: '' })}
            isValidNewItem={(item) => item.comment.trim() !== ''}
        />
    );
}