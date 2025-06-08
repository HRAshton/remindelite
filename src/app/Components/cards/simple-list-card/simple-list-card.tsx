import './simple-list-card.scss';
import { AppendableList } from "../../shared/appendable-list/appendable-list";
import { BaseCard } from "../base-card/base-card";
import { DraggableList } from "../../shared/draggable-list/draggable-list";
import { EditableLabel } from "../../shared/editable-label/editable-label";

export interface SimpleListCardProps<T> {
    items: T[];
    onChange: (newItems: T[]) => void;
    title: string;
    className?: string;
    onTitleClick?: () => void;

    getItemText: (item: T) => string;
    setItemText: (item: T, text: string) => T;
    createNewItem: () => T;
    isValidNewItem: (item: T) => boolean;

    footer?: React.ReactNode;
}

export const SimpleListCard = <T extends unknown>(props: SimpleListCardProps<T>) => {
    const renderNewItem = (
        item: T,
        onChange: (updatedItem: T) => void,
        onBlur: () => void,
    ) => {
        return (
            <input
                type="text"
                className={`simple-list-card-new-item-input ${props.isValidNewItem(item) ? '' : 'invalid'}`}
                value={props.getItemText(item)}
                onChange={(e) => onChange(props.setItemText(item, e.target.value))}
                onBlur={onBlur}
                autoFocus
            />
        )
    };

    const onChange = (newItems: T[]) => {
        const validItems = newItems.filter(props.isValidNewItem);
        props.onChange(validItems);
    }

    const appendItem = (item: T) => {
        const newList = [...props.items, item];
        onChange(newList);
    };

    return (
        <BaseCard
            className={`simple-list-card ${props.className || ""}`}
            header={<h2>{props.title}</h2>}
            onHeaderClick={props.onTitleClick}
            footer={props.footer}
        >
            <AppendableList<T>
                newItemFactory={props.createNewItem}
                renderNewItem={renderNewItem}
                isNewItemValid={props.isValidNewItem}
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
                                    <li className="simple-list-card-item">
                                        {props.getItemText(item)}
                                    </li>
                                }
                                renderEditing={renderNewItem}
                            />
                        )}
                    />
                </ul>
            </AppendableList>
        </BaseCard>
    );
};

export const SimpleTextListCard = (
    props: Omit<
        SimpleListCardProps<string>,
        'createNewItem' | 'setItemText' | 'getItemText' | 'isValidNewItem'
    > & {
        isValidNewItem?: (item: string) => boolean;
    }
) => (
    <SimpleListCard<string>
        createNewItem={() => ""}
        setItemText={(_, text) => text}
        getItemText={(item) => item}
        isValidNewItem={(item) => item.trim() !== ""}

        {...props}
    />
);
