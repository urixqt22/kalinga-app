import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../configs/firebase';
import { getLinkedElder } from '../services/connection';
import { deleteAllMedications, getMedicationsRealtime, Medication } from '../services/medication';

export default function CaretakerScheduleMedicationScreen() {
    const router = useRouter();
    const [medList, setMedList] = useState<Medication[]>([]);
    const [loading, setLoading] = useState(true);
    const [elderName, setElderName] = useState('Elder');
    const [elderId, setElderId] = useState<string | null>(null);

    // 1. Fetch Linked Elder ID and Name
    useEffect(() => {
        const fetchContext = async () => {
            if (!auth.currentUser) return;

            try {
                const linkedId = await getLinkedElder(auth.currentUser.uid);
                if (linkedId) {
                    setElderId(linkedId);

                    // Fetch Elder Name
                    const elderDoc = await getDoc(doc(db, "users", linkedId));
                    if (elderDoc.exists()) {
                        setElderName(elderDoc.data().name || "Elder");
                    }
                } else {
                    setLoading(false); // No elder connected
                }
            } catch (error) {
                console.error("Error fetching elder context:", error);
                setLoading(false);
            }
        };
        fetchContext();
    }, []);

    // 2. Fetch Medications Realtime (once we have elderId)
    useEffect(() => {
        if (!elderId) return;

        const unsubscribe = getMedicationsRealtime(elderId, (meds) => {
            setMedList(meds);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [elderId]);

    const [isClearModalVisible, setClearModalVisible] = useState(false);

    const handleClearLogs = () => {
        setClearModalVisible(true);
    };

    const confirmClearLogs = async () => {
        setClearModalVisible(false);
        if (elderId) {
            try {
                await deleteAllMedications(elderId);
            } catch (error) {
                console.error("Failed to clear logs:", error);
                alert("Failed to clear logs");
            }
        }
    };

    const MedItem = ({ name, dosage, time, status }: { name: string, dosage: string, time: string, status: string }) => (
        <View style={styles.card}>
            <View style={styles.iconCircle}>
                <Ionicons name="time-outline" size={24} color="#a855f7" />
            </View>
            <View>
                <Text style={styles.medName}>{name} {dosage}</Text>
                <Text style={styles.medTime}>{time} • {status}</Text>
            </View>
        </View>
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Schedule Medication</Text>
                <Text style={styles.headerSubtitle}>{elderName}'s Medication Schedule</Text>
            </View>

            <View style={styles.content}>

                <View style={styles.listContainer}>
                    <View style={styles.listHeader}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <MaterialCommunityIcons name="pill" size={24} color="#a855f7" />
                            <Text style={styles.listTitle}>Medication Logs</Text>
                        </View>
                        {medList.length > 0 && (
                            <TouchableOpacity onPress={handleClearLogs}>
                                <Text style={{ color: '#ef4444', fontWeight: 'bold' }}>Clear Logs</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {loading ? (
                        <ActivityIndicator color="#a855f7" style={{ marginTop: 20 }} />
                    ) : (
                        <>
                            {medList.length === 0 ? (
                                <Text style={{ textAlign: 'center', color: '#9ca3af', marginTop: 20 }}>
                                    No scheduled medications yet.
                                </Text>
                            ) : (
                                medList.map((med) => (
                                    <MedItem key={med.id} name={med.name} dosage={med.dosage} time={med.time} status={med.status} />
                                ))
                            )}
                        </>
                    )}

                </View>

                {/* Only define params if necessary, or rely on context in next screen */}
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => router.push('/caretaker-add-medication')}
                >
                    <MaterialCommunityIcons name="pill" size={24} color="#fff" style={{ marginRight: 10 }} />
                    <Text style={styles.addButtonText}>Schedule Medication</Text>
                </TouchableOpacity>

            </View>

            {/* Clear Logs Confirmation Modal */}
            <Modal
                visible={isClearModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setClearModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Clear All Logs</Text>
                        <Text style={styles.modalMessage}>
                            Are you sure you want to delete all medication logs? This cannot be undone.
                        </Text>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setClearModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.deleteButton]}
                                onPress={confirmClearLogs}
                            >
                                <Text style={styles.deleteButtonText}>Clear</Text>
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
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#a855f7',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 30,
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
        fontSize: 24,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        color: '#f3e8ff',
        fontSize: 14,
        marginTop: 5,
    },
    content: {
        padding: 20,
        flex: 1,
    },
    listContainer: {
        borderWidth: 1,
        borderColor: '#a855f7',
        borderRadius: 20,
        padding: 20,
        marginBottom: 50,
    },
    listHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    listTitle: {
        fontSize: 16,
        color: '#6b7280',
    },
    card: {
        backgroundColor: '#faf5ff',
        padding: 20,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        elevation: 1,
    },
    iconCircle: {
        marginRight: 15,
    },
    medName: {
        fontSize: 14,
        color: '#6b7280',
    },
    medTime: {
        fontSize: 12,
        color: '#d8b4fe',
    },
    addButton: {
        backgroundColor: '#a855f7',
        padding: 18,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginHorizontal: 50,
        marginBottom: 30,
        elevation: 5,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 16,
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 24,
    },
    modalButtons: {
        flexDirection: 'row',
        width: '100%',
        gap: 15,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: '#f3f4f6',
    },
    cancelButtonText: {
        color: '#4b5563',
        fontWeight: '600',
        fontSize: 16,
    },
    deleteButton: {
        backgroundColor: '#ef4444',
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});
