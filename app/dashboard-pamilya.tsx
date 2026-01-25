import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PamilyaDashboardScreen() {
    const router = useRouter();
    const { role } = useLocalSearchParams();
    const isCaretaker = role === 'caretaker';

    const themeColor = isCaretaker ? '#a855f7' : '#3b82f6'; // Purple for Caretaker, Blue for Senior

    const FamilyCard = ({ name, relation, status, isOnline }: { name: string, relation: string, status: string, isOnline: boolean }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={[styles.avatarCircle, { backgroundColor: isCaretaker ? '#f3e8ff' : '#dbeafe' }]}>
                    {/* Placeholder for avatar, using icon for now or just initials if image were available */}
                    <MaterialCommunityIcons name="face-man-profile" size={30} color={themeColor} />
                    {/* In a real app we'd use <Image /> */}
                </View>
                <View>
                    <Text style={[styles.nameText, { color: isCaretaker ? '#6b21a8' : '#1e3a8a' }]}>{name} <Text style={styles.relationText}>({relation})</Text></Text>
                    <View style={styles.statusContainer}>
                        <View style={[styles.statusDot, { backgroundColor: isOnline ? '#22c55e' : '#94a3b8' }]} />
                        <Text style={styles.statusText}>{status}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.actionsContainer}>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#22c55e' }]}>
                    <Ionicons name="call" size={20} color="#fff" />
                    <Text style={styles.actionText}>Tawag</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#3b82f6' }]}>
                    <Ionicons name="videocam" size={20} color="#fff" />
                    <Text style={styles.actionText}>Video</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#a855f7' }]}>
                    <Ionicons name="chatbubble-ellipses-outline" size={20} color="#fff" />
                    <Text style={styles.actionText}>Chat</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.mainContainer}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Header */}
                <View style={[styles.header, { backgroundColor: themeColor }]}>
                    <View style={styles.headerTop}>
                        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                            <Text style={styles.backText}>Bumalik</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Ionicons name="help-circle-outline" size={28} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.headerTitle}>Pamilya</Text>
                    <Text style={styles.headerSubtitle}>{isCaretaker ? 'Family Communication - Caretaker' : 'Family Communication'}</Text>
                </View>

                {/* Family Members */}
                <View style={styles.listContainer}>
                    <FamilyCard name="Maria" relation="Anak" status="Available" isOnline={true} />
                    <FamilyCard name="Juan" relation="Apo" status="Available" isOnline={true} />
                    <FamilyCard name="Rosa" relation="Kapatid" status="Offline" isOnline={false} />
                </View>

            </ScrollView>

            {/* Footer Buttons (Fixed at bottom) */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.emergencyButton}>
                    <Ionicons name="call" size={24} color="#fff" style={{ marginRight: 10 }} />
                    <Text style={styles.emergencyText}>Emergency Hotline 911</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.micButton}>
                    <Ionicons name="mic" size={28} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#f0f9ff',
    },
    scrollContainer: {
        paddingBottom: 100, // Space for footer
    },
    header: {
        backgroundColor: '#3b82f6',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 30,
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
        backgroundColor: '#dbeafe', // Placeholder color
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    nameText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e3a8a',
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
    },
    actionText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 2,
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
        backgroundColor: 'transparent', // Or white if you want a background behind buttons
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
});
