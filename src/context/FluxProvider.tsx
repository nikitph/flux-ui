import { createContext, useContext, ReactNode } from "react";

export type MotionLevel = "full" | "reduced" | "none";

interface FluxContextProps {
    motionLevel?: MotionLevel;
}

const FluxContext = createContext<FluxContextProps>({});

export function FluxProvider({
    children,
    motionLevel,
}: {
    children: ReactNode;
    motionLevel?: MotionLevel;
}) {
    return (
        <FluxContext.Provider value={{ motionLevel }}>
            {children}
        </FluxContext.Provider>
    );
}

export function useFluxContext() {
    return useContext(FluxContext);
}
