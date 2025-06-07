import './appendable-list.scss';
import { useEffect, useState, useRef } from "react";

export interface AppendableListProps<T> {
    className?: string;
    children?: React.ReactNode;

    newItemFactory: () => T;
    renderNewItem: (
        item: T,
        onChange: (updatedItem: T) => void,
        onBlur: () => void,
    ) => React.ReactNode;

    isNewItemValid: (item: T) => boolean;
    appendItem: (item: T) => void;
}

/*
 * AppendableList is a component that allows users to add new items to a list.
 * It provides a button to create a new item and a way to render the new item.
 * The new item can be validated before being appended to the list.
 */
export function AppendableList<T>(props: AppendableListProps<T>) {
    const [newItem, setNewItem] = useState<T | undefined>(undefined);

    const initializeNewItem = () => {
        const item = props.newItemFactory();
        setNewItem(item);
    };

    const tryCommitChanges = () => {
        if (props.isNewItemValid(newItem)) {
            props.appendItem(newItem);
        }

        setNewItem(undefined);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!newItem) return;

            if (event.key === 'Enter') {
                tryCommitChanges();
                initializeNewItem();
            } else if (event.key === 'Escape') {
                setNewItem(undefined);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [newItem, props.isNewItemValid, props.appendItem]);

    return (
        <div className={`appendable-list ${props.className || ""}`}>
            <div className="appendable-list-content">
                {props.children}
            </div>

            {newItem === undefined && (
                <div className="appendable-list-new-item-button">
                    <button
                        className="appendable-list-add-button"
                        onClick={initializeNewItem}
                    >
                        +
                    </button>
                </div>
            )}

            {newItem !== undefined && (
                <div className="appendable-list-new-item">
                    {props.renderNewItem(
                        newItem,
                        (updatedItem) => setNewItem(updatedItem),
                        tryCommitChanges,
                    )}
                </div>
            )}
        </div>
    );
}