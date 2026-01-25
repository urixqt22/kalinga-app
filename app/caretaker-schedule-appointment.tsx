import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function CaretakerScheduleAppointmentScreen() {
    const router = useRouter();

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
                <TextInput style={styles.input} placeholderTextColor="#9ca3af" placeholder="Enter Name" />

                <View style={styles.row}>
                    <View style={styles.halfInput}>
                        <Text style={styles.inputLabel}>Idad (Age)</Text>
                        <TextInput style={styles.input} placeholderTextColor="#9ca3af" placeholder="Enter Age" keyboardType="numeric" />
                    </View>
                    <View style={styles.halfInput}>
                        <Text style={styles.inputLabel}>Kasarian (Gender)</Text>
                        <View style={styles.dropdownInput}>
                            <Text style={{ color: '#9ca3af' }}>Select</Text>
                            <Ionicons name="chevron-down" size={20} color="#9ca3af" />
                        </View>
                    </View>
                </View>

                {/* Doctor/Clinic Info */}
                <Text style={styles.sectionLabel}>Doktor/Klinika</Text>

                <Text style={styles.inputLabel}>Pangalan ng Doktor</Text>
                <TextInput style={styles.input} placeholderTextColor="#9ca3af" placeholder="Dr. Name" />

                <Text style={styles.inputLabel}>Pangalan ng Klinika</Text>
                <TextInput style={styles.input} placeholderTextColor="#9ca3af" placeholder="Clinic Name" />

                <Text style={styles.inputLabel}>Address ng Klinika</Text>
                <TextInput style={styles.input} placeholderTextColor="#9ca3af" placeholder="Clinic Address" />

                {/* Date/Time */}
                <Text style={styles.sectionLabel}>Petsa at Oras</Text>
                <View style={styles.row}>
                    <View style={[styles.input, styles.halfInput, styles.iconInput]}>
                        <Ionicons name="calendar-outline" size={20} color="#a855f7" />
                        <Text style={{ color: '#9ca3af', marginLeft: 10 }}>Select Date</Text>
                    </View>
                    <View style={[styles.input, styles.halfInput, styles.iconInput]}>
                        <Ionicons name="time-outline" size={20} color="#a855f7" />
                        <Text style={{ color: '#9ca3af', marginLeft: 10 }}>Select Time</Text>
                    </View>
                </View>

                {/* Buttons */}
                <TouchableOpacity style={styles.confirmButton}>
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
});
