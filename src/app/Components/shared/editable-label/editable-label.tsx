/*
 * EditableLabel Component
 * Switches between read-only and editable states by clicking on the label.
 */
import './editable-label.scss';
import { useEffect, useState } from 'react';

export interface EditableLabelProps<T> {
    value: T;
    onChange: (newValue: T) => void;

    renderReadOnly: (value: T) => React.ReactNode;
    renderEditing: (
        value: T,
        onChange: (newValue: T) => void,
        onBlur: () => void,
    ) => React.ReactNode;
}

export const EditableLabel = <T extends unknown>(
    props: EditableLabelProps<T>,
) => {
    const [editingValue, setEditingValue] = useState<T | undefined>(undefined);

    const isEditing = editingValue !== undefined;

    const saveChanges = () => {
        props.onChange(editingValue);
        setEditingValue(undefined);
    }

    useEffect(() => {
        if (!isEditing) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                saveChanges();
            } else if (event.key === 'Escape') {
                setEditingValue(undefined);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isEditing, editingValue, props.onChange]);

    const handleOnClick = (event: React.MouseEvent<HTMLSpanElement>) => {
        if (isEditing) return;
        setEditingValue(props.value);
    };

    return (
        <div className="editable-label">
            {!isEditing && (
                <div
                    className="editable-label-read-only"
                    onClick={handleOnClick}
                >
                    {props.renderReadOnly(props.value)}
                </div>
            )}

            {isEditing && (
                <div className="editable-label-editing">
                    {props.renderEditing(
                        editingValue,
                        setEditingValue,
                        saveChanges,
                    )}
                </div>
            )}
        </div>
    );
};