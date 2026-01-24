import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MgaGamotDashboardScreen() {
    const router = useRouter();

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

            {/* Next Up Card */}
            <View style={styles.nextUpCard}>
                <View style={styles.nextUpIconCircle}>
                    <Ionicons name="notifications" size={30} color="#fff" />
                </View>
                <View>
                    <Text style={styles.nextUpTitle}>Next Up: Losartan 50mg</Text>
                    <Text style={styles.nextUpSubtitle}>10:00 AM</Text>
                </View>
            </View>

            {/* Medication List */}
            <View style={styles.listContainer}>

                <View style={styles.medCard}>
                    <View style={styles.medIconBox}>
                        <MaterialCommunityIcons name="pill" size={24} color="#3b82f6" />
                    </View>
                    <View>
                        <Text style={styles.medName}>Metformin 500mg</Text>
                        <Text style={styles.medTime}>12:00 NN</Text>
                    </View>
                </View>

                <View style={styles.medCard}>
                    <View style={styles.medIconBox}>
                        <MaterialCommunityIcons name="pill" size={24} color="#3b82f6" />
                    </View>
                    <View>
                        <Text style={styles.medName}>Biogesic 500mg</Text>
                        <Text style={styles.medTime}>04:00 PM</Text>
                    </View>
                </View>

                <View style={styles.medCard}>
                    <View style={styles.medIconBox}>
                        <MaterialCommunityIcons name="pill" size={24} color="#3b82f6" />
                    </View>
                    <View>
                        <Text style={styles.medName}>Alaxan FR 10mg</Text>
                        <Text style={styles.medTime}>08:00 PM</Text>
                    </View>
                </View>

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
        borderBottomLeftRadius: 0, // Flat bottom for this designs header? actually looks clean flat or curved. 
        // Screenshot shows standard header style, let's keep consistent with Kalusugan
        // Actually screenshot shows NO curved bottom for this one? 
        // Let's stick to the previous style for consistency but check screenshot carefully.
        // Image 2 shows just flat blue header.
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
