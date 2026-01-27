import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SerbisyoDashboardScreen() {
    const router = useRouter();

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                    <Text style={styles.backText}>Bumalik</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Serbisyo ng Gobyerno</Text>
                <Text style={styles.headerSubtitle}>Government Services</Text>
            </View>

            {/* Services List */}
            <View style={styles.listContainer}>

                {/* SSS */}
                <TouchableOpacity style={styles.serviceCard} onPress={() => router.push('/sss-pension')}>
                    <View style={styles.iconBox}>
                        <Ionicons name="card-outline" size={24} color="#2563eb" />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.serviceTitle}>SSS Pension</Text>
                        <Text style={styles.serviceSubtitle}>Check pension status</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#3b82f6" />
                </TouchableOpacity>

                {/* PhilHealth */}
                <TouchableOpacity style={styles.serviceCard}>
                    <View style={styles.iconBox}>
                        <Ionicons name="person" size={24} color="#2563eb" />
                        <View style={styles.heartBadge}>
                            <Ionicons name="heart" size={10} color="#fff" />
                        </View>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.serviceTitle}>PhilHealth</Text>
                        <Text style={styles.serviceSubtitle}>Health insurance info</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#3b82f6" />
                </TouchableOpacity>

                {/* DSWD */}
                <TouchableOpacity style={styles.serviceCard}>
                    <View style={styles.iconBox}>
                        <MaterialCommunityIcons name="hand-heart" size={24} color="#2563eb" />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.serviceTitle}>DSWD Programs</Text>
                        <Text style={styles.serviceSubtitle}>Social welfare services</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#3b82f6" />
                </TouchableOpacity>

            </View>

            {/* Footer Button */}
            <TouchableOpacity style={styles.footerButton}>
                <Ionicons name="mic" size={28} color="#fff" style={{ marginRight: 10 }} />
                <Text style={styles.footerButtonText}>Magsalita</Text>
            </TouchableOpacity>

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
        borderBottomLeftRadius: 0,
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
        fontSize: 26, // Slightly clearer
        fontWeight: 'bold',
    },
    headerSubtitle: {
        color: '#dbeafe',
        fontSize: 16,
        marginTop: 5,
    },
    listContainer: {
        padding: 20,
        marginTop: 20,
    },
    serviceCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#bfdbfe',
    },
    iconBox: {
        backgroundColor: '#dbeafe',
        width: 50,
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        position: 'relative',
    },
    heartBadge: {
        position: 'absolute',
        bottom: 12,
        right: 12,
    },
    textContainer: {
        flex: 1,
    },
    serviceTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e3a8a',
    },
    serviceSubtitle: {
        fontSize: 14,
        color: '#3b82f6',
    },
    footerButton: {
        backgroundColor: '#2563eb',
        margin: 20,
        marginTop: 10,
        padding: 18,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    footerButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
});
