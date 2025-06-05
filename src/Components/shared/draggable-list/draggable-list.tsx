export interface DraggableListProps<T> {
    items: T[];
    onChange: (newItems: T[]) => void;
    renderItem: (item: T, index: number) => React.ReactNode;
    itemKey?: (item: T) => string | number;
}

export function DraggableList<T>(props: DraggableListProps<T>) {
    const handleDragStart = (event: React.DragEvent<HTMLDivElement>, index: number) => {
        event.dataTransfer.setData('text/plain', index.toString());
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
        event.preventDefault();
        const sourceIndex = parseInt(event.dataTransfer.getData('text/plain'), 10);
        if (sourceIndex === targetIndex || sourceIndex < 0 || targetIndex < 0) return;

        const newItems = [...props.items];
        const [movedItem] = newItems.splice(sourceIndex, 1);
        newItems.splice(targetIndex, 0, movedItem);
        props.onChange(newItems);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    return (
        <div className="draggable-list">
            {props.items.map((item, index) => (
                <div
                    key={props.itemKey ? props.itemKey(item) : index}
                    className="draggable-list-item"
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragOver={handleDragOver}
                >
                    {props.renderItem(item, index)}
                </div>
            ))}
        </div>
    );
}