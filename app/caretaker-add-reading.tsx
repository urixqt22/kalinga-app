import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { useState } from 'react';
import { ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../configs/firebase';
import { addVitalToFirestore } from '../services/vitals';

export default function CaretakerAddReadingScreen() {
    const router = useRouter();
    const [systolic, setSystolic] = useState('');
    const [diastolic, setDiastolic] = useState('');
    const [sugar, setSugar] = useState('');
    const [loading, setLoading] = useState(false);
    const [successModalVisible, setSuccessModalVisible] = useState(false);

    const handleSave = async () => {
        if (!systolic || !diastolic || !sugar) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        if (!auth.currentUser) {
            Alert.alert("Error", "You are not logged in.");
            return;
        }

        setLoading(true);
        try {
            // 1. Get connected elder
            const userDocRef = doc(db, "users", auth.currentUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const linkedElders = userData.linkedElders || [];

                if (linkedElders.length === 0) {
                    Alert.alert("Error", "No connected elder found. Please connect to a senior first.");
                    setLoading(false);
                    return;
                }

                const targetElderId = linkedElders[0];

                // 2. Add Vital
                await addVitalToFirestore(targetElderId, auth.currentUser.uid, {
                    bpSystolic: systolic,
                    bpDiastolic: diastolic,
                    bloodSugar: sugar
                });

                setSuccessModalVisible(true);
            }
        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add Reading</Text>
                <Text style={styles.headerSubtitle}>Input patient vitals</Text>
            </View>

            <View style={styles.formContainer}>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Blood Pressure</Text>
                    <View style={styles.row}>
                        <View style={styles.halfColumn}>
                            <TextInput
                                style={styles.input}
                                placeholder="Systolic (120)"
                                keyboardType="numeric"
                                placeholderTextColor="#9ca3af"
                                value={systolic}
                                onChangeText={setSystolic}
                            />
                        </View>
                        <Text style={styles.separator}>/</Text>
                        <View style={styles.halfColumn}>
                            <TextInput
                                style={styles.input}
                                placeholder="Diastolic (80)"
                                keyboardType="numeric"
                                placeholderTextColor="#9ca3af"
                                value={diastolic}
                                onChangeText={setDiastolic}
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Blood Sugar (mg/dL)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. 95"
                        keyboardType="numeric"
                        placeholderTextColor="#9ca3af"
                        value={sugar}
                        onChangeText={setSugar}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.saveButton, loading && { opacity: 0.7 }]}
                    onPress={handleSave}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.saveButtonText}>Save Reading</Text>
                    )}
                </TouchableOpacity>

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
                                Reading successfully added!
                            </Text>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#a855f7', paddingVertical: 12, paddingHorizontal: 30,
                                    borderRadius: 25, width: '100%', alignItems: 'center'
                                }}
                                onPress={() => {
                                    setSuccessModalVisible(false);
                                    router.back();
                                }}
                            >
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Done</Text>
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
    formContainer: {
        padding: 20,
        marginTop: 20,
    },
    inputGroup: {
        marginBottom: 25,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4b5563',
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#f3f4f6',
        padding: 12,
        borderRadius: 15,
        fontSize: 16,
        color: '#1f2937',
        width: '100%', // Ensure input fills its wrapper
    },
    row: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    halfColumn: {
        flex: 1, // The container flexes, not the input directly
    },
    separator: {
        fontSize: 20,
        color: '#9ca3af',
        fontWeight: 'bold',
    },
    saveButton: {
        backgroundColor: '#a855f7',
        padding: 18,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 20,
        elevation: 5,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
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
