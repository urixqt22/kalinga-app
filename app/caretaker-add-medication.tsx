import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { addMedication } from '../services/medicationStore';

export default function CaretakerAddMedicationScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [dosage, setDosage] = useState('');

    // Time Picker State
    const [time, setTime] = useState('');
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const onChange = (event: any, selectedDate?: Date) => {
        if (selectedDate) {
            setDate(selectedDate);
            // Format time manually to string "8:00 AM" to match existing data format
            let hours = selectedDate.getHours();
            const minutes = selectedDate.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            const minutesStr = minutes < 10 ? '0' + minutes : minutes;
            const strTime = `${hours}:${minutesStr} ${ampm}`;

            setTime(strTime);
        }

        if (Platform.OS === 'android') {
            setShowPicker(false);
        }
        // iOS picker is often displayed inline or requires manual toggle if displayed as modal
    };

    const handleSave = () => {
        if (name && dosage && time) {
            addMedication({ name, dosage, time });
            router.back();
        } else {
            alert('Please fill all fields');
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
                <Text style={styles.headerSubtitle}>Lola Moises Medication Schedule</Text>
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
                        {/* Time Picker Trigger */}
                        <TouchableOpacity onPress={() => setShowPicker(!showPicker)}>
                            <View style={[styles.input, { justifyContent: 'center' }]}>
                                <Text style={{ color: time ? '#1f2937' : '#9ca3af', fontSize: 16 }}>
                                    {time || "Select time"}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        {showPicker && (
                            <View style={styles.pickerContainer}>
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={date}
                                    mode="time"
                                    is24Hour={false}
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={onChange}
                                    style={styles.picker}
                                />
                                {Platform.OS === 'ios' && (
                                    <TouchableOpacity style={styles.confirmPicker} onPress={() => setShowPicker(false)}>
                                        <Text style={{ color: '#a855f7', fontWeight: 'bold' }}>Done</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                    </View>

                </View>

                <TouchableOpacity style={styles.scheduleButton} onPress={handleSave}>
                    <MaterialCommunityIcons name="pill" size={24} color="#fff" style={{ marginRight: 10 }} />
                    <Text style={styles.scheduleButtonText}>Schedule Medication</Text>
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
    pickerContainer: {
        marginTop: 10,
        alignItems: 'center',
        backgroundColor: '#f3e8ff',
        borderRadius: 10,
        padding: 10,
    },
    picker: {
        width: '100%',
    },
    confirmPicker: {
        marginTop: 10,
        padding: 10,
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
