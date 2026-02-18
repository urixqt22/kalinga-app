import { AdaptiveButton } from '@/components/AdaptiveButton';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CopilotStep, walkthroughable } from 'react-native-copilot';
import { auth } from '../configs/firebase';
import { logoutUser } from '../services/auth';

import { useSettings } from '../contexts/SettingsContext';

const WalkthroughableView = walkthroughable(View);
const WalkthroughableTouchableOpacity = walkthroughable(TouchableOpacity);

const FocusedCopilotStep = ({ active, children, ...props }: any) => {
    if (!active) return children;
    return <CopilotStep {...props}>{children}</CopilotStep>;
};

import { useVoiceNavigation } from '@/hooks/useVoiceNavigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DashboardSeniorScreen() {
    const router = useRouter();
    const isFocused = useIsFocused();
    const { getFontSize } = useSettings();
    const insets = useSafeAreaInsets();
    const { isListening, isCommandActive, startListening, stopListening, manuallyTriggerActivation } = useVoiceNavigation();

    // Auto-start listening on mount (optional, but good for "always on")
    useEffect(() => {
        startListening();
        return () => {
            stopListening();
        };
    }, []);
    const [userName, setUserName] = useState('');
    const [hasNotifications, setHasNotifications] = useState(false);

    // ... (useEffect remains same) ...

    const handleLogout = async () => {
        await logoutUser();
        router.replace('/');
    };

    return (
        <ScrollView contentContainerStyle={[styles.container, { paddingTop: Math.max(insets.top, 20) + 20 }]}>
            {/* Header */}
            <View style={styles.header}>
                <FocusedCopilotStep active={isFocused} text="Pindutin dito para mag-logout sa iyong account." order={6} name="logout-btn">
                    <WalkthroughableView style={{ alignSelf: 'flex-start', flexShrink: 1, maxWidth: '85%' }} collapsable={false}>
                        <AdaptiveButton
                            style={styles.logoutButton}
                            onPress={handleLogout}
                            autoWidth
                            missPadding={20}
                            maxScale={1.1}
                        >
                            <Ionicons name="log-out-outline" size={20} color="#2563eb" />
                            <Text style={[styles.logoutText, { fontSize: getFontSize(14) }]}>Logout</Text>
                        </AdaptiveButton>
                    </WalkthroughableView>
                </FocusedCopilotStep>
                <FocusedCopilotStep active={isFocused} text="Tingnan ang iyong mga abiso (notifications) dito." order={4} name="notifications">
                    <WalkthroughableView
                        style={styles.notificationContainer}
                        collapsable={false}
                    >
                        <TouchableOpacity onPress={() => router.push('/dashboard-notifications-senior')}>
                            <Ionicons name="notifications" size={30} color="#2563eb" />
                            {hasNotifications && <View style={styles.notificationBadge} />}
                        </TouchableOpacity>
                    </WalkthroughableView>
                </FocusedCopilotStep>
            </View>

            {/* Profile Section */}
            <View style={styles.profileSection}>
                <View style={styles.logoCircle}>
                    <Ionicons name="heart" size={50} color="#fff" />
                    <View style={styles.smileIcon}>
                        <Ionicons name="happy" size={24} color="#2563eb" />
                    </View>
                </View>
                <Text style={[styles.appName, { fontSize: getFontSize(22) }]}>KALINGA</Text>
                <Text style={[styles.greeting, { fontSize: getFontSize(14) }]}>Mabuhay, {userName || 'Senior'}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: getFontSize(12), marginTop: 2 }} selectable>ID: {auth.currentUser?.uid}</Text>
            </View>

            {/* Menu Buttons */}
            <View style={styles.menuContainer}>
                <FocusedCopilotStep active={isFocused} text="Pindutin dito para makita ang iyong datos sa kalusugan." order={1} name="health">
                    <WalkthroughableView style={{ width: '95%', alignSelf: 'center' }} collapsable={false}>
                        <AdaptiveButton
                            style={styles.menuButton}
                            onPress={() => router.push('/dashboard-kalusugan')}
                            missPadding={20} // Disable extra padding to fix walkthrough highlight
                            maxScale={1.05}
                        >
                            <View style={[styles.menuIconCircle, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
                                <Ionicons name="heart-outline" size={24} color="#fff" />
                            </View>
                            <Text style={[styles.menuText, { fontSize: getFontSize(18) }]}>Kalusugan</Text>
                            <Ionicons name="chevron-forward" size={24} color="#fff" />
                        </AdaptiveButton>
                    </WalkthroughableView>
                </FocusedCopilotStep>

                <FocusedCopilotStep active={isFocused} text="Dito mo makikita ang mga serbisyo ng gobyerno." order={2} name="services">
                    <WalkthroughableView style={{ width: '95%', alignSelf: 'center' }} collapsable={false}>
                        <AdaptiveButton
                            style={styles.menuButton}
                            onPress={() => router.push('/dashboard-serbisyo')}
                            missPadding={20} // Disable extra padding
                            maxScale={1.05}
                        >
                            <View style={[styles.menuIconCircle, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
                                <Ionicons name="newspaper-outline" size={24} color="#fff" />
                            </View>
                            <Text style={[styles.menuText, { fontSize: getFontSize(16), maxWidth: '80%' }]} numberOfLines={1} adjustsFontSizeToFit>Serbisyo ng Gobyerno</Text>
                            <Ionicons name="chevron-forward" size={24} color="#fff" />
                        </AdaptiveButton>
                    </WalkthroughableView>
                </FocusedCopilotStep>

                <FocusedCopilotStep active={isFocused} text="Pindutin ito para sa mga feature ng pamilya." order={3} name="family">
                    <WalkthroughableView style={{ width: '95%', alignSelf: 'center' }} collapsable={false}>
                        <AdaptiveButton
                            style={styles.menuButton}
                            onPress={() => router.push('/dashboard-pamilya')}
                            maxScale={1.05}
                        >
                            <View style={styles.menuIconCircle}>
                                <Ionicons name="people-outline" size={30} color="#fff" />
                            </View>
                            <Text style={[styles.menuText, { fontSize: getFontSize(18) }]}>Pamilya</Text>
                            <Ionicons name="chevron-forward" size={24} color="#fff" />
                        </AdaptiveButton>
                    </WalkthroughableView>
                </FocusedCopilotStep>
            </View>


            {/* Footer Controls */}
            <View style={styles.footerControls}>
                <FocusedCopilotStep active={isFocused} text="Pindutin dito para baguhin ang iyong mga settings." order={5} name="settings">
                    <WalkthroughableView style={{ flexShrink: 1, maxWidth: '75%', justifyContent: 'center' }} collapsable={false}>
                        {/* Settings button is autoWidth, so we don't need fixed width on wrapper, just let it wrap content */}
                        <AdaptiveButton
                            style={styles.settingsButton}
                            onPress={() => router.push('/dashboard-settings')}
                            autoWidth
                            missPadding={20}
                            maxScale={1.1}
                        >
                            <Ionicons name="settings-outline" size={24} color="#2563eb" />
                            <Text style={styles.settingsText}>Settings</Text>
                        </AdaptiveButton>
                    </WalkthroughableView>
                </FocusedCopilotStep>

                <FocusedCopilotStep active={isFocused} text="Pindutin at magsalita para sa iba pang tulong." order={7} name="voice-btn">
                    <WalkthroughableView collapsable={false}>
                        <AdaptiveButton
                            style={[
                                styles.micButton,
                                isCommandActive && { backgroundColor: '#ef4444' },
                                (!isCommandActive && isListening) && { backgroundColor: '#3b82f6', opacity: 0.8 }
                            ]}
                            onPress={() => {
                                if (isCommandActive) {
                                    manuallyTriggerActivation(); // Reset timer/keep active
                                } else if (isListening) {
                                    manuallyTriggerActivation(); // Manual Trigger
                                } else {
                                    startListening().then(() => manuallyTriggerActivation());
                                }
                            }}
                            missPadding={15}
                            maxScale={1.1}
                            autoWidth
                        >
                            <Ionicons name={isCommandActive ? "mic" : "mic-outline"} size={32} color="#fff" />
                        </AdaptiveButton>
                    </WalkthroughableView>
                </FocusedCopilotStep>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        padding: 20,
        // paddingTop: 60, // Handled dynamically via inline style
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eff6ff',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
    },
    logoutText: {
        color: '#2563eb',
        fontWeight: 'bold',
        marginLeft: 5,
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#2563eb',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    smileIcon: {
        position: 'absolute',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 2,
        bottom: 0,
        right: 0,
    },
    appName: {
        fontSize: 22,
        fontWeight: '900',
        color: '#1e3a8a', // Darker blue
        letterSpacing: 1,
    },
    greeting: {
        fontSize: 14,
        color: '#3b82f6',
    },
    menuContainer: {
        gap: 30,
        marginBottom: 40,
    },
    menuButton: {
        backgroundColor: '#3b82f6', // Bright blue
        width: '100%', // Changed from 95% to 100% to fill the wrapper
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 20,
        elevation: 3,
    },
    menuIconCircle: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        width: 50,
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    menuText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    footerControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'auto', // Push to bottom
        paddingBottom: 20, // Add specific padding for the footer
        gap: 10, // Ensure some spacing between elements
    },
    settingsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#3b82f6',
        paddingVertical: 12,
        paddingHorizontal: 20, // Reduced from 40 for better fit on small screens
        borderRadius: 20,
        flexShrink: 1, // Allow shrinking if needed
    },
    settingsText: {
        color: '#2563eb',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    micButton: {
        width: 60,
        height: 60,
        borderRadius: 30, // Fully round
        backgroundColor: '#2563eb',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        flexShrink: 0, // Prevent mic button from shrinking
    },
    notificationContainer: {
        position: 'relative',
        padding: 5,
    },
    notificationBadge: {
        position: 'absolute',
        top: 5,
        right: 5,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#ef4444', // Red
        borderWidth: 1.5,
        borderColor: '#fff',
    },
});
