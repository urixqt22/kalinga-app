import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function NotificationsDashboardScreen() {
    const router = useRouter();
    const { role } = useLocalSearchParams();
    const isCaretaker = role === 'caretaker';

    const themeColor = isCaretaker ? '#a855f7' : '#3b82f6'; // Purple for Caretaker, Blue for Senior

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={themeColor} />
                    <Text style={[styles.backText, { color: themeColor }]}>Bumalik</Text>
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: themeColor }]}>Notification</Text>
            </View>

            {/* Notification List */}
            <View style={styles.listContainer}>

                <View style={[styles.notificationCard, { backgroundColor: themeColor }]}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="notifications-outline" size={30} color="#fff" />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.notificationTitle}>Caretaker scheduled medication.</Text>
                        <Text style={styles.notificationTime}>10:00 AM</Text>
                    </View>
                </View>

                <View style={[styles.notificationCard, { backgroundColor: themeColor }]}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="notifications-outline" size={30} color="#fff" />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.notificationTitle}>Caretaker appointed a doctor visit.</Text>
                        <Text style={styles.notificationTime}>10:00 AM</Text>
                    </View>
                </View>

                {/* Example notification for Caretaker view (simulated based on screenshots) */}
                {isCaretaker && (
                    <View style={[styles.notificationCard, { backgroundColor: themeColor }]}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="notifications-outline" size={30} color="#fff" />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.notificationTitle}>Lolo Moises has taken medication.</Text>
                            <Text style={styles.notificationTime}>10:00 AM</Text>
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
        backgroundColor: '#f8fafc',
    },
    header: {
        backgroundColor: '#fff',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    backText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    listContainer: {
        padding: 20,
    },
    notificationCard: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    iconCircle: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        width: 50,
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    notificationTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    notificationTime: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
    },
});
