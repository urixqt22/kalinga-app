import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../configs/firebase';
import { removeConnection, sendConnectionRequest } from '../services/connection';

export default function MyElderScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const [linkedElderId, setLinkedElderId] = useState<string | null>(null);
    const [elderName, setElderName] = useState(''); // For display if connected

    // Web Confirmation State
    const [confirmDelete, setConfirmDelete] = useState(false);

    // Form State
    const [searchName, setSearchName] = useState('');
    const [caretakerName, setCaretakerName] = useState('');

    useEffect(() => {
        if (!auth.currentUser) return;

        // Fetch Caretaker Name first
        const fetchCaretaker = async () => {
            if (!auth.currentUser) return;
            const docRef = doc(db, "users", auth.currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setCaretakerName(docSnap.data().name || "Caretaker");
            }
        };
        fetchCaretaker();

        // Listen to Caretaker's User Doc for changes in linkedElders
        const unsub = onSnapshot(doc(db, "users", auth.currentUser.uid), async (docSnap) => {
            if (docSnap.exists()) {
                const userData = docSnap.data();
                const elders = userData.linkedElders || [];

                if (elders.length > 0) {
                    const eId = elders[0];
                    setLinkedElderId(eId);
                    // Fetch Elder Name
                    const elderDoc = await getDoc(doc(db, "users", eId));
                    if (elderDoc.exists()) {
                        setElderName(elderDoc.data().name || "Unknown Elder");
                    }
                } else {
                    setLinkedElderId(null);
                    setElderName('');
                    setConfirmDelete(false); // Reset confirmation if disconnected externally
                }
            }
            setLoading(false);
        });

        return () => unsub();
    }, []);

    const handleAddElder = async () => {
        if (!searchName.trim()) {
            Alert.alert("Error", "Please enter the Elder's name.");
            return;
        }
        if (!auth.currentUser) return;

        setActionLoading(true);
        try {
            const result = await sendConnectionRequest(searchName.trim(), auth.currentUser.uid, caretakerName);
            Alert.alert("Success", `Request sent to ID: ${result.toUserId}\n\nPlease check if this matches the Elder's ID.`);
            setSearchName('');
        } catch (error: any) {
            Alert.alert("Failed", error.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleRemoveElder = async () => {
        if (!auth.currentUser || !linkedElderId) return;

        // Step 1: Request Confirmation (for Web compatibility)
        if (!confirmDelete) {
            setConfirmDelete(true);
            return;
        }

        // Step 2: Proceed with Delete
        setActionLoading(true);
        try {
            await removeConnection(auth.currentUser.uid, linkedElderId);
            // Optimistic update
            setLinkedElderId(null);
            setElderName('');
            setConfirmDelete(false);
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to remove connection: " + error);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#a855f7" />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Elder</Text>
                <Text style={styles.headerSubtitle}>Manage your connection</Text>
            </View>

            <View style={styles.card}>
                <View style={styles.iconCircle}>
                    <Ionicons name="person" size={50} color="#a855f7" />
                </View>

                {linkedElderId ? (
                    // Connected State
                    <View style={styles.connectedContainer}>
                        <Text style={styles.statusTitle}>Connected to</Text>
                        <Text style={styles.elderName}>{elderName}</Text>
                        <Text style={{ fontSize: 12, color: '#9ca3af', marginBottom: 5 }} selectable>ID: {linkedElderId}</Text>
                        <Text style={styles.statusSubtitle}>You are currently monitoring this elder.</Text>

                        {/* Two-step Confirmation UI */}
                        {confirmDelete ? (
                            <View style={{ width: '100%', gap: 10, alignItems: 'center' }}>
                                <Text style={{ textAlign: 'center', color: '#ef4444', fontWeight: 'bold', marginBottom: 5 }}>
                                    Are you sure? This cannot be undone.
                                </Text>
                                <TouchableOpacity
                                    style={[styles.removeButton, { backgroundColor: '#ef4444' }]}
                                    onPress={handleRemoveElder}
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={styles.removeButtonText}>Confirm Remove</Text>
                                    )}
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.removeButton, { backgroundColor: '#6b7280' }]}
                                    onPress={() => setConfirmDelete(false)}
                                    disabled={actionLoading}
                                >
                                    <Text style={styles.removeButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={handleRemoveElder}
                                disabled={actionLoading}
                            >
                                {actionLoading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.removeButtonText}>Remove Elder</Text>
                                )}
                            </TouchableOpacity>
                        )}
                    </View>
                ) : (
                    // No Connection State
                    <View style={styles.formContainer}>
                        <Text style={styles.statusTitle}>No Elder Connected</Text>
                        <Text style={styles.statusSubtitle}>Enter the exact name of the senior to connect.</Text>

                        <Text style={styles.label}>Elder's Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Lolo Moises or User ID"
                            value={searchName}
                            onChangeText={setSearchName}
                        />

                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={handleAddElder}
                            disabled={actionLoading}
                        >
                            {actionLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.addButtonText}>Send Connection Request</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
    },
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
    // Content Card similar to Health Monitor
    card: {
        backgroundColor: '#fff',
        margin: 20,
        borderRadius: 20,
        padding: 30,
        borderWidth: 1,
        borderColor: '#e9d5ff',
        alignItems: 'center',
        elevation: 2,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f3e8ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    // Connected Styles
    connectedContainer: {
        alignItems: 'center',
        width: '100%',
    },
    statusTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6b7280',
        marginBottom: 5,
    },
    elderName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#a855f7',
        marginBottom: 10,
        textAlign: 'center',
    },
    statusSubtitle: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: 30,
    },
    removeButton: {
        backgroundColor: '#ef4444',
        paddingVertical: 15,
        width: '100%',
        borderRadius: 15,
        alignItems: 'center',
    },
    removeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    // Form Styles
    formContainer: {
        width: '100%',
        alignItems: 'center',
    },
    label: {
        alignSelf: 'flex-start',
        fontSize: 14,
        fontWeight: 'bold',
        color: '#374151',
        marginBottom: 10,
        marginTop: 10,
    },
    input: {
        backgroundColor: '#f8fafc',
        width: '100%',
        padding: 15,
        borderRadius: 15,
        fontSize: 16,
        marginBottom: 30,
        color: '#1f2937',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    addButton: {
        backgroundColor: '#a855f7',
        paddingVertical: 15,
        width: '100%',
        borderRadius: 15,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
