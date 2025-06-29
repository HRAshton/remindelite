import './zoomable.scss';
import { useRef, useEffect, useState } from 'react';

interface ZoomableProps {
    children: React.ReactNode;
    className?: string;
}

export const Zoomable = ({ children, className = '' }: ZoomableProps) => {
    const containerRef = useRef(null);
    const contentRef = useRef(null);

    const [state, setState] = useState({
        scale: 1,
        offsetX: 0,
        offsetY: 0,
        isDragging: false,
        lastX: 0,
        lastY: 0,
    });

    const applyTransform = () => {
        const { offsetX, offsetY, scale } = state;
        if (contentRef.current) {
            contentRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
        }
    };

    useEffect(() => {
        applyTransform();
    }, [state]);

    useEffect(() => {
        const container = containerRef.current;

        const onWheel = (e: WheelEvent) => {
            if (!e.ctrlKey) return;
            e.preventDefault();

            const zoomIntensity = 0.1;
            const zoom = e.deltaY < 0 ? 1 + zoomIntensity : 1 - zoomIntensity;

            const rect = contentRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const newScale = state.scale * zoom;
            const newOffsetX = (state.offsetX - x) * zoom + x;
            const newOffsetY = (state.offsetY - y) * zoom + y;

            setState((prev) => ({
                ...prev,
                scale: newScale,
                offsetX: newOffsetX,
                offsetY: newOffsetY,
            }));
        };

        const onMouseDown = (e: MouseEvent) => {
            e.preventDefault();
            setState((prev) => ({
                ...prev,
                isDragging: true,
                lastX: e.clientX,
                lastY: e.clientY,
            }));
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!state.isDragging) return;

            const dx = e.clientX - state.lastX;
            const dy = e.clientY - state.lastY;

            setState((prev) => ({
                ...prev,
                offsetX: prev.offsetX + dx,
                offsetY: prev.offsetY + dy,
                lastX: e.clientX,
                lastY: e.clientY,
            }));
        };

        const onMouseUp = () => {
            if (state.isDragging) {
                setState((prev) => ({
                    ...prev,
                    isDragging: false,
                }));
            }
        };

        container.addEventListener('wheel', onWheel, { passive: false });
        container.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

        return () => {
            container.removeEventListener('wheel', onWheel);
            container.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [state]);

    return (
        <div
            ref={containerRef}
            className={`zoomable ${state.isDragging ? 'dragging' : ''} ${className}`}
        >
            <div
                ref={contentRef}
                className="zoomable-content"
            >
                {children}
            </div>
        </div>
    );
};
