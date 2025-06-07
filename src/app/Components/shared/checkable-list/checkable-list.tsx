import './checkable-list.scss';
import { AppendableList } from "../appendable-list/appendable-list";
import { DraggableList } from "../draggable-list/draggable-list";
import { EditableLabel } from "../editable-label/editable-label";

export interface CheckableListProps {
    items: CheckableItem[];
    onChange: (newItems: CheckableItem[]) => void;
    className?: string;
}

export interface CheckableItem {
    label: string;
    checked: boolean;
}

export const CheckableList = (props: CheckableListProps) => {
    const renderNewItem = (
        item: CheckableItem,
        onChange: (updatedItem: CheckableItem) => void,
        onBlur: () => void,
    ) => {
        return (
            <input
                type="text"
                value={item.label}
                onChange={(e) => onChange({ ...item, label: e.target.value })}
                onBlur={onBlur}
                autoFocus
            />
        )
    };

    const isValidNewItem = (item: CheckableItem) => {
        return item.label.trim() !== "";
    };

    const onChange = (newItems: CheckableItem[]) => {
        const validItems = newItems.filter(isValidNewItem);
        props.onChange(validItems);
    }

    const appendItem = (item: CheckableItem) => {
        const newList = [...props.items, item];
        onChange(newList);
    };

    return (
        <AppendableList
            className={`checkable-list ${props.className || ""}`}
            newItemFactory={() => ({ label: "", checked: false })}
            renderNewItem={renderNewItem}
            isNewItemValid={isValidNewItem}
            appendItem={appendItem}
        >
            <ul className="checkable-list-items">
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
                            renderReadOnly={(value) => (
                                <li className="checkable-list-item">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={value.checked}
                                            onChange={() => {
                                                const newList = [...props.items];
                                                newList[index] = {
                                                    ...value,
                                                    checked: !value.checked,
                                                };
                                                props.onChange(newList);
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        {value.label}
                                    </label>
                                </li>
                            )}
                            renderEditing={(value, onChange, onBlur) => (
                                <input
                                    type="text"
                                    value={value.label}
                                    onChange={(e) => onChange({ ...value, label: e.target.value })}
                                    onBlur={onBlur}
                                    autoFocus
                                />
                            )}
                        />
                    )}
                />
            </ul>
        </AppendableList>
    );
};