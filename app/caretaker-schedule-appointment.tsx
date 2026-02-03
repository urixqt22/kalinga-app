import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../configs/firebase';
import { addAppointmentToFirestore } from '../services/appointment';

export default function CaretakerScheduleAppointmentScreen() {
    const router = useRouter();
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [gender, setGender] = useState('');
    const [showGenderPicker, setShowGenderPicker] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form States
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [doctorName, setDoctorName] = useState('');
    const [clinicName, setClinicName] = useState('');
    const [clinicAddress, setClinicAddress] = useState('');

    const handleSave = async () => {
        if (!name || !age || !gender || !doctorName || !clinicName || !clinicAddress || !date || !time) {
            if (Platform.OS === 'web') {
                alert("Please fill in all fields.");
            } else {
                Alert.alert("Error", "Please fill in all fields.");
            }
            return;
        }

        if (!auth.currentUser) {
            if (Platform.OS === 'web') {
                alert("You are not logged in.");
            } else {
                Alert.alert("Error", "You are not logged in.");
            }
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
                    if (Platform.OS === 'web') {
                        alert("No connected elder found. Please connect to a senior first.");
                    } else {
                        Alert.alert("Error", "No connected elder found. Please connect to a senior first.");
                    }
                    setLoading(false);
                    return;
                }

                const targetElderId = linkedElders[0];

                // 2. Add Appointment
                await addAppointmentToFirestore(targetElderId, auth.currentUser.uid, {
                    patientName: name,
                    age,
                    gender,
                    doctorName,
                    clinicName,
                    clinicAddress,
                    date,
                    time
                });

                if (Platform.OS === 'web') {
                    alert("Appointment scheduled successfully!");
                    router.replace('/dashboard-health-monitor');
                } else {
                    Alert.alert(
                        "Success",
                        "Appointment scheduled successfully!",
                        [
                            {
                                text: "OK",
                                onPress: () => {
                                    // Using replace ensures we don't go back to the form
                                    router.replace('/dashboard-health-monitor');
                                }
                            }
                        ],
                        { cancelable: false }
                    );
                }
            }
        } catch (error: any) {
            if (Platform.OS === 'web') {
                alert("Error: " + error.message);
            } else {
                Alert.alert("Error", error.message);
            }
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
                <Text style={styles.headerTitle}>Schedule Doctor Appointment</Text>
                <Text style={styles.headerSubtitle}>Lola Maria's Health Status</Text>
            </View>

            <View style={styles.formContainer}>
                {/* Patient Info */}
                <Text style={styles.sectionLabel}>Impormasyon ng Pasyente</Text>

                <Text style={styles.inputLabel}>PANGALAN (Name)</Text>
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#9ca3af"
                    placeholder="Enter Name"
                    value={name}
                    onChangeText={setName}
                />

                <View style={styles.row}>
                    <View style={styles.halfInput}>
                        <Text style={styles.inputLabel}>Idad (Age)</Text>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="#9ca3af"
                            placeholder="Enter Age"
                            keyboardType="numeric"
                            value={age}
                            onChangeText={setAge}
                        />
                    </View>
                    <View style={styles.halfInput}>
                        <Text style={styles.inputLabel}>Kasarian (Gender)</Text>
                        <View style={{ position: 'relative', zIndex: 10 }}>
                            <TouchableOpacity
                                style={styles.dropdownInput}
                                onPress={() => setShowGenderPicker(!showGenderPicker)}
                            >
                                <Text style={{ color: gender ? '#1f2937' : '#9ca3af' }}>
                                    {gender || 'Select'}
                                </Text>
                                <Ionicons name="chevron-down" size={20} color="#9ca3af" />
                            </TouchableOpacity>
                            {showGenderPicker && (
                                <View style={styles.dropdownOptions}>
                                    <TouchableOpacity
                                        style={styles.optionItem}
                                        onPress={() => { setGender('Male'); setShowGenderPicker(false); }}
                                    >
                                        <Text>Male</Text>
                                    </TouchableOpacity>
                                    <View style={styles.divider} />
                                    <TouchableOpacity
                                        style={styles.optionItem}
                                        onPress={() => { setGender('Female'); setShowGenderPicker(false); }}
                                    >
                                        <Text>Female</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>
                </View>

                {/* Doctor/Clinic Info */}
                <Text style={styles.sectionLabel}>Doktor/Klinika</Text>

                <Text style={styles.inputLabel}>Pangalan ng Doktor</Text>
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#9ca3af"
                    placeholder="Dr. Name"
                    value={doctorName}
                    onChangeText={setDoctorName}
                />

                <Text style={styles.inputLabel}>Pangalan ng Klinika</Text>
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#9ca3af"
                    placeholder="Clinic Name"
                    value={clinicName}
                    onChangeText={setClinicName}
                />

                <Text style={styles.inputLabel}>Address ng Klinika</Text>
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#9ca3af"
                    placeholder="Clinic Address"
                    value={clinicAddress}
                    onChangeText={setClinicAddress}
                />

                {/* Date/Time */}
                <Text style={styles.sectionLabel}>Petsa at Oras</Text>
                <View style={styles.row}>
                    <View style={styles.halfInput}>
                        <Text style={styles.inputLabel}>Date</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="MM/DD/YYYY"
                            placeholderTextColor="#9ca3af"
                            value={date}
                            onChangeText={setDate}
                        />
                    </View>
                    <View style={styles.halfInput}>
                        <Text style={styles.inputLabel}>Time</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="HH:MM AM/PM"
                            placeholderTextColor="#9ca3af"
                            value={time}
                            onChangeText={setTime}
                        />
                    </View>
                </View>

                {/* Buttons */}
                <TouchableOpacity style={styles.confirmButton} onPress={handleSave}>
                    <Text style={styles.confirmButtonText}>I-confirm ang appointment</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
                    <Text style={styles.cancelButtonText}>I-cancel</Text>
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
        fontSize: 22,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        color: '#f3e8ff',
        fontSize: 14,
        marginTop: 5,
    },
    formContainer: {
        padding: 20,
    },
    sectionLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
        marginTop: 15,
        marginBottom: 10,
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 5,
        marginTop: 10,
    },
    input: {
        backgroundColor: '#e5e7eb', // Light gray input bg
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        color: '#1f2937',
    },
    row: {
        flexDirection: 'row',
        gap: 15,
    },
    halfInput: {
        flex: 1,
    },
    dropdownInput: {
        backgroundColor: '#e5e7eb',
        borderRadius: 10,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    iconInput: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    confirmButton: {
        backgroundColor: '#a855f7',
        padding: 18,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 15,
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        padding: 18,
        borderRadius: 25,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#a855f7',
        marginBottom: 30,
    },
    cancelButtonText: {
        color: '#a855f7',
        fontSize: 16,
        fontWeight: 'bold',
    },
    dropdownOptions: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        marginTop: 5,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    optionItem: {
        padding: 15,
    },
    divider: {
        height: 1,
        backgroundColor: '#e5e7eb',
    },
});
