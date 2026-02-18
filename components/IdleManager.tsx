
import { useIdle } from '@/hooks/useIdle';
import { usePathname } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useCopilot } from 'react-native-copilot';

export const IdleManager = ({ children }: { children: React.ReactNode }) => {
    const { start, stop, copilotEvents } = useCopilot();
    const pathname = usePathname();

    useEffect(() => {
        const handleStepChange = (step: any) => {
            console.log('Copilot: Step changed to', step);
        };
        const handleStart = () => {
            console.log('Copilot: Tutorial started');
        };
        const handleStop = () => {
            console.log('Copilot: Tutorial stopped');
        };

        copilotEvents.on('stepChange', handleStepChange);
        copilotEvents.on('start', handleStart);
        copilotEvents.on('stop', handleStop);

        return () => {
            copilotEvents.off('stepChange', handleStepChange);
            copilotEvents.off('start', handleStart);
            copilotEvents.off('stop', handleStop);
        };
    }, [copilotEvents]);

    // Only enable on specific screens for now
    // Loose check for pathname to handle potential query params or segments
    const isTargetScreen = pathname.includes('welcome-senior') || pathname.includes('dashboard-senior') || pathname.includes('dashboard-kalusugan') || pathname.includes('dashboard-mga-gamot') || pathname.includes('dashboard-presyon') || pathname.includes('dashboard-appointment') || pathname.includes('dashboard-serbisyo') || pathname.includes('dashboard-notifications-senior') || pathname.includes('dashboard-pamilya');

    const { isIdle, panResponder, resetTimer } = useIdle({
        timeout: 60000,
        onIdle: () => {
            console.log('IdleManager: User is idle on:', pathname);
            console.log('IdleManager: isTargetScreen:', isTargetScreen);

            if (isTargetScreen) {
                console.log('IdleManager: Starting Copilot...');
                start();
            } else {
                console.log('IdleManager: Not starting Copilot (not target screen)');
            }
        },
        onActive: () => {
            console.log('User is active');
            // Optional: stop copilot on interaction? 
            // ensuring we don't stop if they are interacting with the copilot itself is tricky without more state
            // For now, let's rely on the dismiss button in the tooltip.
        },
    });

    // Reset timer on route change
    // Reset timer on route change
    useEffect(() => {
        resetTimer();
        stop(); // Stop any active tutorial when changing screens
    }, [pathname]); // resetTimer and stop are stable enough or shouldn't trigger this logic unless pathname changes

    return (
        <View style={styles.container} {...panResponder.panHandlers}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
