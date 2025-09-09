import { useEffect, useState } from "react";
import { CardSize } from "@/lib/cardSizes";

export function useCardSize(propSize?: CardSize) {
    const [size, setSize] = useState<CardSize>("small");

    useEffect(() => {
        if (propSize) {
            setSize(propSize);
            return;
        }

        const updateSize = () => {
            const width = window.innerWidth;
            if (width < 359) setSize("extraSmall");
            else if (width < 640) setSize("small");
            else if (width < 1024) setSize("medium");
            else setSize("large");
        };

        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, [propSize]);

    return size;
}
