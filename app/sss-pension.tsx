import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../configs/firebase';
import { getPensionApplicationStatus, SSSApplication } from '../services/sss';

export default function SSSPensionScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [loading, setLoading] = useState(true);
    const [application, setApplication] = useState<SSSApplication | null>(null);

    useEffect(() => {
        const initialize = async () => {
            // 1. Check if data was passed from the previous screen (Mock Data)
            if (params.data) {
                try {
                    const parsedData = JSON.parse(params.data as string);
                    setApplication(parsedData);
                    setLoading(false);
                    return;
                } catch (e) {
                    console.error("Error parsing passed data:", e);
                }
            }

            // 2. Fallback: Fetch from Firebase (or Mock if preferred default)
            if (auth.currentUser) {
                try {
                    const data = await getPensionApplicationStatus(auth.currentUser.uid);
                    setApplication(data);
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        initialize();
    }, [params.data]);



    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2563eb" />
                <Text>Checking record...</Text>
            </View>
        );
    }

    return (
        <>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                        <Text style={styles.backText}>Bumalik</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>SSS Retirement Pension</Text>
                    <Text style={styles.headerSubtitle}>Social Security System</Text>
                </View>

                <View style={styles.content}>

                    {application ? (
                        // VIEW STATUS
                        <View style={styles.statusCard}>
                            <View style={styles.statusIcon}>
                                {application.status === 'pending' && <Ionicons name="time" size={50} color="#f59e0b" />}
                                {application.status === 'approved' && <Ionicons name="checkmark-circle" size={50} color="#22c55e" />}
                                {application.status === 'rejected' && <Ionicons name="close-circle" size={50} color="#ef4444" />}
                            </View>
                            <Text style={styles.statusTitle}>Application Status</Text>
                            <Text style={[styles.statusValue,
                            application.status === 'pending' ? { color: '#f59e0b' } :
                                application.status === 'approved' ? { color: '#22c55e' } : { color: '#ef4444' }
                            ]}>
                                {application.status.toUpperCase()}
                            </Text>
                            <View style={styles.detailRow}>
                                <Text style={styles.label}>SSS Number:</Text>
                                <Text style={styles.value}>{application.sssNumber}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.label}>Submitted On:</Text>
                                <Text style={styles.value}>
                                    {application.submittedAt?.toDate
                                        ? application.submittedAt.toDate().toLocaleDateString()
                                        : new Date(application.submittedAt as any).toLocaleDateString()}
                                </Text>
                            </View>
                        </View>
                    ) : (
                        // INFO VIEW
                        <View style={styles.cardContainer}>

                            {/* Requirements Section */}
                            <Text style={styles.sectionHeader}>Mga Kailangan (Requirements)</Text>
                            <View style={styles.listContainer}>
                                <View style={styles.listItem}>
                                    <Ionicons name="checkmark-circle-outline" size={20} color="#22c55e" />
                                    <Text style={styles.listText}>SSS ID or UMID card</Text>
                                </View>
                                <View style={styles.listItem}>
                                    <Ionicons name="checkmark-circle-outline" size={20} color="#22c55e" />
                                    <Text style={styles.listText}>Saving Account Number</Text>
                                </View>
                                <View style={styles.listItem}>
                                    <Ionicons name="checkmark-circle-outline" size={20} color="#22c55e" />
                                    <Text style={styles.listText}>Application for Retirement Benefit Form</Text>
                                </View>
                            </View>

                            {/* Steps Section */}
                            <Text style={[styles.sectionHeader, styles.stepsHeader]}>Paano Mag-apply (Steps)</Text>
                            <View style={styles.listContainer}>
                                <View style={styles.listItem}>
                                    <Text style={styles.stepNumber}>1.</Text>
                                    <Text style={styles.listText}>Mag-file online sa My.SSS portal.</Text>
                                </View>
                                <View style={styles.listItem}>
                                    <Text style={styles.stepNumber}>2.</Text>
                                    <Text style={styles.listText}>O magsadya sa pinakamalapit na SSS Branch.</Text>
                                </View>
                                <View style={styles.listItem}>
                                    <Text style={styles.stepNumber}>3.</Text>
                                    <Text style={styles.listText}>I-submit ang mga requirements.</Text>
                                </View>
                            </View>

                            {/* Buttons */}
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={styles.downloadButton}
                                    onPress={() => Linking.openURL('https://formspal.com/pdf-forms/other/sss-pension-form/#action=edit&DocumentUID=b1876738-cac0-4522-8b02-facb68e2b6ad ')}
                                >
                                    <Text style={styles.downloadButtonText}>Download Form</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.locateButton}
                                    onPress={() => Linking.openURL('https://www.google.com/maps/search/?api=1&query=SSS+Branch+near+me')}
                                >
                                    <Ionicons name="location-outline" size={20} color="#3b82f6" />
                                    <Text style={styles.locateButtonText}>Locate Office</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    )}

                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f0f9ff', // Light blue background behind card
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        backgroundColor: '#3b82f6', // Blue Header
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
        marginTop: 60, // Lower the card
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
    // Section Headers
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
    // List Items
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
    // Buttons
    buttonContainer: {
        marginTop: 40,
        gap: 15,
        alignItems: 'center', // Center buttons as per mockup
    },
    downloadButton: {
        backgroundColor: '#3b82f6',
        width: '100%',
        paddingVertical: 15,
        borderRadius: 30, // Fully rounded
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
    // Status Card Styles (Reused/Adapted)
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
