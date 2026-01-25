import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HealthMonitorDashboardScreen() {
    const router = useRouter();

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Health Monitor</Text>
                <Text style={styles.headerSubtitle}>Lola Maria's Health Status</Text>
            </View>

            {/* Today's Vitals Card */}
            <View style={styles.card}>
                <View style={styles.cardHeaderRow}>
                    <View style={styles.cardTitleContainer}>
                        <MaterialCommunityIcons name="heart-pulse" size={24} color="#a855f7" />
                        <Text style={styles.cardTitle}>Today's Vitals</Text>
                    </View>
                    <TouchableOpacity style={styles.addButton}>
                        <Ionicons name="add-circle" size={16} color="#fff" />
                        <Text style={styles.addButtonText}>Add Reading</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.vitalsRow}>
                    <View style={styles.vitalBox}>
                        <Text style={styles.vitalLabel}>Blood Pressure</Text>
                        <Text style={styles.vitalValue}>120/80</Text>
                        <Text style={styles.vitalStatus}>Normal</Text>
                    </View>
                    <View style={styles.vitalBox}>
                        <Text style={styles.vitalLabel}>Blood Sugar</Text>
                        <Text style={styles.vitalValue}>95 mg/dL</Text>
                        <Text style={styles.vitalStatus}>Normal</Text>
                    </View>
                </View>
            </View>

            {/* Medication Schedule Card */}
            <View style={styles.card}>
                <View style={styles.cardHeaderRow}>
                    <View style={styles.cardTitleContainer}>
                        <MaterialCommunityIcons name="pill" size={24} color="#a855f7" />
                        <Text style={styles.cardTitle}>Medication Schedule</Text>
                    </View>
                </View>

                <View style={styles.medicationList}>

                    {/* Taken */}
                    <View style={[styles.medItem, { backgroundColor: '#f0fdf4' }]}>
                        <View style={styles.medIconContainer}>
                            <Ionicons name="checkmark-circle-outline" size={24} color="#22c55e" />
                        </View>
                        <View style={styles.medTextContainer}>
                            <Text style={styles.medName}>Losartan 50mg</Text>
                            <Text style={styles.medTime}>8:00 AM - Taken</Text>
                        </View>
                        <Ionicons name="time-outline" size={20} color="#22c55e" />
                    </View>

                    {/* Upcoming */}
                    <View style={[styles.medItem, { backgroundColor: '#eff6ff' }]}>
                        <View style={styles.medIconContainer}>
                            <Ionicons name="information-circle-outline" size={24} color="#3b82f6" />
                        </View>
                        <View style={styles.medTextContainer}>
                            <Text style={styles.medName}>Metformin 500mg</Text>
                            <Text style={styles.medTime}>12:00 PM - Upcoming</Text>
                        </View>
                        <Ionicons name="time-outline" size={20} color="#3b82f6" />
                    </View>

                    {/* Scheduled */}
                    <View style={[styles.medItem, { backgroundColor: '#faf5ff' }]}>
                        <View style={styles.medIconContainer}>
                            <Ionicons name="time-outline" size={24} color="#a855f7" />
                        </View>
                        <View style={styles.medTextContainer}>
                            <Text style={styles.medName}>Losartan 50mg</Text>
                            <Text style={styles.medTime}>8:00 PM - Scheduled</Text>
                        </View>
                    </View>

                </View>
            </View>

            {/* Footer Buttons */}
            <View style={styles.footerRow}>
                <TouchableOpacity style={styles.footerButton} onPress={() => router.push('/caretaker-schedule-appointment')}>
                    <MaterialCommunityIcons name="heart-pulse" size={24} color="#fff" />
                    <Text style={styles.footerButtonText}>Schedule Doctor Appointment</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.footerButton} onPress={() => router.push('/caretaker-schedule-medication')}>
                    <MaterialCommunityIcons name="pill" size={24} color="#fff" />
                    <Text style={styles.footerButtonText}>Schedule Medication</Text>
                </TouchableOpacity>
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
        backgroundColor: '#a855f7', // Purple
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
        fontSize: 28,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        color: '#f3e8ff',
        fontSize: 14,
        marginTop: 5,
    },
    card: {
        backgroundColor: '#fff',
        margin: 20,
        marginBottom: 0,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#e9d5ff',
    },
    cardHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    cardTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#6b21a8', // Dark Purple
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#a855f7',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 15,
        gap: 5,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    vitalsRow: {
        flexDirection: 'row',
        gap: 15,
    },
    vitalBox: {
        flex: 1,
        backgroundColor: '#faf5ff',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
    },
    vitalLabel: {
        fontSize: 12,
        color: '#a855f7',
        marginBottom: 5,
    },
    vitalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#6b21a8',
        marginBottom: 5,
    },
    vitalStatus: {
        fontSize: 12,
        color: '#6b21a8',
    },
    medicationList: {
        gap: 10,
        marginTop: 10,
    },
    medItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 15,
    },
    medIconContainer: {
        marginRight: 15,
    },
    medTextContainer: {
        flex: 1,
    },
    medName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#374151',
    },
    medTime: {
        fontSize: 12,
        color: '#6b7280',
    },
    footerRow: {
        flexDirection: 'row',
        gap: 15,
        padding: 20,
    },
    footerButton: {
        flex: 1,
        backgroundColor: '#a855f7',
        padding: 15,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        elevation: 3,
    },
    footerButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
