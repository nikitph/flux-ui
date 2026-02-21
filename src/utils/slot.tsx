import React, { forwardRef } from "react";

export const Slot = forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }>(
    ({ children, ...props }, ref) => {
        if (React.isValidElement(children)) {
            return React.cloneElement(children, {
                ...props,
                ...(children.props as any),
                ref: (node: any) => {
                    if (typeof ref === "function") ref(node);
                    else if (ref) (ref as any).current = node;

                    const childRef = (children as any).ref;
                    if (typeof childRef === "function") childRef(node);
                    else if (childRef) childRef.current = node;
                },
                style: {
                    ...props.style,
                    ...(children.props as any).style,
                },
                className: [props.className, (children.props as any).className].filter(Boolean).join(" "),
            } as any);
        }
        return <>{children}</>;
    }
);
Slot.displayName = "Slot";
