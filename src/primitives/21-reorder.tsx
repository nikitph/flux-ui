import React, { forwardRef } from "react";
import { Reorder as MotionReorder, useDragControls } from "motion/react";
import { PhysicsPreset } from "../config/flux.config";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { resolveMotion } from "../utils/resolveMotion";

export interface ReorderProps<T> {
    items: T[];
    onReorder: (newOrder: T[]) => void;
    axis?: "x" | "y";
    gap?: number;
    renderItem: (item: T, index: number, isDragging: boolean) => React.ReactNode;
    dragHandle?: boolean;
    physics?: PhysicsPreset;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}

function ReorderComponent<T extends { id: string | number }>(
    {
        items,
        onReorder,
        axis = "y",
        gap = 8,
        renderItem,
        dragHandle = false,
        physics = "bouncy",
        className,
        style,
        disabled = false,
    }: ReorderProps<T>,
    ref: React.Ref<HTMLUListElement>
) {
    const isReducedMotion = useReducedMotion();
    const springConfig = resolveMotion(physics, undefined, isReducedMotion);

    if (disabled) {
        return (
            <ul ref={ref} className={className} style={{ display: "flex", flexDirection: axis === "x" ? "row" : "column", gap, ...style }}>
                {items.map((item, index) => (
                    <li key={item.id} style={{ listStyle: "none" }}>{renderItem(item, index, false)}</li>
                ))}
            </ul>
        );
    }

    return (
        <MotionReorder.Group
            ref={ref}
            axis={axis}
            values={items}
            onReorder={onReorder}
            className={className}
            style={{ display: "flex", flexDirection: axis === "x" ? "row" : "column", gap, listStyle: "none", ...style }}
        >
            {items.map((item, index) => (
                <ReorderItem
                    key={item.id}
                    item={item}
                    index={index}
                    renderItem={renderItem}
                    dragHandle={dragHandle}
                    springConfig={springConfig}
                />
            ))}
        </MotionReorder.Group>
    );
}

const ReorderItem = ({ item, index, renderItem, dragHandle, springConfig }: any) => {
    const [isDragging, setIsDragging] = React.useState(false);
    const controls = useDragControls();

    return (
        <MotionReorder.Item
            value={item}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
            dragListener={!dragHandle}
            dragControls={controls}
            layout
            transition={springConfig}
            style={{ position: "relative" }}
        >
            {dragHandle ? (
                <ReorderContext.Provider value={controls}>
                    {renderItem(item, index, isDragging)}
                </ReorderContext.Provider>
            ) : (
                renderItem(item, index, isDragging)
            )}
        </MotionReorder.Item>
    );
};

export const ReorderContext = React.createContext<any>(null);

export function ReorderDragHandle({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
    const controls = React.useContext(ReorderContext);
    return (
        <div
            onPointerDown={(e) => controls?.start(e)}
            style={{ cursor: "grab", touchAction: "none", ...style }}
            className={className}

        >
            {children}
        </div>
    );
}

export const Reorder = forwardRef(ReorderComponent) as <T extends { id: string | number }>(
    props: ReorderProps<T> & { ref?: React.Ref<HTMLUListElement> }
) => React.ReactElement;

(Reorder as any).Handle = ReorderDragHandle;
