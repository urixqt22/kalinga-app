import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getMedications, Medication } from '../services/medicationStore';

export default function CaretakerScheduleMedicationScreen() {
    const router = useRouter();
    const [medList, setMedList] = useState<Medication[]>([]);

    useFocusEffect(
        useCallback(() => {
            setMedList([...getMedications()]);
        }, [])
    );

    const MedItem = ({ name, dosage, time, status }: { name: string, dosage: string, time: string, status: string }) => (
        <View style={styles.card}>
            <View style={styles.iconCircle}>
                <Ionicons name="time-outline" size={24} color="#a855f7" />
            </View>
            <View>
                <Text style={styles.medName}>{name} {dosage}</Text>
                <Text style={styles.medTime}>{time} • {status}</Text>
            </View>
        </View>
    );

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

                <View style={styles.listContainer}>
                    <View style={styles.listHeader}>
                        <MaterialCommunityIcons name="pill" size={24} color="#a855f7" />
                        <Text style={styles.listTitle}>Medication Logs</Text>
                    </View>

                    {medList.map((med) => (
                        <MedItem key={med.id} name={med.name} dosage={med.dosage} time={med.time} status={med.status} />
                    ))}

                    {medList.length === 0 && (
                        <Text style={{ textAlign: 'center', color: '#9ca3af', marginTop: 20 }}>No scheduled medications.</Text>
                    )}

                </View>

                <TouchableOpacity style={styles.addButton} onPress={() => router.push('/caretaker-add-medication')}>
                    <MaterialCommunityIcons name="pill" size={24} color="#fff" style={{ marginRight: 10 }} />
                    <Text style={styles.addButtonText}>Schedule Medication</Text>
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
        flex: 1,
    },
    listContainer: {
        borderWidth: 1,
        borderColor: '#a855f7',
        borderRadius: 20,
        padding: 20,
        marginBottom: 50,
    },
    listHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 10,
    },
    listTitle: {
        fontSize: 16,
        color: '#6b7280',
    },
    card: {
        backgroundColor: '#faf5ff',
        padding: 20,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        elevation: 1,
    },
    iconCircle: {
        marginRight: 15,
    },
    medName: {
        fontSize: 14,
        color: '#6b7280',
    },
    medTime: {
        fontSize: 12,
        color: '#d8b4fe',
    },
    addButton: {
        backgroundColor: '#a855f7',
        padding: 18,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 30,
        left: 50,
        right: 50,
        elevation: 5,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
