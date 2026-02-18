import { useRouter } from 'expo-router';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
import { useState } from 'react';

interface VoiceNavigationOptions {
    onCustomCommand?: (command: string) => boolean | void;
}

export const useVoiceNavigation = (options?: VoiceNavigationOptions) => {
    const router = useRouter();
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isCommandActive, setIsCommandActive] = useState(false);

    useSpeechRecognitionEvent('start', () => setIsListening(true));
    useSpeechRecognitionEvent('end', () => setIsListening(false));
    useSpeechRecognitionEvent('result', (event) => {
        const text = event.results[0]?.transcript;
        if (text) {
            setTranscript(text);
            processStream(text);
        }
    });
    useSpeechRecognitionEvent('error', (event) => {
        console.log('Speech error:', event.error, event.message);
        setIsListening(false);
    });

    const startListening = async () => {
        try {
            const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
            if (!result.granted) {
                console.warn("Permissions not granted", result);
                return;
            }
            ExpoSpeechRecognitionModule.start({
                lang: 'fil-PH',
                interimResults: true,
                maxAlternatives: 1,
                continuous: true,
            });
        } catch (e) {
            console.error("Failed to start listening:", e);
        }
    };

    const stopListening = async () => {
        try {
            ExpoSpeechRecognitionModule.stop();
            setIsCommandActive(false);
        } catch (e) {
            console.error("Failed to stop:", e);
        }
    };

    const processStream = (text: string) => {
        const lowerText = text.toLowerCase();

        if (!isCommandActive) {
            if (lowerText.includes('voice') || lowerText.includes('mic') || lowerText.includes('on') || lowerText.includes('open') || lowerText.includes('hello')) {
                setIsCommandActive(true);
                // Auto-reset after 5 seconds
                setTimeout(() => setIsCommandActive(false), 5000);
            }
            return;
        }

        if (isCommandActive) {
            processCommand(lowerText);
        }
    };

    const processCommand = (lowerCommand: string) => {
        // 0. Check for custom command handler (e.g. for Calling in Pamilya)
        if (options?.onCustomCommand) {
            const handled = options.onCustomCommand(lowerCommand);
            if (handled) {
                resetState();
                return;
            }
        }

        // Check for keywords and navigate
        if (lowerCommand.includes('kalusugan')) {
            router.push('/dashboard-kalusugan');
            resetState();
        } else if (lowerCommand.includes('serbisyo')) {
            router.push('/dashboard-serbisyo');
            resetState();
        } else if (lowerCommand.includes('pamilya')) {
            router.push('/dashboard-pamilya');
            resetState();
        } else if (lowerCommand.includes('gamot') || lowerCommand.includes('medication')) {
            router.push('/dashboard-mga-gamot');
            resetState();
        } else if (lowerCommand.includes('presyon') || lowerCommand.includes('sugar') || lowerCommand.includes('blood')) {
            router.push('/dashboard-presyon');
            resetState();
        } else if (lowerCommand.includes('appointment') || lowerCommand.includes('doktor') || lowerCommand.includes('doctor')) {
            router.push('/dashboard-appointment');
            resetState();
        } else if (lowerCommand.includes('sss') || lowerCommand.includes('pension')) {
            router.push('/sss-pension');
            resetState();
        } else if (lowerCommand.includes('philhealth') || lowerCommand.includes('insurance')) {
            router.push('/philhealth');
            resetState();
        } else if (lowerCommand.includes('dswd') || lowerCommand.includes('welfare')) {
            router.push('/dswd');
            resetState();
        } else if (lowerCommand.includes('emergency') || lowerCommand.includes('tulong') || lowerCommand.includes('911')) {
            router.push('/dashboard-pamilya');
            resetState();
        } else if (lowerCommand.includes('dagdag') || lowerCommand.includes('add member') || lowerCommand.includes('miyembro')) {
            router.push('/dashboard-pamilya');
            resetState();
        } else if (lowerCommand.includes('setting') || lowerCommand.includes('seting')) {
            router.push('/dashboard-settings');
            resetState();
        }
    };

    const resetState = () => {
        setIsCommandActive(false);
    }

    const manuallyTriggerActivation = () => {
        setIsCommandActive(true);
        // Auto-reset after 5 seconds if no command
        setTimeout(() => setIsCommandActive(false), 5000);
    };

    return {
        isListening,
        isCommandActive,
        transcript,
        startListening,
        stopListening,
        manuallyTriggerActivation, // Export this
    };
};
