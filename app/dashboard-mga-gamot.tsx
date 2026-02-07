import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../configs/firebase';
import { getMedicationsRealtime, Medication, updateMedicationStatus } from '../services/medication';

export default function MgaGamotDashboardScreen() {
    const router = useRouter();
    const [meds, setMeds] = useState<Medication[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [selectedMed, setSelectedMed] = useState<Medication | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [marking, setMarking] = useState(false);

    useEffect(() => {
        if (!auth.currentUser) return;

        const unsubscribe = getMedicationsRealtime(auth.currentUser.uid, (fetchedMeds) => {
            // Sort: Scheduled first, then by time
            const sorted = fetchedMeds.sort((a, b) => {
                if (a.status === 'Scheduled' && b.status !== 'Scheduled') return -1;
                if (a.status !== 'Scheduled' && b.status === 'Scheduled') return 1;

                // Then by time
                const parseTime = (t: string) => {
                    const [time, modifier] = t.split(' ');
                    if (!time || !modifier) return '0000';
                    let [hours, minutes] = time.split(':');
                    if (hours === '12') hours = '00';
                    if (modifier === 'PM') hours = String(parseInt(hours, 10) + 12);
                    return `${hours.padStart(2, '0')}${minutes}`;
                };
                return parseTime(a.time).localeCompare(parseTime(b.time));
            });
            setMeds(sorted);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleMedPress = (med: Medication) => {
        if (med.status === 'Taken') return; // Optionally disable if already taken
        setSelectedMed(med);
        setModalVisible(true);
    };

    const handleMarkTaken = async () => {
        if (!selectedMed) return;
        setMarking(true);
        try {
            await updateMedicationStatus(selectedMed.id, 'Taken');
            setModalVisible(false);
            setTimeout(() => setSuccessModalVisible(true), 300); // Small delay for smooth transition
        } catch (error) {
            alert("Failed to update status.");
        } finally {
            setMarking(false);
            setSelectedMed(null);
        }
    };

    const nextUpMed = meds.find(m => m.status === 'Scheduled');

    return (
        <View style={styles.mainContainer}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                        <Text style={styles.backText}>Bumalik</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Mga Gamot</Text>
                    <Text style={styles.headerSubtitle}>View Your Medications</Text>
                </View>

                {/* Next Up Card */}
                {nextUpMed && (
                    <TouchableOpacity style={styles.nextUpCard} onPress={() => handleMedPress(nextUpMed)}>
                        <View style={styles.nextUpIconCircle}>
                            <Ionicons name="notifications" size={30} color="#fff" />
                        </View>
                        <View>
                            <Text style={styles.nextUpTitle}>Next Up: {nextUpMed.name} {nextUpMed.dosage}</Text>
                            <Text style={styles.nextUpSubtitle}>{nextUpMed.time}</Text>
                        </View>
                    </TouchableOpacity>
                )}

                {/* Medication List */}
                <View style={styles.listContainer}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#3b82f6" />
                    ) : (
                        <>
                            {meds.map((med) => (
                                <TouchableOpacity
                                    key={med.id}
                                    style={[styles.medCard, med.status === 'Taken' && styles.medCardTaken]}
                                    onPress={() => handleMedPress(med)}
                                    disabled={med.status === 'Taken'}
                                >
                                    <View style={[styles.medIconBox, med.status === 'Taken' && { backgroundColor: '#dcfce7' }]}>
                                        <MaterialCommunityIcons
                                            name={med.status === 'Taken' ? "check" : "pill"}
                                            size={24}
                                            color={med.status === 'Taken' ? "#22c55e" : "#3b82f6"}
                                        />
                                    </View>
                                    <View style={[med.status === 'Taken' && { opacity: 1 }]}>
                                        <Text style={[styles.medName, med.status === 'Taken' && { color: '#374151' }]}>
                                            {med.name} {med.dosage}
                                        </Text>
                                        <Text style={styles.medTime}>{med.time} • {med.status}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                            {meds.length === 0 && (
                                <Text style={{ textAlign: 'center', color: '#64748b', marginTop: 20 }}>
                                    No medications scheduled.
                                </Text>
                            )}
                        </>
                    )}
                </View>

            </ScrollView>

            {/* Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    {selectedMed && (
                        <View style={styles.modalContent}>
                            {/* Blue Header Section within Modal as per mockup style */}
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTime}>{selectedMed.time}</Text>
                                <Text style={styles.modalMedName}>{selectedMed.name} {selectedMed.dosage}</Text>
                            </View>

                            <View style={styles.modalBody}>
                                <TouchableOpacity
                                    style={styles.markTakenButton}
                                    onPress={handleMarkTaken}
                                    disabled={marking}
                                >
                                    {marking ? (
                                        <ActivityIndicator color="#3b82f6" />
                                    ) : (
                                        <Text style={styles.markTakenText}>Mark as Taken (Nainom Na)</Text>
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            </Modal>
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
                                Medication marked as taken.
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
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#f0f9ff',
    },
    scrollContainer: {
        paddingBottom: 50,
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
        fontSize: 32,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        color: '#dbeafe',
        fontSize: 16,
        marginTop: 5,
    },
    nextUpCard: {
        backgroundColor: '#3b82f6',
        margin: 20,
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 3,
    },
    nextUpIconCircle: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    nextUpTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    nextUpSubtitle: {
        color: '#fff',
        opacity: 0.9,
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    medCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#bfdbfe',
    },
    medCardTaken: {
        backgroundColor: '#fff',
        borderColor: '#93c5fd', // Light Blue Border
        opacity: 0.9,
    },
    medIconBox: {
        backgroundColor: '#dbeafe',
        width: 50,
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    medName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e3a8a',
    },
    medTime: {
        color: '#3b82f6',
        fontWeight: '500',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 25, // More rounded like popup
        width: '100%',
        maxWidth: 320,
        overflow: 'hidden',
        elevation: 10,
    },
    modalHeader: {
        backgroundColor: '#3b82f6',
        padding: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalTime: {
        color: '#fff',
        fontSize: 32, // Big time
        fontWeight: 'bold',
        marginBottom: 5,
    },
    modalMedName: {
        color: '#dbeafe',
        fontSize: 18,
    },
    modalBody: {
        padding: 20,
        gap: 15,
        alignItems: 'center',
    },
    markTakenButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#3b82f6', // Or maybe filled blue? Mockup has white button on blue usually but let's see
        // Actually mockup has blue background for header, white button might be nice OR the whole modal is blue?
        // Let's stick to: Blue Header, White Body, Blue Button for contrast?
        // Wait, user mockup shows Blue Modal Background? No, it looks like a Blue Card.
        // Let's try to match: Blue Header, White Button with Blue Text?
        // Let's use a "Pill" shape button.
        width: '100%',
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        elevation: 2,
    },
    markTakenText: {
        color: '#3b82f6',
        fontWeight: 'bold',
        fontSize: 16,
    },
    closeButton: {
        padding: 10,
    },
    closeButtonText: {
        color: '#94a3b8',
    },
});
