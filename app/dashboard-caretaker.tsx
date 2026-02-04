import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../configs/firebase';
import { logoutUser } from '../services/auth';
import { getNotifications } from '../services/notification';

export default function DashboardCaretakerScreen() {
    const router = useRouter();
    const [userName, setUserName] = useState('');
    const [hasNotifications, setHasNotifications] = useState(false);

    useEffect(() => {
        const fetchUserName = async () => {
            if (auth.currentUser) {
                const docRef = doc(db, "users", auth.currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserName(docSnap.data().name || "Caretaker");
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
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={20} color="#a855f7" />
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                    <View style={styles.headerRight}>
                        <TouchableOpacity onPress={() => router.push('/dashboard-notifications-caretaker')}>
                            <Ionicons name="notifications" size={30} color="#a855f7" />
                            {/* Notification Dot Indicator */}
                            {hasNotifications && <View style={styles.notificationBadge} />}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Profile Section */}
                <View style={styles.profileSection}>
                    <View style={styles.avatarCircle}>
                        <Ionicons name="heart" size={50} color="#fff" />
                        <View style={styles.iconBadge}>
                            <Ionicons name="person" size={24} color="#a855f7" />
                        </View>
                    </View>
                    <Text style={styles.appName}>KALINGA</Text>
                    <Text style={styles.roleTitle}>Mabuhay, {userName || "Caretaker"}</Text>
                    {/* <Text style={styles.monitoringText}>Monitoring Patients</Text> */}
                </View>

                {/* Status Card */}
                <View style={[styles.card, styles.statusCard]}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="notifications-outline" size={30} color="#fff" />
                    </View>
                    <View>
                        <Text style={styles.cardTitleWhite}>All Good!</Text>
                        <Text style={styles.cardSubtitleWhite}>No alerts or missed medications</Text>
                    </View>
                </View>

                {/* My Elder Card - UPDATED */}
                <TouchableOpacity style={[styles.card, { backgroundColor: '#e879f9' }]} onPress={() => router.push('/caretaker-elder')}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="person-outline" size={30} color="#fff" />
                    </View>
                    <View>
                        <Text style={styles.cardTitleWhite}>My Elder</Text>
                        <Text style={styles.cardSubtitleWhite}>Manage connection</Text>
                    </View>
                </TouchableOpacity>

                {/* Health Monitor */}
                <TouchableOpacity style={[styles.card, styles.healthCard]} onPress={() => router.push('/dashboard-health-monitor')}>
                    <View style={styles.purpleIconBox}>
                        <Ionicons name="pulse" size={30} color="#fff" />
                    </View>
                    <View>
                        <Text style={styles.cardTitleWhite}>Health Monitor</Text>
                        <Text style={styles.cardSubtitleWhite}>View vitals & Medications</Text>
                    </View>
                </TouchableOpacity>

                {/* Family Contacts */}
                <TouchableOpacity style={[styles.card, styles.familyCard]} onPress={() => router.push({ pathname: '/dashboard-pamilya', params: { role: 'caretaker' } })}>
                    <View style={styles.purpleIconBox}>
                        <Ionicons name="people" size={30} color="#fff" />
                    </View>
                    <View>
                        <Text style={styles.cardTitleWhite}>Family Contacts</Text>
                        <Text style={styles.cardSubtitleWhite}>Communicate with family</Text>
                    </View>
                </TouchableOpacity>

                {/* Settings */}
                <TouchableOpacity style={styles.settingsButton} onPress={() => router.push({ pathname: '/dashboard-settings', params: { role: 'caretaker' } })}>
                    <Ionicons name="settings-outline" size={24} color="#a855f7" />
                    <Text style={styles.settingsText}>Settings</Text>
                </TouchableOpacity>

                {/* Footer Banner */}
                <View style={styles.footerBanner}>
                    <Text style={styles.footerBannerText}>
                        <Text style={{ fontWeight: 'bold' }}>Caretaker Mode:</Text> Government services are managed by the senior
                    </Text>
                </View>

            </ScrollView>
        </View>
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
        marginBottom: 20,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3e8ff', // Light purple
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
    },
    logoutText: {
        color: '#a855f7',
        fontWeight: 'bold',
        marginLeft: 5,
    },
    headerRight: {},
    profileSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatarCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#a855f7',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    iconBadge: {
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
        color: '#a855f7', // Matching the purple theme
        letterSpacing: 1,
    },
    roleTitle: {
        fontSize: 16, // Reduced slightly to match "Mabuhay" subtitle style
        // fontWeight: 'bold', 
        color: '#a855f7',
    },
    monitoringText: {
        fontSize: 14,
        color: '#a855f7',
        opacity: 0.8,
    },
    card: {
        padding: 20,
        borderRadius: 20,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        height: 100,
    },
    statusCard: {
        backgroundColor: '#4ade80', // Green
    },
    healthCard: {
        backgroundColor: '#a855f7',
    },
    familyCard: {
        backgroundColor: '#a855f7', // Lighter purple
    },
    iconCircle: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    purpleIconBox: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        width: 50,
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    cardTitleWhite: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardSubtitleWhite: {
        color: '#fff',
        fontSize: 12,
        opacity: 0.9,
    },
    settingsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#a855f7',
        paddingVertical: 15,
        borderRadius: 15,
        marginBottom: 15,
    },
    settingsText: {
        color: '#a855f7',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    footerBanner: {
        backgroundColor: '#f3e8ff',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
    },
    footerBannerText: {
        color: '#a855f7',
        fontSize: 12,
        textAlign: 'center',
    },
    notificationBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#ef4444', // Red dot
        borderWidth: 2,
        borderColor: '#fff',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 25,
        width: '100%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#a855f7',
        marginBottom: 10,
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: 20,
    },
    inputLabel: {
        alignSelf: 'flex-start',
        fontSize: 14,
        fontWeight: 'bold',
        color: '#374151',
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#f3f4f6',
        width: '100%',
        padding: 15,
        borderRadius: 12,
        marginBottom: 25,
        fontSize: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 15,
        width: '100%',
    },
    button: {
        flex: 1,
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: '#f3f4f6',
    },
    cancelButtonText: {
        color: '#374151',
        fontWeight: 'bold',
    },
    sendButton: {
        backgroundColor: '#a855f7',
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
