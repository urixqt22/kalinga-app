import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CopilotStep, walkthroughable } from 'react-native-copilot';
import { auth } from '../configs/firebase';
import { getVitalsRealtime, Vital } from '../services/vitals';

const WalkthroughableView = walkthroughable(View);
const WalkthroughableTouchableOpacity = walkthroughable(TouchableOpacity);

const FocusedCopilotStep = ({ active, children, ...props }: any) => {
    if (!active) return children;
    return <CopilotStep {...props}>{children}</CopilotStep>;
};

export default function PresyonDashboardScreen() {
    const router = useRouter();
    const isFocused = useIsFocused();
    const [vitals, setVitals] = useState<Vital[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth.currentUser) return;

        const unsubscribe = getVitalsRealtime(auth.currentUser.uid, (fetchedVitals) => {
            setVitals(fetchedVitals);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const latestVital = vitals.length > 0 ? vitals[0] : null;

    // Helper to format date
    const formatDate = (timestamp: any) => {
        if (!timestamp) return '';
        const date = timestamp.toDate();
        return date.toLocaleString('en-US', {
            weekday: 'short',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <FocusedCopilotStep active={isFocused} text="Pindutin dito para bumalik." order={3} name="back-btn">
                    <WalkthroughableView style={{ alignSelf: 'flex-start' }}>
                        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                            <Text style={styles.backText}>Bumalik</Text>
                        </TouchableOpacity>
                    </WalkthroughableView>
                </FocusedCopilotStep>
                <Text style={styles.headerTitle}>Presyon At Sugar</Text>
                <Text style={styles.headerSubtitle}>History of Blood Pressure & Glucose</Text>
            </View>

            {loading ? (
                <View style={{ marginTop: 50 }}>
                    <ActivityIndicator size="large" color="#3b82f6" />
                </View>
            ) : (
                <>
                    {/* Today's Vitals Card */}
                    <FocusedCopilotStep active={isFocused} text="Dito mo makikita ang huling sukat ng iyong presyon at sugar." order={1} name="latest-vitals">
                        <WalkthroughableView style={styles.vitalsCard}>
                            <View style={styles.vitalsHeader}>
                                <MaterialCommunityIcons name="heart-pulse" size={24} color="#2563eb" />
                                <Text style={styles.vitalsTitle}>Latest Vitals</Text>
                            </View>

                            <View style={styles.statsContainer}>
                                {/* BP Card */}
                                <View style={styles.statBox}>
                                    <Text style={styles.statLabel}>Blood Pressure</Text>
                                    <Text style={styles.statValue}>{latestVital ? `${latestVital.bpSystolic}/${latestVital.bpDiastolic}` : "--/--"}</Text>
                                    <Text style={styles.statStatus}>{latestVital ? "Recorded" : "No Data"}</Text>
                                </View>

                                {/* Sugar Card */}
                                <View style={styles.statBox}>
                                    <Text style={styles.statLabel}>Blood Sugar</Text>
                                    <Text style={styles.statValue}>{latestVital ? `${latestVital.bloodSugar} mg/dL` : "--"}</Text>
                                    <Text style={styles.statStatus}>{latestVital ? "Recorded" : "No Data"}</Text>
                                </View>
                            </View>
                        </WalkthroughableView>
                    </FocusedCopilotStep>

                    {/* History List */}
                    <FocusedCopilotStep active={isFocused} text="Dito nakalista ang mga nakaraang sukat." order={2} name="history-list">
                        <WalkthroughableView style={styles.listContainer}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#64748b', marginBottom: 15 }}>History</Text>

                            {vitals.map((vital) => (
                                <View key={vital.id} style={styles.historyCard}>
                                    <View style={styles.historyIconBox}>
                                        <MaterialCommunityIcons name="pulse" size={24} color="#3b82f6" />
                                    </View>
                                    <View style={styles.historyContent}>
                                        <View style={styles.historyRow}>
                                            <Text style={styles.historyMainText}>BP: {vital.bpSystolic}/{vital.bpDiastolic}</Text>
                                            <Text style={styles.historyDate}>{formatDate(vital.createdAt)}</Text>
                                        </View>
                                        <View style={styles.historyRow}>
                                            <Text style={styles.historySubText}>Sugar: {vital.bloodSugar} mg/dL</Text>
                                            <Text style={styles.statusNormal}>Recorded</Text>
                                        </View>
                                    </View>
                                </View>
                            ))}

                            {vitals.length === 0 && (
                                <Text style={{ textAlign: 'center', color: '#94a3b8', marginTop: 10 }}>No history available.</Text>
                            )}
                        </WalkthroughableView>
                    </FocusedCopilotStep>
                </>
            )}

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
    vitalsCard: {
        backgroundColor: '#fff',
        margin: 20,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#bfdbfe',
        marginTop: 30,
    },
    vitalsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    vitalsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e3a8a',
        marginLeft: 10,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 15,
    },
    statBox: {
        flex: 1,
        backgroundColor: '#dbeafe',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
    },
    statLabel: {
        color: '#3b82f6',
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 5,
    },
    statValue: {
        color: '#1e3a8a',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    statStatus: {
        color: '#1e3a8a',
        fontSize: 12,
        fontWeight: 'bold',
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 50,
    },
    historyCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#bfdbfe',
    },
    historyIconBox: {
        backgroundColor: '#dbeafe', // Light blue
        width: 50,
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    historyContent: {
        flex: 1,
    },
    historyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    historyMainText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e3a8a',
    },
    historySubText: {
        fontSize: 14,
        color: '#3b82f6',
    },
    historyDate: {
        fontSize: 12,
        color: '#64748b',
    },
    statusNormal: {
        fontSize: 12,
        color: '#22c55e', // Green
        fontWeight: 'bold',
    },
    statusElevated: {
        fontSize: 12,
        color: '#ef4444', // Red
        fontWeight: 'bold',
    },
});
