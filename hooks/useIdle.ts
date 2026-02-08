
import { useCallback, useEffect, useRef, useState } from 'react';
import { PanResponder, PanResponderInstance } from 'react-native';

interface UseIdleOptions {
    timeout?: number; // Timeout in milliseconds
    onIdle?: () => void;
    onActive?: () => void;
}

export const useIdle = ({ timeout = 60000, onIdle, onActive }: UseIdleOptions) => {
    const [isIdle, setIsIdle] = useState(false);
    const isIdleRef = useRef(false); // Track ref for stable callbacks
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Keep latest callbacks in refs to avoid recreating resetTimer
    const onIdleRef = useRef(onIdle);
    const onActiveRef = useRef(onActive);

    useEffect(() => {
        onIdleRef.current = onIdle;
        onActiveRef.current = onActive;
    }, [onIdle, onActive]);

    const resetTimer = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        if (isIdleRef.current) {
            setIsIdle(false);
            isIdleRef.current = false;
            onActiveRef.current?.();
        }

        timerRef.current = setTimeout(() => {
            setIsIdle(true);
            isIdleRef.current = true;
            onIdleRef.current?.();
        }, timeout);
    }, [timeout]); // Only recreate if timeout changes

    const panResponder = useRef<PanResponderInstance>(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onStartShouldSetPanResponderCapture: () => {
                resetTimer();
                return false; // Let the touch pass through to child components
            },
            onMoveShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponderCapture: () => {
                resetTimer();
                return false; // Let the touch pass through
            },
            onPanResponderTerminationRequest: () => true,
            onShouldBlockNativeResponder: () => false,
        })
    ).current;

    useEffect(() => {
        resetTimer();
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [resetTimer]);

    return {
        isIdle,
        panResponder,
        resetTimer, // Expose resetTimer if manual reset is needed
    };
};
