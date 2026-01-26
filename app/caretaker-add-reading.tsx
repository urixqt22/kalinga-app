import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../configs/firebase';
import { addVitalToFirestore } from '../services/vitals';

export default function CaretakerAddReadingScreen() {
    const router = useRouter();
    const [systolic, setSystolic] = useState('');
    const [diastolic, setDiastolic] = useState('');
    const [sugar, setSugar] = useState('');
    const [loading, setLoading] = useState(false);

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

                Alert.alert("Success", "Vitals recorded successfully!", [
                    { text: "OK", onPress: () => router.back() }
                ]);
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
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            placeholder="Systolic (e.g. 120)"
                            keyboardType="numeric"
                            placeholderTextColor="#9ca3af"
                            value={systolic}
                            onChangeText={setSystolic}
                        />
                        <Text style={styles.separator}>/</Text>
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            placeholder="Diastolic (e.g. 80)"
                            keyboardType="numeric"
                            placeholderTextColor="#9ca3af"
                            value={diastolic}
                            onChangeText={setDiastolic}
                        />
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
        padding: 15,
        borderRadius: 15,
        fontSize: 16,
        color: '#1f2937',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    halfInput: {
        flex: 1,
    },
    separator: {
        fontSize: 24,
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
});
