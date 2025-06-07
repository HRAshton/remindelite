import './simple-list-card.scss';
import { AppendableList } from "../../shared/appendable-list/appendable-list";
import { BaseCard } from "../base-card/base-card";
import { DraggableList } from "../../shared/draggable-list/draggable-list";
import { EditableLabel } from "../../shared/editable-label/editable-label";

export interface SimpleListCardProps {
    items: string[];
    onChange: (newItems: string[]) => void;
    title: string;
    className?: string;
    onTitleClick?: () => void;
}

export const SimpleListCard = (props: SimpleListCardProps) => {
    const renderNewItem = (
        item: string,
        onChange: (updatedItem: string) => void,
        onBlur: () => void,
    ) => {
        return (
            <input
                type="text"
                value={item}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                autoFocus
            />
        )
    };

    const isValidNewItem = (item: string) => {
        return item.trim() !== "";
    };

    const onChange = (newItems: string[]) => {
        const validItems = newItems.filter(isValidNewItem);
        props.onChange(validItems);
    }

    const appendItem = (item: string) => {
        const newList = [...props.items, item];
        onChange(newList);
    };

    return (
        <BaseCard
            className={`simple-list-card ${props.className || ""}`}
            header={<h2>{props.title}</h2>}
            onHeaderClick={props.onTitleClick}
        >
            <AppendableList
                newItemFactory={() => ""}
                renderNewItem={renderNewItem}
                isNewItemValid={isValidNewItem}
                appendItem={appendItem}
            >
                <ul className="simple-list-card-items">
                    <DraggableList
                        items={props.items}
                        onChange={onChange}
                        renderItem={(item, index) => (
                            <EditableLabel
                                key={index}
                                value={item}
                                onChange={(newValue) => {
                                    const newList = [...props.items];
                                    newList[index] = newValue;
                                    onChange(newList);
                                }}
                                renderReadOnly={(value) =>
                                    <li className="simple-list-card-item">{value}</li>
                                }
                                renderEditing={(value, onChange, onBlur) => (
                                    <input
                                        type="text"
                                        value={value}
                                        onChange={(e) => onChange(e.target.value)}
                                        onBlur={onBlur}
                                        autoFocus
                                    />
                                )}
                            />
                        )}
                    />
                </ul>
            </AppendableList>
        </BaseCard>
    );
};
