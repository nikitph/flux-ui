import React, { forwardRef, useEffect, useRef, useState } from "react";
import { PhysicsPreset, motionScale } from "../config/flux.config";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useMergedRef } from "../hooks/useMergedRef";
import { AnimatedList } from "./23-animated-list";

export interface InfiniteScrollProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    keyExtractor: (item: T) => string;
    onLoadMore: () => void | Promise<void>;
    hasMore: boolean;
    threshold?: number;
    loader?: React.ReactNode;
    enterFrom?: "below" | "above" | "left" | "right" | "scale";
    stagger?: number;
    batchSize?: number;
    physics?: PhysicsPreset;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}

function InfiniteScrollComponent<T>(
    {
        items,
        renderItem,
        keyExtractor,
        onLoadMore,
        hasMore,
        threshold = 200,
        loader,
        enterFrom = "below",
        stagger = motionScale.stagger.fast,
        // batchSize = 10,
        physics = "gentle",
        className,
        style,
        disabled = false,
    }: InfiniteScrollProps<T>,
    ref: React.Ref<HTMLDivElement>
) {
    const isReducedMotion = useReducedMotion();
    const internalRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const endMarkerRef = useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRef(ref, internalRef, scrollRef);

    const [isLoading, setIsLoading] = useState(false);

    // Use intersection observer for triggering load more
    useEffect(() => {
        if (disabled || !hasMore || isLoading || !endMarkerRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsLoading(true);
                    Promise.resolve(onLoadMore()).finally(() => {
                        setIsLoading(false);
                    });
                }
            },
            { rootMargin: `0px 0px ${threshold}px 0px` }
        );

        observer.observe(endMarkerRef.current);
        return () => observer.disconnect();
    }, [hasMore, isLoading, onLoadMore, threshold, disabled]);

    if (disabled) {
        return (
            <div ref={mergedRef} className={className} style={{ overflowY: "auto", ...style }}>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {items.map((item, i) => (
                        <li key={keyExtractor(item)}>{renderItem(item, i)}</li>
                    ))}
                </ul>
                {hasMore && <div ref={endMarkerRef}>{loader}</div>}
            </div>
        );
    }

    return (
        <div ref={mergedRef} className={className} style={{ ...style, position: "relative" }}>
            <AnimatedList
                items={items}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                enterFrom={enterFrom}
                stagger={stagger}
                physics={physics}
                layout={!isReducedMotion}
            />
            {hasMore && (
                <div ref={endMarkerRef} style={{ width: "100%", padding: "16px", display: "flex", justifyContent: "center" }}>
                    {loader || (
                        // Default simple loader if none provided
                        <div style={{ padding: "8px" }}>Loading more...</div>
                    )}
                </div>
            )}
        </div>
    );
}

export const InfiniteScroll = forwardRef(InfiniteScrollComponent) as <T>(
    props: InfiniteScrollProps<T> & { ref?: React.Ref<HTMLDivElement> }
) => React.ReactElement;
