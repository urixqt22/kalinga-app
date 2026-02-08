import { AdaptiveButton } from '@/components/AdaptiveButton';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CopilotStep, walkthroughable } from 'react-native-copilot';
import { auth, db } from '../configs/firebase';
import { logoutUser } from '../services/auth';
import { getNotifications } from '../services/notification';

import { useSettings } from '../contexts/SettingsContext';

const WalkthroughableView = walkthroughable(View);
const WalkthroughableTouchableOpacity = walkthroughable(TouchableOpacity);

const FocusedCopilotStep = ({ active, children, ...props }: any) => {
    if (!active) return children;
    return <CopilotStep {...props}>{children}</CopilotStep>;
};

export default function DashboardSeniorScreen() {
    const router = useRouter();
    const isFocused = useIsFocused();
    const { getFontSize } = useSettings();
    const [userName, setUserName] = useState('');
    const [hasNotifications, setHasNotifications] = useState(false);

    useEffect(() => {
        const fetchUserName = async () => {
            if (auth.currentUser) {
                const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
                if (userDoc.exists()) {
                    setUserName(userDoc.data().name);
                }

                // Fetch notifications to check for badge
                const unsubscribe = getNotifications(auth.currentUser.uid, (notifs) => {
                    setHasNotifications(notifs.length > 0);
                });
                return () => unsubscribe();
            }
        };
        fetchUserName();
    }, []);

    const handleLogout = async () => {
        await logoutUser();
        router.replace('/');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <FocusedCopilotStep active={isFocused} text="Pindutin dito para mag-logout sa iyong account." order={6} name="logout-btn">
                    <WalkthroughableView style={{ alignSelf: 'flex-start' }}>
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
                    <WalkthroughableTouchableOpacity
                        style={styles.notificationContainer}
                        onPress={() => router.push('/dashboard-notifications-senior')}
                    >
                        <Ionicons name="notifications" size={30} color="#2563eb" />
                        {hasNotifications && <View style={styles.notificationBadge} />}
                    </WalkthroughableTouchableOpacity>
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
                    <WalkthroughableView style={{ width: '95%', alignSelf: 'center' }}>
                        <AdaptiveButton
                            style={styles.menuButton}
                            onPress={() => router.push('/dashboard-kalusugan')}
                            missPadding={15}
                            maxScale={1.05}
                        >
                            <View style={styles.menuIconCircle}>
                                <Ionicons name="heart-outline" size={30} color="#fff" />
                            </View>
                            <Text style={[styles.menuText, { fontSize: getFontSize(18) }]}>Kalusugan</Text>
                            <Ionicons name="chevron-forward" size={24} color="#fff" />
                        </AdaptiveButton>
                    </WalkthroughableView>
                </FocusedCopilotStep>

                <FocusedCopilotStep active={isFocused} text="Pindutin dito para ma-access ang mga serbisyo ng gobyerno." order={2} name="services">
                    <WalkthroughableView style={{ width: '95%', alignSelf: 'center' }}>
                        <AdaptiveButton
                            style={styles.menuButton}
                            onPress={() => router.push('/dashboard-serbisyo')}
                            missPadding={15}
                            maxScale={1.05}
                        >
                            <View style={styles.menuIconCircle}>
                                <Ionicons name="newspaper-outline" size={30} color="#fff" />
                            </View>
                            <Text style={[styles.menuText, { fontSize: getFontSize(18) }]}>Serbisyo ng Gobyerno</Text>
                            <Ionicons name="chevron-forward" size={24} color="#fff" />
                        </AdaptiveButton>
                    </WalkthroughableView>
                </FocusedCopilotStep>

                <FocusedCopilotStep active={isFocused} text="Pindutin dito para makausap ang iyong pamilya." order={3} name="family">
                    <WalkthroughableView style={{ width: '95%', alignSelf: 'center' }}>
                        <AdaptiveButton
                            style={styles.menuButton}
                            onPress={() => router.push('/dashboard-pamilya')}
                            missPadding={15}
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
                    <WalkthroughableView>
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
                    <WalkthroughableView>
                        <TouchableOpacity style={styles.micButton}>
                            <Ionicons name="mic" size={32} color="#fff" />
                        </TouchableOpacity>
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
        paddingTop: 60,
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
        width: '95%',
        alignSelf: 'center',
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
    },
    settingsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#3b82f6',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 20,
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
        borderRadius: 20,
        backgroundColor: '#2563eb',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
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
