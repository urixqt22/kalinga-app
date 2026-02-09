import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DSWDScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        if (params.data) {
            try {
                const parsedData = JSON.parse(params.data as string);
                setData(parsedData);
            } catch (e) {
                console.error("Error parsing passed data:", e);
            }
        }
        setTimeout(() => setLoading(false), 500);
    }, [params.data]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2563eb" />
                <Text>Checking programs...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                    <Text style={styles.backText}>Bumalik</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>DSWD Programs</Text>
                <Text style={styles.headerSubtitle}>Social Welfare Services</Text>
            </View>

            <View style={styles.content}>
                {data ? (
                    <View style={styles.statusCard}>
                        <View style={styles.statusIcon}>
                            <Ionicons name="checkmark-circle" size={50} color="#22c55e" />
                        </View>
                        <Text style={styles.statusTitle}>Enrolled Program</Text>
                        <Text style={[styles.statusValue, { color: '#22c55e' }]}>Social Pension</Text>

                        <View style={styles.detailRow}>
                            <Text style={styles.label}>Beneficiary ID:</Text>
                            <Text style={styles.value}>{data.id || "DSWD-SP-001"}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.label}>Stipend Status:</Text>
                            <Text style={styles.value}>RELEASED</Text>
                        </View>
                    </View>
                ) : (
                    // INFO VIEW
                    <View style={styles.cardContainer}>
                        {/* Requirements Section */}
                        <Text style={styles.sectionHeader}>Available Programs</Text>
                        <View style={styles.listContainer}>
                            <View style={styles.listItem}>
                                <Ionicons name="information-circle-outline" size={20} color="#2563eb" />
                                <Text style={styles.listText}>Social Pension for Indigent Senior Citizens</Text>
                            </View>
                            <View style={styles.listItem}>
                                <Ionicons name="information-circle-outline" size={20} color="#2563eb" />
                                <Text style={styles.listText}>Centenarian Gift (100 Years Old)</Text>
                            </View>
                            <View style={styles.listItem}>
                                <Ionicons name="information-circle-outline" size={20} color="#2563eb" />
                                <Text style={styles.listText}>Assistance to Individuals in Crisis (AICS)</Text>
                            </View>
                        </View>

                        {/* Steps Section */}
                        <Text style={[styles.sectionHeader, styles.stepsHeader]}>Paano Mag-register (Steps)</Text>
                        <View style={styles.listContainer}>
                            <View style={styles.listItem}>
                                <Text style={styles.stepNumber}>1.</Text>
                                <Text style={styles.listText}>Pumunta sa Municipal Social Welfare Office (MSWDO).</Text>
                            </View>
                            <View style={styles.listItem}>
                                <Text style={styles.stepNumber}>2.</Text>
                                <Text style={styles.listText}>Mag-request ng assessment o interview.</Text>
                            </View>
                            <View style={styles.listItem}>
                                <Text style={styles.stepNumber}>3.</Text>
                                <Text style={styles.listText}>I-submit ang mga requirements (Valid ID, Certificate of Indigency).</Text>
                            </View>
                        </View>

                        {/* Buttons */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.downloadButton}
                                onPress={() => Linking.openURL('https://car.dswd.gov.ph/programs-services/protective-services-program/social-pension-program-for-indigent-senior-citizens/')}
                            >
                                <Text style={styles.downloadButtonText}>Check More Programs</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.locateButton}
                                onPress={() => Linking.openURL('https://www.google.com/maps/search/?api=1&query=DSWD+Field+Office+near+me')}
                            >
                                <Ionicons name="location-outline" size={20} color="#3b82f6" />
                                <Text style={styles.locateButtonText}>Locate Office</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f0f9ff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        backgroundColor: '#3b82f6',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    backText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 5,
        fontSize: 16,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 26,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        color: '#dbeafe',
        fontSize: 14,
        marginTop: 5,
    },
    content: {
        paddingHorizontal: 20,
        marginTop: 60,
    },
    cardContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 25,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 15,
    },
    stepsHeader: {
        marginTop: 25,
        textDecorationLine: 'underline',
    },
    listContainer: {
        gap: 10,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    listText: {
        color: '#334155',
        fontSize: 15,
        marginLeft: 10,
        flex: 1,
        lineHeight: 22,
    },
    stepNumber: {
        fontWeight: 'bold',
        color: '#334155',
        fontSize: 15,
        width: 20,
    },
    buttonContainer: {
        marginTop: 40,
        gap: 15,
        alignItems: 'center',
    },
    downloadButton: {
        backgroundColor: '#3b82f6',
        width: '100%',
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
    },
    downloadButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    locateButton: {
        backgroundColor: '#fff',
        width: '100%',
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#3b82f6',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 5,
    },
    locateButtonText: {
        color: '#3b82f6',
        fontWeight: 'bold',
        fontSize: 16,
    },
    statusCard: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        elevation: 4,
    },
    statusIcon: {
        marginBottom: 15,
    },
    statusTitle: {
        fontSize: 18,
        color: '#64748b',
        marginBottom: 5,
    },
    statusValue: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        paddingBottom: 10,
    },
    label: {
        color: '#64748b',
        fontSize: 16,
    },
    value: {
        color: '#1e293b',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
