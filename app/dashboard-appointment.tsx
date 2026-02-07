import { AdaptiveButton } from '@/components/AdaptiveButton';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../configs/firebase';
import { Appointment, getAppointmentsRealtime, updateAppointmentStatus } from '../services/appointment';

export default function AppointmentDashboardScreen() {
    const router = useRouter();
    const [userRole, setUserRole] = useState<'senior' | 'caretaker'>('senior');
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [actionMessage, setActionMessage] = useState('');
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!auth.currentUser) return;

            // Check User Role & Correct ID
            const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
            let targetId = auth.currentUser.uid;

            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (userData.role === 'caretaker') {
                    setUserRole('caretaker');
                    if (userData.linkedElders && userData.linkedElders.length > 0) {
                        targetId = userData.linkedElders[0];
                    }
                }
            }

            const unsubscribe = getAppointmentsRealtime(targetId, (data) => {
                // Filter out cancelled/completed if needed, or show them differently?
                // User said "remove from the schedule dashboard", implies hiding them.
                const active = data.filter(a => a.status === 'Scheduled');
                setAppointments(active);
                setLoading(false);
            });

            return () => unsubscribe();
        };

        fetchData();
    }, []);

    const handleUpdateStatus = async (id: string, status: 'Completed' | 'Cancelled') => {
        try {
            await updateAppointmentStatus(id, status);
            setActionMessage(status === 'Completed' ? "Appointment marked as done!" : "Appointment cancelled.");
            setSuccessModalVisible(true);
        } catch (error) {
            alert("Error updating status");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Header */}
            <View style={styles.header}>
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
                <Text style={styles.headerTitle}>Appointment sa Doktor</Text>
                <Text style={styles.headerSubtitle}>Doctor appointments</Text>
            </View>

            {/* Notification Card (Latest Appointment) */}
            {appointments.length > 0 && (
                <View style={styles.notificationCard}>
                    <View style={styles.notificationIconCircle}>
                        <Ionicons name="notifications" size={30} color="#fcfcfcff" />
                    </View>
                    <View>
                        <Text style={styles.notificationTitle}>Doctor visit today</Text>
                        <Text style={styles.notificationSubtitle}>
                            {appointments[0].time} - {appointments[0].doctorName}
                        </Text>
                    </View>
                </View>
            )}

            <Text style={styles.sectionTitle}>Schedule</Text>

            {/* Schedule List */}
            <View style={styles.listContainer}>
                {loading ? (
                    <ActivityIndicator size="large" color="#3b82f6" />
                ) : (
                    <>
                        {appointments.map((apt) => (
                            <View key={apt.id} style={styles.scheduleCard}>
                                <View style={styles.doctorIconBox}>
                                    <MaterialCommunityIcons name="doctor" size={30} color="#3b82f6" />
                                </View>
                                <View style={styles.scheduleContent}>
                                    <Text style={styles.doctorName}>Doctor {apt.doctorName} visit.</Text>
                                    <Text style={styles.visitTime}>{apt.time}</Text>
                                    <View style={styles.dateContainer}>
                                        <Text style={styles.visitDate}>{apt.date}</Text>
                                        <Text style={styles.visitDay}>Upcoming</Text>
                                    </View>

                                    {/* Actions for Caretaker */}
                                    <View style={styles.actionRow}>
                                        <AdaptiveButton
                                            style={[styles.actionButton, { backgroundColor: '#dcfce7' }]}
                                            onPress={() => handleUpdateStatus(apt.id, 'Completed')}
                                            autoWidth
                                            missPadding={20}
                                            maxScale={1.1}
                                        >
                                            <Ionicons name="checkmark" size={20} color="#22c55e" />
                                            <Text style={[styles.actionText, { color: '#166534' }]}>Done</Text>
                                        </AdaptiveButton>

                                        <AdaptiveButton
                                            style={[styles.actionButton, { backgroundColor: '#fee2e2' }]}
                                            onPress={() => handleUpdateStatus(apt.id, 'Cancelled')}
                                            autoWidth
                                            missPadding={20}
                                            maxScale={1.1}
                                        >
                                            <Ionicons name="close" size={20} color="#ef4444" />
                                            <Text style={[styles.actionText, { color: '#991b1b' }]}>Cancel</Text>
                                        </AdaptiveButton>
                                    </View>
                                </View>
                            </View>
                        ))}

                        {appointments.length === 0 && (
                            <Text style={{ textAlign: 'center', color: '#64748b', marginTop: 20 }}>
                                No appointments scheduled.
                            </Text>
                        )}
                    </>
                )}
            </View>

            {/* Success Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={successModalVisible}
                onRequestClose={() => setSuccessModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={{ alignItems: 'center', padding: 30 }}>
                            <View style={{
                                width: 60, height: 60, borderRadius: 30, backgroundColor: '#dcfce7',
                                justifyContent: 'center', alignItems: 'center', marginBottom: 20
                            }}>
                                <Ionicons name="checkmark" size={40} color="#22c55e" />
                            </View>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1e3a8a', marginBottom: 10 }}>Success!</Text>
                            <Text style={{ fontSize: 16, color: '#64748b', textAlign: 'center', marginBottom: 20 }}>
                                {actionMessage}
                            </Text>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#3b82f6', paddingVertical: 12, paddingHorizontal: 30,
                                    borderRadius: 25, width: '100%', alignItems: 'center'
                                }}
                                onPress={() => setSuccessModalVisible(false)}
                            >
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
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
        fontSize: 28,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        color: '#dbeafe',
        fontSize: 14,
        marginTop: 5,
    },
    notificationCard: {
        backgroundColor: '#3b82f6',
        margin: 20,
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 3,
        marginTop: 20,
    },
    notificationIconCircle: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        width: 50,
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    notificationTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    notificationSubtitle: {
        color: '#fff',
        opacity: 0.9,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2563eb',
        marginLeft: 20,
        marginBottom: 15,
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 50,
    },
    scheduleCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: '#bfdbfe',
    },
    doctorIconBox: {
        backgroundColor: '#dbeafe',
        width: 60,
        height: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    scheduleContent: {
        flex: 1,
    },
    doctorName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2563eb',
        marginBottom: 5,
    },
    visitTime: {
        fontSize: 14,
        color: '#64748b',
    },
    dateContainer: {
        position: 'absolute',
        right: 0,
        top: 0,
        alignItems: 'flex-end',
    },
    visitDate: {
        fontSize: 12,
        color: '#3b82f6',
        marginBottom: 2,
    },
    visitDay: {
        fontSize: 12,
        color: '#3b82f6',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 15,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderRadius: 15,
        gap: 5,
    },
    actionText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 25,
        width: '100%',
        maxWidth: 320,
        elevation: 10,
        overflow: 'hidden',
    },
});
