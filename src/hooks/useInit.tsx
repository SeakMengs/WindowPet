// credit: https://github.com/lencx/ChatGPT/blob/main/src/hooks/useInit.ts
import { useRef, useEffect } from 'react';

export default function useInit(callback: () => void) {
    const isInit = useRef(true);
    useEffect(() => {
        if (isInit.current) {
            callback();
            isInit.current = false;
        }
    });
}