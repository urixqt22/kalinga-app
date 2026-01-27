import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react'; // Added imports
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../configs/firebase'; // Added import
import { getMedicationsRealtime, Medication } from '../services/medication'; // Added import

export default function KalusuganDashboardScreen() {
    const router = useRouter();
    const [nextMed, setNextMed] = useState<Medication | null>(null); // Added state

    useEffect(() => {
        if (!auth.currentUser) return;

        const unsubscribe = getMedicationsRealtime(auth.currentUser.uid, (fetchedMeds) => {
            // Filter only Scheduled meds
            const scheduled = fetchedMeds.filter(m => m.status === 'Scheduled');

            // Sort by time
            const sorted = scheduled.sort((a, b) => {
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

            // Pick the first one
            setNextMed(sorted.length > 0 ? sorted[0] : null);
        });

        return () => unsubscribe();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                    <Text style={styles.backText}>Bumalik</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Kalusugan</Text>
                <Text style={styles.headerSubtitle}>Health Management</Text>
            </View>

            {/* Reminder Card (Dynamic) */}
            {nextMed ? (
                <TouchableOpacity style={styles.reminderCard} onPress={() => router.push('/dashboard-mga-gamot')}>
                    <View style={styles.reminderIconCircle}>
                        <Ionicons name="notifications" size={30} color="#3b82f6" />
                    </View>
                    <View>
                        <Text style={styles.reminderTitle}>Reminder: Inom ng Gamot</Text>
                        <Text style={styles.reminderSubtitle}>{nextMed.name} {nextMed.dosage} - {nextMed.time}</Text>
                    </View>
                </TouchableOpacity>
            ) : (
                <View style={[styles.reminderCard, { backgroundColor: '#10b981' }]}>
                    <View style={styles.reminderIconCircle}>
                        <Ionicons name="checkmark-done" size={30} color="#10b981" />
                    </View>
                    <View>
                        <Text style={styles.reminderTitle}>All Clear!</Text>
                        <Text style={styles.reminderSubtitle}>No scheduled medications.</Text>
                    </View>
                </View>
            )}

            {/* Menu Options */}
            <View style={styles.menuContainer}>
                <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/dashboard-mga-gamot')}>
                    <View style={[styles.menuIconBox, { backgroundColor: '#dbeafe' }]}>
                        <Ionicons name="medkit-outline" size={24} color="#2563eb" />
                    </View>
                    <View style={styles.menuTextContainer}>
                        <Text style={styles.menuTitle}>Mga Gamot</Text>
                        <Text style={styles.menuSubtitle}>View Your Medications</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#3b82f6" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/dashboard-presyon')}>
                    <View style={[styles.menuIconBox, { backgroundColor: '#dbeafe' }]}>
                        <Ionicons name="pulse-outline" size={24} color="#2563eb" />
                    </View>
                    <View style={styles.menuTextContainer}>
                        <Text style={styles.menuTitle}>Presyon at Sugar</Text>
                        <Text style={styles.menuSubtitle}>Blood pressure & glucose</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#3b82f6" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/dashboard-appointment')}>
                    <View style={[styles.menuIconBox, { backgroundColor: '#dbeafe' }]}>
                        <Ionicons name="calendar-outline" size={24} color="#2563eb" />
                    </View>
                    <View style={styles.menuTextContainer}>
                        <Text style={styles.menuTitle}>Appointment sa Doctor</Text>
                        <Text style={styles.menuSubtitle}>Schedule & view appointments</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#3b82f6" />
                </TouchableOpacity>
            </View>

            {/* Footer Button */}
            <TouchableOpacity style={styles.footerButton}>
                <Ionicons name="mic" size={28} color="#fff" style={{ marginRight: 10 }} />
                <Text style={styles.footerButtonText}>Magsalita</Text>
            </TouchableOpacity>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f8fafc', // Very light blue/gray background
    },
    header: {
        backgroundColor: '#3b82f6', // Bright Blue
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
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
    reminderCard: {
        backgroundColor: '#3b82f6',
        margin: 20,
        marginTop: 30,
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    reminderIconCircle: {
        backgroundColor: '#fff',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    reminderTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    reminderSubtitle: {
        color: '#dbeafe', // Light blue text
        fontSize: 14,
    },
    menuContainer: {
        paddingHorizontal: 20,
    },
    menuItem: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#bfdbfe', // Light blue border
    },
    menuIconBox: {
        width: 50,
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    menuTextContainer: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e3a8a', // Dark blue
    },
    menuSubtitle: {
        fontSize: 13,
        color: '#64748b', // Gray
    },
    footerButton: {
        backgroundColor: '#2563eb',
        margin: 20,
        marginTop: 10,
        padding: 18,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    footerButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
});
