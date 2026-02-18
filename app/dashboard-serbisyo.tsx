import { AdaptiveButton } from '@/components/AdaptiveButton';
import { useVoiceNavigation } from '@/hooks/useVoiceNavigation';
import { MockGovService } from '@/services/mockGovApi';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CopilotStep, walkthroughable } from 'react-native-copilot';

const WalkthroughableView = walkthroughable(View);

const FocusedCopilotStep = ({ active, children, ...props }: any) => {
    if (!active) return children;
    return <CopilotStep {...props}>{children}</CopilotStep>;
};

export default function SerbisyoDashboardScreen() {
    const router = useRouter();
    const isFocused = useIsFocused();
    const { isListening, isCommandActive, startListening, stopListening, manuallyTriggerActivation } = useVoiceNavigation();
    const [loading, setLoading] = useState(false);

    // Auto-start listening
    useEffect(() => {
        startListening();
        return () => { stopListening(); };
    }, []);
    const [loadingText, setLoadingText] = useState('');

    const handleServicePress = async (serviceName: string, serviceFn: () => Promise<any>, route: string) => {
        setLoading(true);
        setLoadingText(`Connecting to ${serviceName}...`);
        try {
            const data = await serviceFn();
            // Navigate with the fetched data
            router.push({ pathname: route as any, params: { data: JSON.stringify(data) } });
        } catch (error) {
            console.error(error);
            alert("Failed to connect to service.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <FocusedCopilotStep active={isFocused} text="Pindutin dito para bumalik." order={5} name="back-btn">
                        <WalkthroughableView style={{ alignSelf: 'flex-start' }} collapsable={false}>
                            <AdaptiveButton
                                style={styles.backButton}
                                onPress={() => router.back()}
                                autoWidth
                                missPadding={20}
                                maxScale={1.1}
                            >
                                <Ionicons name="arrow-back" size={24} color="#fff" />
                                <Text style={styles.backText}>Bumalik</Text>
                            </AdaptiveButton>
                        </WalkthroughableView>
                    </FocusedCopilotStep>
                    <Text style={styles.headerTitle}>Serbisyo ng Gobyerno</Text>
                    <Text style={styles.headerSubtitle}>Government Services</Text>
                </View>

                {/* Services List */}
                <View style={styles.listContainer}>

                    {/* SSS */}
                    <FocusedCopilotStep active={isFocused} text="Pindutin dito para sa impormasyon tungkol sa SSS." order={1} name="sss-btn">
                        <WalkthroughableView collapsable={false}>
                            <AdaptiveButton
                                style={styles.serviceCard}
                                onPress={() => handleServicePress('SSS', () => MockGovService.fetchSSSStatus('current-user'), '/sss-pension')}
                                missPadding={15}
                                maxScale={1.05}
                            >
                                <View style={styles.iconBox}>
                                    <Ionicons name="card-outline" size={24} color="#2563eb" />
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.serviceTitle}>SSS Pension</Text>
                                    <Text style={styles.serviceSubtitle}>Check pension status</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={24} color="#3b82f6" />
                            </AdaptiveButton>
                        </WalkthroughableView>
                    </FocusedCopilotStep>

                    {/* PhilHealth */}
                    <FocusedCopilotStep active={isFocused} text="Pindutin dito para sa impormasyon tungkol sa PhilHealth." order={2} name="philhealth-btn">
                        <WalkthroughableView collapsable={false}>
                            <AdaptiveButton
                                style={styles.serviceCard}
                                onPress={() => handleServicePress('PhilHealth', () => MockGovService.fetchPhilHealthStatus('current-user'), '/philhealth')}
                                missPadding={15}
                                maxScale={1.05}
                            >
                                <View style={styles.iconBox}>
                                    <Ionicons name="person" size={24} color="#2563eb" />
                                    <View style={styles.heartBadge}>
                                        <Ionicons name="heart" size={10} color="#fff" />
                                    </View>
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.serviceTitle}>PhilHealth</Text>
                                    <Text style={styles.serviceSubtitle}>Health insurance info</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={24} color="#3b82f6" />
                            </AdaptiveButton>
                        </WalkthroughableView>
                    </FocusedCopilotStep>

                    {/* DSWD */}
                    <FocusedCopilotStep active={isFocused} text="Pindutin dito para sa impormasyon tungkol sa DSWD." order={3} name="dswd-btn">
                        <WalkthroughableView collapsable={false}>
                            <AdaptiveButton
                                style={styles.serviceCard}
                                onPress={() => handleServicePress('DSWD', () => MockGovService.fetchDSWDStatus('current-user'), '/dswd')}
                                missPadding={15}
                                maxScale={1.05}
                            >
                                <View style={styles.iconBox}>
                                    <MaterialCommunityIcons name="hand-heart" size={24} color="#2563eb" />
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.serviceTitle}>DSWD Programs</Text>
                                    <Text style={styles.serviceSubtitle}>Social welfare services</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={24} color="#3b82f6" />
                            </AdaptiveButton>
                        </WalkthroughableView>
                    </FocusedCopilotStep>

                </View>

                {/* Footer Button */}
                <FocusedCopilotStep active={isFocused} text="Pindutin at magsalita para sa iba pang tulong." order={4} name="voice-command">
                    <WalkthroughableView collapsable={false}>
                        <AdaptiveButton
                            style={[
                                styles.footerButton,
                                isCommandActive && { backgroundColor: '#ef4444' },
                                (!isCommandActive && isListening) && { backgroundColor: '#3b82f6', opacity: 0.8 }
                            ]}
                            onPress={() => {
                                if (isCommandActive || isListening) {
                                    manuallyTriggerActivation();
                                } else {
                                    startListening().then(() => manuallyTriggerActivation());
                                }
                            }}
                            missPadding={20}
                            maxScale={1.05}
                        >
                            <Ionicons name={isCommandActive ? "mic" : "mic-outline"} size={28} color="#fff" style={{ marginRight: 10 }} />
                            <Text style={styles.footerButtonText}>
                                {isCommandActive ? 'Nakikinig...' : 'Magsalita'}
                            </Text>
                        </AdaptiveButton>
                    </WalkthroughableView>
                </FocusedCopilotStep>

            </ScrollView>

            {/* Loading Modal */}
            <Modal
                transparent={true}
                animationType="fade"
                visible={loading}
                onRequestClose={() => { }}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <ActivityIndicator size="large" color="#ffffff" />
                        <Text style={styles.loadingText}>{loadingText}</Text>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f0f9ff',
    },
    header: {
        backgroundColor: '#3b82f6',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 30,
        borderBottomLeftRadius: 0,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 26, // Slightly clearer
        fontWeight: 'bold',
    },
    headerSubtitle: {
        color: '#dbeafe',
        fontSize: 16,
        marginTop: 5,
    },
    listContainer: {
        padding: 20,
        marginTop: 20,
    },
    serviceCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#bfdbfe',
    },
    iconBox: {
        backgroundColor: '#dbeafe',
        width: 50,
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        position: 'relative',
    },
    heartBadge: {
        position: 'absolute',
        bottom: 12,
        right: 12,
    },
    textContainer: {
        flex: 1,
    },
    serviceTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e3a8a',
    },
    serviceSubtitle: {
        fontSize: 14,
        color: '#3b82f6',
    },
    footerButton: {
        backgroundColor: '#2563eb',
        margin: 20,
        marginTop: 10,
        padding: 18,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    footerButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    // Modal Styles
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#2563eb',
        padding: 30,
        borderRadius: 20,
        alignItems: 'center',
        elevation: 10,
    },
    loadingText: {
        color: '#fff',
        marginTop: 15,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
