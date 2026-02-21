import { useRef, useEffect, Ref } from "react";

export function useMergedRef<T>(...refs: Array<Ref<T> | null | undefined>) {
    const targetRef = useRef<T>(null);

    useEffect(() => {
        refs.forEach((ref) => {
            if (!ref) return;
            if (typeof ref === "function") {
                ref(targetRef.current);
            } else {
                (ref as React.MutableRefObject<T | null>).current = targetRef.current;
            }
        });
    }, [refs]);

    return targetRef;
}
