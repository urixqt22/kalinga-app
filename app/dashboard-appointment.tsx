import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AppointmentDashboardScreen() {
    const router = useRouter();

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                    <Text style={styles.backText}>Bumalik</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Appointment sa Doktor</Text>
                <Text style={styles.headerSubtitle}>Doctor appointments</Text>
            </View>

            {/* Notification Card */}
            <View style={styles.notificationCard}>
                <View style={styles.notificationIconCircle}>
                    <Ionicons name="notifications" size={30} color="#fcfcfcff" />
                </View>
                <View>
                    <Text style={styles.notificationTitle}>Doctor visit today</Text>
                    <Text style={styles.notificationSubtitle}>10:00 AM</Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Schedule</Text>

            {/* Schedule List */}
            <View style={styles.listContainer}>

                {/* Item 1 */}
                <View style={styles.scheduleCard}>
                    <View style={styles.doctorIconBox}>
                        <MaterialCommunityIcons name="doctor" size={30} color="#3b82f6" />
                        <View style={styles.plusBadge}>
                            <Ionicons name="add" size={10} color="#fff" />
                        </View>
                    </View>
                    <View style={styles.scheduleContent}>
                        <Text style={styles.doctorName}>Doctor Jorick visit.</Text>
                        <Text style={styles.visitTime}>12:00 NN</Text>
                        <View style={styles.dateContainer}>
                            <Text style={styles.visitDate}>January 24, 2026</Text>
                            <Text style={styles.visitDay}>Saturday</Text>
                        </View>
                    </View>
                </View>

                {/* Item 2 */}
                <View style={styles.scheduleCard}>
                    <View style={styles.doctorIconBox}>
                        <MaterialCommunityIcons name="doctor" size={30} color="#3b82f6" />
                        <View style={styles.plusBadge}>
                            <Ionicons name="add" size={10} color="#fff" />
                        </View>
                    </View>
                    <View style={styles.scheduleContent}>
                        <Text style={styles.doctorName}>Doctor Jorick visit.</Text>
                        <Text style={styles.visitTime}>12:00 NN</Text>
                        <View style={styles.dateContainer}>
                            <Text style={styles.visitDate}>January 24, 2026</Text>
                            <Text style={styles.visitDay}>Saturday</Text>
                        </View>
                    </View>
                </View>

                {/* Item 3 */}
                <View style={styles.scheduleCard}>
                    <View style={styles.doctorIconBox}>
                        <MaterialCommunityIcons name="doctor" size={30} color="#3b82f6" />
                        <View style={styles.plusBadge}>
                            <Ionicons name="add" size={10} color="#fff" />
                        </View>
                    </View>
                    <View style={styles.scheduleContent}>
                        <Text style={styles.doctorName}>Doctor Jorick visit.</Text>
                        <Text style={styles.visitTime}>12:00 NN</Text>
                        <View style={styles.dateContainer}>
                            <Text style={styles.visitDate}>January 24, 2026</Text>
                            <Text style={styles.visitDay}>Saturday</Text>
                        </View>
                    </View>
                </View>

            </View>

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
    },
    scheduleCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
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
        position: 'relative',
    },
    plusBadge: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: '#3b82f6',
        width: 15,
        height: 15,
        borderRadius: 7.5,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#fff',
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
});
