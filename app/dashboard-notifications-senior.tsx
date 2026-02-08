import { AdaptiveButton } from '@/components/AdaptiveButton';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CopilotStep, walkthroughable } from 'react-native-copilot';
import { auth } from '../configs/firebase';
import { ConnectionRequest, getConnectionRequests, respondToRequest } from '../services/connection';
import { AppNotification, getNotifications, markAsDone } from '../services/notification';

const WalkthroughableView = walkthroughable(View);

const FocusedCopilotStep = ({ active, children, ...props }: any) => {
    if (!active) return children;
    return <CopilotStep {...props}>{children}</CopilotStep>;
};

export default function SeniorNotificationsScreen() {
    const router = useRouter();
    const isFocused = useIsFocused();

    // Connection Requests State
    const [requests, setRequests] = useState<ConnectionRequest[]>([]);
    // Generic Notifications State
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [loading, setLoading] = useState(true);

    const themeColor = '#3b82f6'; // Blue for Senior

    useEffect(() => {
        if (!auth.currentUser) {
            setLoading(false);
            return;
        }

        const userId = auth.currentUser.uid;

        // 1. Subscribe to Connection Requests (Only Senior receives these)
        const unsubscribeRequests = getConnectionRequests(userId, (fetchedRequests) => {
            setRequests(fetchedRequests);
        });

        // 2. Subscribe to Generic Notifications
        const unsubscribeNotifs = getNotifications(userId, (fetchedNotifs) => {
            setNotifications(fetchedNotifs);
            setLoading(false);
        });

        return () => {
            unsubscribeRequests();
            unsubscribeNotifs();
        };
    }, []);

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
            // If this notification has a sender (e.g. from Caretaker), I should notify them back
            let replyToId = undefined;
            let replyMessage = undefined;

            if (notif.senderId) {
                replyToId = notif.senderId;
                replyMessage = `Elder has seen/completed: ${notif.title}`;
            }

            await markAsDone(notif.id, replyToId, replyMessage);
        } catch (error: any) {
            Alert.alert("Error", "Failed to mark as done.");
        }
    };

    // Determine Step Orders
    const hasRequests = requests.length > 0;
    const hasNotifications = notifications.length > 0;

    // Step 1: Requests (if any)
    // Step 2 (or 1): Notifications (if any) OR No Notifications Text
    // Step 3 (or 2 or 1): Back Button

    let backButtonOrder = 1;
    if (hasRequests) backButtonOrder++;
    if (hasNotifications || !loading) backButtonOrder++; // Always count the notifications section (either list or empty text)

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <FocusedCopilotStep active={isFocused} text="Pindutin dito para bumalik." order={backButtonOrder} name="back-btn">
                    <WalkthroughableView style={{ alignSelf: 'flex-start' }}>
                        <AdaptiveButton
                            style={styles.backButton}
                            onPress={() => router.back()}
                            autoWidth
                            missPadding={10}
                            maxScale={1.1}
                        >
                            <Ionicons name="arrow-back" size={24} color={themeColor} />
                            <Text style={[styles.backText, { color: themeColor }]}>Bumalik</Text>
                        </AdaptiveButton>
                    </WalkthroughableView>
                </FocusedCopilotStep>
                <Text style={[styles.headerTitle, { color: themeColor }]}>Notifications</Text>
            </View>

            {/* Notification List */}
            <View style={styles.listContainer}>

                {/* Connection Requests Section */}
                {requests.length > 0 && (
                    <FocusedCopilotStep active={isFocused} text="Dito makikita ang mga request ng gustong kumonekta sa iyo." order={1} name="connection-requests">
                        <WalkthroughableView style={{ marginBottom: 20 }}>
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
                        </WalkthroughableView>
                    </FocusedCopilotStep>
                )}

                {/* Generic Notifications Section */}
                <View>
                    <Text style={styles.sectionTitle}>Recent Activity</Text>

                    {notifications.length === 0 && (
                        <FocusedCopilotStep active={isFocused} text="Wala kang bagong abiso sa ngayon." order={hasRequests ? 2 : 1} name="no-notifications">
                            <WalkthroughableView>
                                <Text style={styles.emptyText}>No new notifications.</Text>
                            </WalkthroughableView>
                        </FocusedCopilotStep>
                    )}

                    {notifications.map((notif, index) => {
                        // Wrap the first notification
                        if (index === 0) {
                            return (
                                <FocusedCopilotStep key={notif.id} active={isFocused} text="Dito makikita ang mga abiso o paalala." order={hasRequests ? 2 : 1} name="first-notification">
                                    <WalkthroughableView style={[styles.notificationCard, { backgroundColor: themeColor }]}>
                                        <View style={styles.iconCircle}>
                                            <Ionicons name="notifications-outline" size={30} color="#fff" />
                                        </View>
                                        <View style={styles.textContainer}>
                                            <Text style={styles.notificationTitle}>{notif.title}</Text>
                                            <Text style={styles.notificationMessage}>{notif.message}</Text>
                                        </View>

                                        {/* Done Button */}
                                        <AdaptiveButton
                                            onPress={() => handleMarkAsDone(notif)}
                                            style={styles.closeButton}
                                            missPadding={15}
                                            maxScale={1.2}
                                            autoWidth
                                        >
                                            <Ionicons name="checkmark-circle" size={28} color="#fff" />
                                            <Text style={styles.doneText}>Done</Text>
                                        </AdaptiveButton>
                                    </WalkthroughableView>
                                </FocusedCopilotStep>
                            );
                        }
                        return (
                            <View key={notif.id} style={[styles.notificationCard, { backgroundColor: themeColor }]}>
                                <View style={styles.iconCircle}>
                                    <Ionicons name="notifications-outline" size={30} color="#fff" />
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.notificationTitle}>{notif.title}</Text>
                                    <Text style={styles.notificationMessage}>{notif.message}</Text>
                                </View>

                                {/* Done Button */}
                                <AdaptiveButton
                                    onPress={() => handleMarkAsDone(notif)}
                                    style={styles.closeButton}
                                    missPadding={15}
                                    maxScale={1.2}
                                    autoWidth
                                >
                                    <Ionicons name="checkmark-circle" size={28} color="#fff" />
                                    <Text style={styles.doneText}>Done</Text>
                                </AdaptiveButton>
                            </View>
                        );
                    })}
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
