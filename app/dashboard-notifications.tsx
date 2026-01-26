import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../configs/firebase';
import { ConnectionRequest, getConnectionRequests, respondToRequest } from '../services/connection';
import { AppNotification, getNotifications, markAsDone } from '../services/notification';

export default function NotificationsDashboardScreen() {
    const router = useRouter();
    const { role } = useLocalSearchParams();
    const isCaretaker = role === 'caretaker';

    // Connection Requests State
    const [requests, setRequests] = useState<ConnectionRequest[]>([]);
    // Generic Notifications State
    const [notifications, setNotifications] = useState<AppNotification[]>([]);

    const [loading, setLoading] = useState(true);

    const themeColor = isCaretaker ? '#a855f7' : '#3b82f6'; // Purple for Caretaker, Blue for Senior

    useEffect(() => {
        if (!auth.currentUser) {
            setLoading(false);
            return;
        }

        const userId = auth.currentUser.uid;

        // 1. Subscribe to Connection Requests (Only if Senior? Or both depending on future features)
        // Currently only Senior receives connection requests
        let unsubscribeRequests = () => { };
        if (!isCaretaker) {
            unsubscribeRequests = getConnectionRequests(userId, (fetchedRequests) => {
                setRequests(fetchedRequests);
            });
        }

        // 2. Subscribe to Generic Notifications (Both roles could receive these)
        const unsubscribeNotifs = getNotifications(userId, (fetchedNotifs) => {
            setNotifications(fetchedNotifs);
            setLoading(false);
        });

        return () => {
            unsubscribeRequests();
            unsubscribeNotifs();
        };
    }, [isCaretaker]);

    const handleConnectionResponse = async (request: ConnectionRequest, accept: boolean) => {
        try {
            await respondToRequest(request.id, accept, request.fromUserId, request.toUserId);
            Alert.alert("Success", accept ? "You are now connected!" : "Request declined.");
        } catch (error: any) {
            Alert.alert("Error", error.message);
        }
    };

    const handleMarkAsDone = async (notif: AppNotification) => {
        try {
            // If this notification has a sender (e.g. from Caretaker), and I am the Elder,
            // I should notify them back that I saw it.
            // Assumption: If I am Caretaker, I am just clearing my own alerts (like Acknowledgements).

            let replyToId = undefined;
            let replyMessage = undefined;

            if (!isCaretaker && notif.senderId) {
                replyToId = notif.senderId;
                replyMessage = `Elder has seen/completed: ${notif.title}`;
            }

            await markAsDone(notif.id, replyToId, replyMessage);
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
                <Text style={[styles.headerTitle, { color: themeColor }]}>Notification</Text>
            </View>

            {/* Notification List */}
            <View style={styles.listContainer}>

                {/* Connection Requests Section */}
                {!isCaretaker && requests.length > 0 && (
                    <View style={{ marginBottom: 20 }}>
                        <Text style={styles.sectionTitle}>Connection Requests</Text>
                        {requests.map((request) => (
                            <View key={request.id} style={[styles.notificationCard, { backgroundColor: '#fff', borderLeftWidth: 5, borderLeftColor: themeColor }]}>
                                <View style={[styles.iconCircle, { backgroundColor: themeColor }]}>
                                    <Ionicons name="person-add" size={24} color="#fff" />
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={[styles.notificationTitle, { color: '#000' }]}>
                                        <Text style={{ fontWeight: 'bold', color: themeColor }}>{request.caretakerName}</Text> wants to connect with you.
                                    </Text>
                                    <View style={styles.actionButtons}>
                                        <TouchableOpacity
                                            style={[styles.actionButton, { backgroundColor: '#ef4444' }]}
                                            onPress={() => handleConnectionResponse(request, false)}
                                        >
                                            <Text style={styles.actionButtonText}>Decline</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.actionButton, { backgroundColor: '#22c55e' }]}
                                            onPress={() => handleConnectionResponse(request, true)}
                                        >
                                            <Text style={styles.actionButtonText}>Accept</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* Generic Notifications Section */}
                <View>
                    <Text style={styles.sectionTitle}>Recent Activity</Text>

                    {notifications.length === 0 && (
                        <Text style={styles.emptyText}>No new notifications.</Text>
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

                            {/* Done Button (X or Check) */}
                            <TouchableOpacity onPress={() => handleMarkAsDone(notif)} style={styles.closeButton}>
                                <Ionicons name="checkmark-circle" size={28} color="#fff" />
                                <Text style={styles.doneText}>Done</Text>
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
    actionButtons: {
        flexDirection: 'row',
        marginTop: 10,
        gap: 10,
    },
    actionButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 10,
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
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
