
import React from 'react';
import { Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useCopilot } from 'react-native-copilot';

import * as Speech from 'expo-speech';

const ContextualHelpTooltip = ({ labels }: any) => {
    const { goToNext, stop, currentStep, isLastStep } = useCopilot();

    const [selectedVoice, setSelectedVoice] = React.useState<string | null>(null);

    React.useEffect(() => {
        const initVoice = async () => {
            try {
                const voices = await Speech.getAvailableVoicesAsync();
                // Look for Filipino/Tagalog voices
                const tagalogVoice = voices.find(v =>
                    v.language.includes('fil') ||
                    v.language.includes('tl') ||
                    v.identifier.toLowerCase().includes('fil') ||
                    v.identifier.toLowerCase().includes('pinoy')
                );

                if (tagalogVoice) {
                    setSelectedVoice(tagalogVoice.identifier);
                }
            } catch (e) {
                console.warn('Failed to get voices', e);
            }
        };
        initVoice();
    }, []);

    React.useEffect(() => {
        if (currentStep?.text) {
            Speech.stop();
            const options: Speech.SpeechOptions = { language: 'tl' };
            if (selectedVoice) {
                options.voice = selectedVoice;
            }
            Speech.speak(currentStep.text, options);
        }
        return () => {
            Speech.stop();
        };
    }, [currentStep, selectedVoice]);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.stepNumber}>
                    Step {currentStep?.order}
                </Text>
                <Text style={styles.description}>
                    {currentStep?.text}
                </Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={stop} style={styles.dismissButton}>
                    <Text style={styles.dismissButtonText}>{labels.skip || "Dismiss"}</Text>
                </TouchableOpacity>

                {!isLastStep ? (
                    <TouchableOpacity onPress={goToNext} style={styles.nextButton}>
                        <Text style={styles.nextButtonText}>{labels.next || "Next"}</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={stop} style={styles.finishButton}>
                        <Text style={styles.finishButtonText}>{labels.finish || "Finish"}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = {
    container: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        width: '100%',
        maxWidth: 350,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10,
    } as ViewStyle,
    content: {
        marginBottom: 20,
    } as ViewStyle,
    stepNumber: {
        fontSize: 14,
        color: '#666',
        fontWeight: '600' as '600',
        marginBottom: 8,
        textTransform: 'uppercase' as 'uppercase',
    } as TextStyle,
    description: {
        fontSize: 22, // Large font for seniors
        fontWeight: '700' as '700',
        color: '#333',
        lineHeight: 30,
    } as TextStyle,
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    } as ViewStyle,
    dismissButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
    } as ViewStyle,
    dismissButtonText: {
        fontSize: 18,
        color: '#666',
        fontWeight: '600' as '600',
    } as TextStyle,
    nextButton: {
        backgroundColor: '#007AFF', // Primary color
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 50,
    } as ViewStyle,
    nextButtonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold' as 'bold',
    } as TextStyle,
    finishButton: {
        backgroundColor: '#4CD964', // Success color
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 50,
    } as ViewStyle,
    finishButtonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold' as 'bold',
    } as TextStyle,
};

export default ContextualHelpTooltip;
