import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../configs/firebase';
import { AppNotification, getNotifications, markAsDone } from '../services/notification';

export default function CaretakerNotificationsScreen() {
    const router = useRouter();

    // Generic Notifications State
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [loading, setLoading] = useState(true);

    const themeColor = '#a855f7'; // Purple for Caretaker

    useEffect(() => {
        if (!auth.currentUser) {
            setLoading(false);
            return;
        }

        const userId = auth.currentUser.uid;

        // Caretakers only fetch generic notifications (e.g. Activity Acknowledgements)
        const unsubscribeNotifs = getNotifications(userId, (fetchedNotifs) => {
            setNotifications(fetchedNotifs);
            setLoading(false);
        });

        return () => {
            unsubscribeNotifs();
        };
    }, []);

    const handleMarkAsDone = async (notif: AppNotification) => {
        try {
            // For Caretaker, we just clear the notification (no reply needed usually)
            await markAsDone(notif.id);
        } catch (error: any) {
            Alert.alert("Error", "Failed to mark as done.");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={themeColor} />
                    <Text style={[styles.backText, { color: themeColor }]}>Bumalik</Text>
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: themeColor }]}>Notifications</Text>
            </View>

            {/* Notification List */}
            <View style={styles.listContainer}>

                {/* Generic Notifications Section */}
                <View>
                    <Text style={styles.sectionTitle}>Recent Updates</Text>

                    {notifications.length === 0 && (
                        <View>
                            <Text style={styles.emptyText}>No new notifications.</Text>
                        </View>
                    )}

                    {notifications.map((notif) => (
                        <View key={notif.id} style={[styles.notificationCard, { backgroundColor: themeColor }]}>
                            <View style={styles.iconCircle}>
                                <Ionicons name="notifications-outline" size={30} color="#fff" />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.notificationTitle}>{notif.title}</Text>
                                <Text style={styles.notificationMessage}>{notif.message}</Text>
                            </View>

                            {/* Done Button */}
                            <TouchableOpacity onPress={() => handleMarkAsDone(notif)} style={styles.closeButton}>
                                <Ionicons name="checkmark-circle" size={28} color="#fff" />
                                <Text style={styles.doneText}>Dismiss</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        backgroundColor: '#fff',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    backText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    listContainer: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#64748b',
        marginBottom: 10,
        marginTop: 10,
    },
    notificationCard: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    iconCircle: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        width: 50,
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
        marginRight: 10,
    },
    notificationTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    notificationMessage: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
    },
    emptyText: {
        textAlign: 'center',
        color: '#94a3b8',
        fontStyle: 'italic',
        marginTop: 10,
        marginBottom: 20,
    },
    closeButton: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
    },
    doneText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    }
});
