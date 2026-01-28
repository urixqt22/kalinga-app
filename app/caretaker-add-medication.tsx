import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../configs/firebase';
import { addMedicationToFirestore } from '../services/medication';

export default function CaretakerAddMedicationScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [dosage, setDosage] = useState('');
    const [loading, setLoading] = useState(false);

    // Time Picker State
    const [time, setTime] = useState('');

    const handleSave = async () => {
        if (!name || !dosage || !time) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        if (!auth.currentUser) {
            Alert.alert('Error', 'You are not logged in');
            return;
        }

        setLoading(true);
        try {
            // 1. Get the current user's connected elders
            const userDocRef = doc(db, "users", auth.currentUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const linkedElders = userData.linkedElders || [];

                if (linkedElders.length === 0) {
                    Alert.alert("No Elder Connected", "Please connect to an Elder first in the Dashboard.");
                    setLoading(false);
                    return;
                }

                // For MVP: Default to the first connected elder
                const targetElderId = linkedElders[0];

                // 2. Add Medication
                await addMedicationToFirestore(targetElderId, auth.currentUser.uid, {
                    name,
                    dosage,
                    time
                });

                Alert.alert("Success", "Medication scheduled successfully!");
                router.back();
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
                <Text style={styles.headerTitle}>Schedule Medication</Text>
                <Text style={styles.headerSubtitle}>Adding for your connected Patient</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <MaterialCommunityIcons name="pill" size={24} color="#a855f7" />
                        <Text style={styles.cardTitle}>Add Medication Schedule</Text>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Medicine</Text>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="#9ca3af"
                            placeholder="Enter medicine name"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Dosage</Text>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="#9ca3af"
                            placeholder="Enter dosage (e.g. 500mg)"
                            value={dosage}
                            onChangeText={setDosage}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Intake Time</Text>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="#9ca3af"
                            placeholder="e.g. 8:00 AM"
                            value={time}
                            onChangeText={setTime}
                        />
                    </View>

                </View>

                <TouchableOpacity
                    style={[styles.scheduleButton, loading && { opacity: 0.7 }]}
                    onPress={handleSave}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <MaterialCommunityIcons name="pill" size={24} color="#fff" style={{ marginRight: 10 }} />
                            <Text style={styles.scheduleButtonText}>Schedule Medication</Text>
                        </>
                    )}
                </TouchableOpacity>

            </View>
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
        alignItems: 'center',
    },
    card: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#a855f7',
        borderRadius: 20,
        padding: 20,
        marginBottom: 50,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 10,
    },
    cardTitle: {
        color: '#6b7280',
        fontSize: 16,
    },
    formGroup: {
        marginBottom: 15,
    },
    label: {
        color: '#6b7280',
        marginBottom: 5,
        fontSize: 14,
    },
    input: {
        backgroundColor: '#e5e7eb',
        borderRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 20,
        fontSize: 16,
        color: '#1f2937',
        height: 55, // Fixed height for consistency
    },

    scheduleButton: {
        backgroundColor: '#a855f7',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    scheduleButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
