import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../configs/firebase';
import { getMedicationsRealtime, Medication } from '../services/medication';

export default function MgaGamotDashboardScreen() {
    const router = useRouter();
    const [meds, setMeds] = useState<Medication[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth.currentUser) return;

        const unsubscribe = getMedicationsRealtime(auth.currentUser.uid, (fetchedMeds) => {
            // Sort by time roughly (AM/PM) - a simple string sort might suffice for MVP or we parse it
            // Let's rely on simple string sort for now or implement a quick custom sort
            // "08:00 AM", "12:00 PM"
            // Simple generic sort:
            const sorted = fetchedMeds.sort((a, b) => {
                // Parse "HH:mm AM/PM" roughly
                const parseTime = (t: string) => {
                    const [time, modifier] = t.split(' ');
                    let [hours, minutes] = time.split(':');
                    if (hours === '12') hours = '00';
                    if (modifier === 'PM') hours = String(parseInt(hours, 10) + 12);
                    return `${hours}${minutes}`;
                };
                return parseTime(a.time).localeCompare(parseTime(b.time));
            });
            setMeds(sorted);
            setLoading(false);
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
                <Text style={styles.headerTitle}>Mga Gamot</Text>
                <Text style={styles.headerSubtitle}>View Your Medications</Text>
            </View>

            {/* Next Up Card - Logic: Find first 'Scheduled' med */}
            {meds.length > 0 && (
                <View style={styles.nextUpCard}>
                    <View style={styles.nextUpIconCircle}>
                        <Ionicons name="notifications" size={30} color="#fff" />
                    </View>
                    <View>
                        <Text style={styles.nextUpTitle}>Next Up: {meds[0].name} {meds[0].dosage}</Text>
                        <Text style={styles.nextUpSubtitle}>{meds[0].time}</Text>
                    </View>
                </View>
            )}

            {/* Medication List */}
            <View style={styles.listContainer}>
                {loading ? (
                    <ActivityIndicator size="large" color="#3b82f6" />
                ) : (
                    <>
                        {meds.map((med) => (
                            <View key={med.id} style={styles.medCard}>
                                <View style={styles.medIconBox}>
                                    <MaterialCommunityIcons name="pill" size={24} color="#3b82f6" />
                                </View>
                                <View>
                                    <Text style={styles.medName}>{med.name} {med.dosage}</Text>
                                    <Text style={styles.medTime}>{med.time}</Text>
                                </View>
                            </View>
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
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f0f9ff', // Light blue bg
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
});
