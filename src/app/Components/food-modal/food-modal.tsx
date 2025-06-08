import { useState } from 'react';
import { SimpleModal } from '../simple-modal/simple-modal';
import './food-modal.scss';
import { FoodData } from '../../../common/entries';
import { PastableImage } from '../shared/pastable-image/pastable-image';

export interface FoodModalProps {
    foodData: FoodData[];
    onFoodDataChange: (newFoodData: FoodData[]) => void;
    onClose: () => void;
}

export const FoodModal: React.FC<FoodModalProps> = (props) => {
    const onImageChange = (index: number, newImage: string) => {
        const updatedFoodData = [...props.foodData];
        updatedFoodData[index] = { ...updatedFoodData[index], image: newImage };
        props.onFoodDataChange(updatedFoodData);
    }

    return (
        <SimpleModal
            title="Еда"
            isOpen={true}
            onClose={props.onClose}
        >
            <div className="food-modal-content">
                {props.foodData.length > 0 ? (
                    props.foodData.map((food, index) => (
                        <div key={index} className="food-item">
                            <h3>{food.comment}</h3>
                            <PastableImage
                                image={food.image}
                                onChange={(newImage) => {
                                    onImageChange(index, newImage);
                                }}
                            />
                        </div>
                    ))
                ) : (
                    <p>Нет данных о еде.</p>
                )}
            </div>
        </SimpleModal>
    );
};