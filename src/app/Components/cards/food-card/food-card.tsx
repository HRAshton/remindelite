import './food-card.scss';
import { FoodData } from "../../../services/database/entries";
import { BaseCard } from "../base-card/base-card";
import { EditableLabel } from "../../../Components/shared/editable-label/editable-label";
import { PastableImage } from '../../../Components/shared/pastable-image/pastable-image';

export interface FoodCardProps {
    data: FoodData;
    onChange: (newData: FoodData) => void;
    className: string;
}

export const FoodCard = (props: FoodCardProps) => {

    return (
        <BaseCard
            className={`food-card ${props.className}`}
            header={<h2>Еда</h2>}
        >
            <PastableImage
                className="food-card-image"
                image={props.data.image}
                onChange={(newImage) =>
                    props.onChange({ ...props.data, image: newImage })
                }
            />

            <EditableLabel
                value={props.data.comment}
                onChange={(newComment) =>
                    props.onChange({ ...props.data, comment: newComment })
                }
                renderReadOnly={(value) =>
                    <span className="food-card-comment">{value}</span>
                }
                renderEditing={(value, onChange, onBlur) => (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onBlur={onBlur}
                        placeholder="Комментарий"
                        className="food-card-input"
                        autoFocus
                    />
                )}
            />
        </BaseCard>
    );
}