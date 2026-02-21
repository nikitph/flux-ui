import { useInView as useFramerInView, UseInViewOptions } from "motion/react";
import { RefObject } from "react";

export function useInView(ref: RefObject<Element | null>, options?: UseInViewOptions) {
    return useFramerInView(ref, options);
}
