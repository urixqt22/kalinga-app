import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PresyonDashboardScreen() {
    const router = useRouter();

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                    <Text style={styles.backText}>Bumalik</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Presyon At Sugar</Text>
                <Text style={styles.headerSubtitle}>History of Blood Pressure & Glucose</Text>
            </View>

            {/* Today's Vitals Card */}
            <View style={styles.vitalsCard}>
                <View style={styles.vitalsHeader}>
                    <MaterialCommunityIcons name="heart-pulse" size={24} color="#2563eb" />
                    <Text style={styles.vitalsTitle}>Today's Vitals</Text>
                </View>

                <View style={styles.statsContainer}>
                    {/* BP Card */}
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Blood Pressure</Text>
                        <Text style={styles.statValue}>120/80</Text>
                        <Text style={styles.statStatus}>Normal</Text>
                    </View>

                    {/* Sugar Card */}
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Blood Sugar</Text>
                        <Text style={styles.statValue}>95 mg/dL</Text>
                        <Text style={styles.statStatus}>Normal</Text>
                    </View>
                </View>
            </View>

            {/* History List */}
            <View style={styles.listContainer}>

                {/* Item 1 */}
                <View style={styles.historyCard}>
                    <View style={styles.historyIconBox}>
                        <MaterialCommunityIcons name="pulse" size={24} color="#3b82f6" />
                    </View>
                    <View style={styles.historyContent}>
                        <View style={styles.historyRow}>
                            <Text style={styles.historyMainText}>BP: 120/80</Text>
                            <Text style={styles.historyDate}>Yesterday, 8:15 AM</Text>
                        </View>
                        <View style={styles.historyRow}>
                            <Text style={styles.historySubText}>Sugar: 100 mg/dL</Text>
                            <Text style={styles.statusNormal}>Normal</Text>
                        </View>
                    </View>
                </View>

                {/* Item 2 */}
                <View style={styles.historyCard}>
                    <View style={styles.historyIconBox}>
                        <MaterialCommunityIcons name="pulse" size={24} color="#3b82f6" />
                    </View>
                    <View style={styles.historyContent}>
                        <View style={styles.historyRow}>
                            <Text style={styles.historyMainText}>BP: 135/85</Text>
                            <Text style={styles.historyDate}>Yesterday, 8:15 AM</Text>
                        </View>
                        <View style={styles.historyRow}>
                            <Text style={styles.historySubText}>Sugar: 110 mg/dL</Text>
                            <Text style={styles.statusElevated}>Elevated</Text>
                        </View>
                    </View>
                </View>

                {/* Item 3 */}
                <View style={styles.historyCard}>
                    <View style={styles.historyIconBox}>
                        <MaterialCommunityIcons name="pulse" size={24} color="#3b82f6" />
                    </View>
                    <View style={styles.historyContent}>
                        <View style={styles.historyRow}>
                            <Text style={styles.historyMainText}>BP: 118/79</Text>
                            <Text style={styles.historyDate}>Yesterday, 8:15 AM</Text>
                        </View>
                        <View style={styles.historyRow}>
                            <Text style={styles.historySubText}>Sugar: 98 mg/dL</Text>
                            <Text style={styles.statusNormal}>Normal</Text>
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
