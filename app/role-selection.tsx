import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LandingPage() {
    const router = useRouter();

    const selectRole = (role: string) => {
        if (role === 'SENIOR') {
            router.push('/welcome-senior');
        } else {
            router.push('/welcome-caretaker');
        }
    };

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <View style={styles.logoCircle}>
                    <FontAwesome5 name="smile" size={40} color="#fff" />
                </View>
                <Text style={styles.appName}>KALINGA</Text>
                <Text style={styles.subHeader}>Pumili ng Mode</Text>
            </View>

            {/* Senior Mode Card */}
            <TouchableOpacity
                style={styles.cardContainer}
                onPress={() => selectRole('SENIOR')}
                activeOpacity={0.9}
            >
                <LinearGradient
                    colors={['#4facfe', '#00f2fe']}
                    style={styles.card}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <View style={styles.iconContainer}>
                        <FontAwesome5 name="blind" size={40} color="#fff" />
                    </View>
                    <Text style={styles.cardTitle}>Senior Mode</Text>
                    <Text style={styles.cardSubtitle}>Para sa mga</Text>
                    <Text style={styles.cardSubtitle}>Nakatatanda</Text>
                </LinearGradient>
            </TouchableOpacity>

            {/* Caretaker Mode Card */}
            <TouchableOpacity
                style={styles.cardContainer}
                onPress={() => selectRole('CARETAKER')}
                activeOpacity={0.9}
            >
                <LinearGradient
                    colors={['#a18cd1', '#fbc2eb']}
                    style={styles.card}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="face-woman-outline" size={45} color="#fff" />
                    </View>
                    <Text style={styles.cardTitle}>Caretaker Mode</Text>
                    <Text style={styles.cardSubtitle}>Para sa mga</Text>
                    <Text style={styles.cardSubtitle}>Tagapag-alaga</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: 80,
        paddingHorizontal: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 50,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#2b5bf4',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    appName: {
        fontSize: 24,
        fontWeight: '900',
        color: '#1a237e',
        letterSpacing: 1,
    },
    subHeader: {
        fontSize: 16,
        color: '#3498db',
        marginTop: 5,
    },
    cardContainer: {
        width: '100%',
        height: 180,
        marginBottom: 20,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    card: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    iconContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    cardSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
    },
});
