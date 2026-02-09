import { AdaptiveButton } from '@/components/AdaptiveButton';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CopilotStep, walkthroughable } from 'react-native-copilot';
import { auth } from '../configs/firebase';
import { getLinkedElder } from '../services/connection';
import { addFamilyContact, deleteFamilyContact, FamilyContact, getFamilyContactsRealtime } from '../services/family';

const WalkthroughableView = walkthroughable(View);

const FocusedCopilotStep = ({ active, children, ...props }: any) => {
    if (!active) return children;
    return <CopilotStep {...props}>{children}</CopilotStep>;
};

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PamilyaDashboardScreen() {
    const router = useRouter();
    const { role } = useLocalSearchParams();
    const isCaretaker = role === 'caretaker';
    const isSenior = !isCaretaker; // Helper for readability
    const themeColor = isCaretaker ? '#a855f7' : '#3b82f6';
    const textColor = isCaretaker ? '#6b21a8' : '#1e3a8a';
    const isFocused = useIsFocused();
    const insets = useSafeAreaInsets();

    // State
    const [contacts, setContacts] = useState<FamilyContact[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [targetUserId, setTargetUserId] = useState<string | null>(null);

    // Form State
    const [newName, setNewName] = useState('');
    const [newRelation, setNewRelation] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        const fetchTargetUser = async () => {
            if (!auth.currentUser) return;

            if (isCaretaker) {
                const linkedElderId = await getLinkedElder(auth.currentUser.uid);
                if (linkedElderId) {
                    setTargetUserId(linkedElderId);
                } else {
                    console.log("No linked elder found for caretaker.");
                    setLoading(false); // Stop loading if no elder found
                }
            } else {
                setTargetUserId(auth.currentUser.uid);
            }
        };
        fetchTargetUser();
    }, [isCaretaker]);

    useEffect(() => {
        if (!targetUserId) return;

        const unsubscribe = getFamilyContactsRealtime(targetUserId, (fetchedContacts) => {
            setContacts(fetchedContacts);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [targetUserId]);

    const handleAddContact = async () => {
        if (!newName.trim() || !newRelation.trim() || !newPhone.trim()) {
            alert("Please fill in all fields.");
            return;
        }

        if (!targetUserId) return;

        setAdding(true);
        try {
            await addFamilyContact(targetUserId, newName, newRelation, newPhone);
            setModalVisible(false);
            setNewName('');
            setNewRelation('');
            setNewPhone('');
        } catch (error) {
            alert("Failed to add contact.");
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!targetUserId) return;
        try {
            await deleteFamilyContact(targetUserId, id);
        } catch (error) {
            console.error(error);
        }
    }

    const FamilyCard = ({ contact }: { contact: FamilyContact }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={[styles.avatarCircle, { backgroundColor: isCaretaker ? '#f3e8ff' : '#dbeafe' }]}>
                    <MaterialCommunityIcons name="face-man-profile" size={30} color={themeColor} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.nameText, { color: textColor }]}>{contact.name} <Text style={styles.relationText}>({contact.relationship})</Text></Text>
                    <View style={styles.statusContainer}>
                        <View style={[styles.statusDot, { backgroundColor: contact.isOnline ? '#22c55e' : '#94a3b8' }]} />
                        <Text style={styles.statusText}>{contact.isOnline ? 'Available' : 'Offline'}</Text>
                    </View>
                </View>
                {/* Delete Option (Tiny x) */}
                <AdaptiveButton adaptive={!isCaretaker}
                    onPress={() => handleDelete(contact.id)}
                    style={{ padding: 5 }}
                    autoWidth
                    missPadding={15}
                    maxScale={1.2}
                >
                    <Ionicons name="close" size={16} color="#94a3b8" />
                </AdaptiveButton>
            </View>

            <View style={styles.actionsContainer}>
                <AdaptiveButton adaptive={!isCaretaker}
                    style={[styles.actionButton, { backgroundColor: '#22c55e' }]}
                    containerStyle={{ flex: 1 }}
                    onPress={() => { }}
                    missPadding={10}
                    maxScale={1.05}
                >
                    <Ionicons name="call" size={20} color="#fff" />
                    <Text style={styles.actionText}> Tawag</Text>
                </AdaptiveButton>

                <AdaptiveButton adaptive={!isCaretaker}
                    style={[styles.actionButton, { backgroundColor: '#3b82f6' }]}
                    containerStyle={{ flex: 1 }}
                    onPress={() => { }}
                    missPadding={10}
                    maxScale={1.05}
                >
                    <Ionicons name="videocam" size={20} color="#fff" />
                    <Text style={styles.actionText}> Video</Text>
                </AdaptiveButton>

                <AdaptiveButton adaptive={!isCaretaker}
                    style={[styles.actionButton, { backgroundColor: themeColor }]}
                    containerStyle={{ flex: 1 }}
                    onPress={() => { }}
                    missPadding={10}
                    maxScale={1.05}
                >
                    <Ionicons name="chatbubble-ellipses-outline" size={20} color="#fff" />
                    <Text style={styles.actionText}> Chat</Text>
                </AdaptiveButton>
            </View >
        </View >
    );

    const hasContacts = contacts.length > 0;
    const emergencyOrder = hasContacts ? 3 : 2;
    const micOrder = hasContacts ? 4 : 3;
    const backOrder = hasContacts ? 5 : 4;

    return (
        <View style={styles.mainContainer}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Header */}
                <View style={[styles.header, { backgroundColor: themeColor }]}>
                    <View style={styles.headerTop}>
                        {/* Back Button - Step 4 or 5 */}
                        <FocusedCopilotStep active={isFocused && isSenior && !modalVisible} text="Pindutin dito para bumalik." order={backOrder} name="back-btn">
                            <WalkthroughableView style={{ alignSelf: 'flex-start' }}>
                                <AdaptiveButton adaptive={!isCaretaker}
                                    style={styles.backButton}
                                    onPress={() => router.back()}
                                    autoWidth
                                    missPadding={20}
                                    maxScale={1.1}
                                >
                                    <Ionicons name="arrow-back" size={24} color="#fff" />
                                    <Text style={styles.backText}>Bumalik</Text>
                                </AdaptiveButton>
                            </WalkthroughableView>
                        </FocusedCopilotStep>

                        <FocusedCopilotStep active={isFocused && isSenior && !modalVisible && hasContacts} text="Pindutin dito para magdagdag ng miyembro ng pamilya." order={2} name="top-right-add-btn">
                            <WalkthroughableView>
                                <AdaptiveButton adaptive={!isCaretaker}
                                    onPress={() => setModalVisible(true)}
                                    autoWidth
                                    missPadding={20}
                                    maxScale={1.1}
                                >
                                    <Ionicons name="person-add" size={24} color="#fff" />
                                </AdaptiveButton>
                            </WalkthroughableView>
                        </FocusedCopilotStep>
                    </View>
                    <Text style={styles.headerTitle}>Pamilya</Text>
                    <Text style={styles.headerSubtitle}>{isCaretaker ? 'Family Communication - Caretaker' : 'Family Communication'}</Text>
                </View >

                {/* Family Members List */}
                < View style={styles.listContainer} >
                    {
                        loading ? (
                            <ActivityIndicator size="large" color={themeColor} />
                        ) : (
                            <>
                                {contacts.length === 0 ? (
                                    <View style={styles.emptyState}>
                                        <MaterialCommunityIcons name="account-group-outline" size={60} color="#ccc" />
                                        <Text style={styles.emptyText}>No family members added yet.</Text>

                                        {/* Add Member Button - Step 1 (Empty State) */}
                                        <FocusedCopilotStep active={isFocused && isSenior && !modalVisible} text="Pindutin dito para magdagdag ng miyembro ng pamilya." order={1} name="add-member-btn">
                                            <WalkthroughableView>
                                                <AdaptiveButton adaptive={!isCaretaker}
                                                    style={[styles.addButton, { backgroundColor: themeColor }]}
                                                    containerStyle={{ alignSelf: 'center' }}
                                                    onPress={() => setModalVisible(true)}
                                                    missPadding={15}
                                                    maxScale={1.05}
                                                    autoWidth
                                                >
                                                    <Text style={styles.addButtonText}>Add Member</Text>
                                                </AdaptiveButton>
                                            </WalkthroughableView>
                                        </FocusedCopilotStep>
                                    </View >
                                ) : (
                                    contacts.map((contact, index) => {
                                        // Wrap first contact - Step 1 (Has Contacts)
                                        if (index === 0) {
                                            return (
                                                <FocusedCopilotStep key={contact.id} active={isFocused && isSenior && !modalVisible} text="Dito makikita ang iyong pamilya at ang kanilang status." order={1} name="first-contact-card">
                                                    <WalkthroughableView>
                                                        <FamilyCard contact={contact} />
                                                    </WalkthroughableView>
                                                </FocusedCopilotStep>
                                            );
                                        }
                                        return <FamilyCard key={contact.id} contact={contact} />;
                                    })
                                )}
                            </>
                        )}
                </View >

            </ScrollView >

            {/* Footer Buttons */}
            < View style={styles.footer} >
                {/* Emergency Button - Step 2 or 3 */}
                <FocusedCopilotStep active={isFocused && isSenior && !modalVisible} text="Pindutin dito para tumawag sa emergency hotline." order={emergencyOrder} name="emergency-btn">
                    <WalkthroughableView style={{ flex: 1 }}>
                        <AdaptiveButton adaptive={!isCaretaker}
                            style={styles.emergencyButton}
                            containerStyle={{ width: '100%' }} // Ensure fill
                            onPress={() => { }}
                            missPadding={15}
                            maxScale={1.05}
                        >
                            <Ionicons name="call" size={24} color="#fff" style={{ marginRight: 10 }} />
                            <Text style={styles.emergencyText}>Emergency Hotline 911</Text>
                        </AdaptiveButton>
                    </WalkthroughableView>
                </FocusedCopilotStep>

                {/* Mic Button - Step 3 or 4 */}
                <FocusedCopilotStep active={isFocused && isSenior && !modalVisible} text="Pindutin at magsalita para sa iba pang tulong." order={micOrder} name="mic-btn">
                    <WalkthroughableView>
                        <AdaptiveButton adaptive={!isCaretaker}
                            style={styles.micButton}
                            onPress={() => { }}
                            missPadding={15}
                            maxScale={1.1}
                            autoWidth
                        >
                            <Ionicons name="mic" size={28} color="#fff" />
                        </AdaptiveButton>
                    </WalkthroughableView>
                </FocusedCopilotStep>
            </View >

            {/* Add Contact Modal */}
            < Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={[styles.modalTitle, { color: themeColor }]}>Add Family Member</Text>

                        <Text style={styles.label}>Name</Text>
                        <FocusedCopilotStep active={isFocused && isSenior && modalVisible} text="Ilagay dito ang pangalan ng miyembro ng pamilya." order={1} name="modal-input-name">
                            <WalkthroughableView>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. Maria"
                                    value={newName}
                                    onChangeText={setNewName}
                                />
                            </WalkthroughableView>
                        </FocusedCopilotStep>

                        <Text style={styles.label}>Relationship (e.g. Anak, Apo)</Text>
                        <FocusedCopilotStep active={isFocused && isSenior && modalVisible} text="Ilagay dito kung ano mo siya (halimbawa: Anak, Apo)." order={2} name="modal-input-relation">
                            <WalkthroughableView>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. Anak"
                                    value={newRelation}
                                    onChangeText={setNewRelation}
                                />
                            </WalkthroughableView>
                        </FocusedCopilotStep>

                        <Text style={styles.label}>Phone Number</Text>
                        <FocusedCopilotStep active={isFocused && isSenior && modalVisible} text="Ilagay dito ang kanilang numero ng telepono." order={3} name="modal-input-phone">
                            <WalkthroughableView>
                                <TextInput
                                    style={styles.input}
                                    placeholder="0917..."
                                    keyboardType="phone-pad"
                                    value={newPhone}
                                    onChangeText={setNewPhone}
                                />
                            </WalkthroughableView>
                        </FocusedCopilotStep>

                        <View style={styles.modalButtons}>
                            <FocusedCopilotStep active={isFocused && isSenior && modalVisible} text="Pindutin ito kung ayaw mong ituloy." order={5} name="modal-btn-cancel">
                                <WalkthroughableView style={{ flex: 1 }}>
                                    <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                        <Text style={styles.cancelButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                </WalkthroughableView>
                            </FocusedCopilotStep>

                            <FocusedCopilotStep active={isFocused && isSenior && modalVisible} text="Pindutin ito para i-save ang impormasyon." order={4} name="modal-btn-save">
                                <WalkthroughableView style={{ flex: 1 }}>
                                    <TouchableOpacity
                                        style={[styles.saveButton, { backgroundColor: themeColor }]}
                                        onPress={handleAddContact}
                                        disabled={adding}
                                    >
                                        {adding ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Save</Text>}
                                    </TouchableOpacity>
                                </WalkthroughableView>
                            </FocusedCopilotStep>
                        </View>
                    </View>
                </View>
            </Modal >
        </View >
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#f0f9ff',
    },
    scrollContainer: {
        paddingBottom: 100, // Space for footer
        // PaddingTop handled dynamically
    },
    header: {
        // paddingTop: 60, // Handled dynamically in ScrollView
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        zIndex: 10,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
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
    listContainer: {
        padding: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#bfdbfe',
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    nameText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    relationText: {
        fontSize: 16,
        fontWeight: 'normal',
        color: '#64748b',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 5,
    },
    statusText: {
        fontSize: 12,
        color: '#64748b',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 5,
    },
    actionText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        paddingBottom: 40, // Add padding for bottom navigation bar
        backgroundColor: '#f0f9ff', // Ensure background covers behind nav bar if transparent
    },
    emergencyButton: {
        flex: 1,
        backgroundColor: '#ef4444', // Red
        padding: 18,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    emergencyText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    micButton: {
        width: 60,
        height: 60,
        borderRadius: 20,
        backgroundColor: '#2563eb',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 25,
        width: '100%',
        maxWidth: 350,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 5,
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#f1f5f9',
        borderRadius: 12,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
        color: '#1e293b',
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 15,
        marginTop: 10,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#64748b',
        fontWeight: 'bold',
    },
    saveButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    // Empty State
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 50,
        gap: 15,
    },
    emptyText: {
        color: '#94a3b8',
        fontSize: 16,
    },
    addButton: {
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 25,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
