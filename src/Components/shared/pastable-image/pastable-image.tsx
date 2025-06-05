import './pastable-image.scss';

export interface PastableImageProps {
    image: string;
    onChange: (newImage: string) => void;
    className?: string;
}

export const PastableImage = (props: PastableImageProps) => {
    const onPasteClick = async (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();

        const items = await navigator.clipboard.read();
        const images = items.filter(item => item.types.includes('image/png'));
        if (images.length === 0) {
            console.warn('No PNG images found in clipboard');
            return;
        }

        const image = images[0];
        const blob = await image.getType('image/png');
        const reader = new FileReader();
        reader.onload = () => {
            props.onChange(reader.result as string);
        };
        reader.readAsDataURL(blob);
    }

    return (
        <div className={`pastable-image ${props.className}`}>
            {props.image && (
                <img
                    src={props.image}
                    alt="Pastable"
                    className="pastable-image-content"
                    onClick={() => {
                        navigator.clipboard.writeText(props.image);
                    }}
                />
            )}

            <div
                className="pastable-image-overlay"
                title="Вставить из буфера обмена"
                onClick={onPasteClick}
            >
                <span className="pastable-image-overlay-text">
                    Вставить из буфера обмена
                </span>
            </div>
        </div>
    );
};
