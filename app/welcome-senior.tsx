import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeSeniorScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#2563eb" />
                <Text style={styles.backText}>Bumalik</Text>
            </TouchableOpacity>

            <View style={styles.logoContainer}>
                <View style={styles.logoCircle}>
                    <Ionicons name="heart" size={60} color="#fff" />
                    <View style={styles.smileIcon}>
                        <Ionicons name="happy" size={35} color="#2563eb" />
                    </View>
                </View>
                <Text style={styles.appName}>KALINGA</Text>
                <Text style={styles.tagline}>Empowering Seniors with</Text>
                <Text style={styles.tagline}>Care and Connection</Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => router.push('/login-senior')}
                >
                    <Text style={styles.loginButtonText}>Mag-login (Login)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.registerButton}
                    onPress={() => router.push('/register-senior')}
                >
                    <Text style={styles.registerButtonText}>Mag-rehistro (Register)</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.sosButton} onPress={() => router.push('/emergency')}>
                <Text style={styles.sosText}>EMERGENCY SOS</Text>
            </TouchableOpacity>
            <Text style={styles.sosSubtext}>Tap for immediate help / Tapikin para sa tulong</Text>

            <Text style={styles.version}>Version 1.0.0</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: 100,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        paddingBottom: 40,
    },
    logoContainer: {
        alignItems: 'center',
    },
    logoCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#2563eb', // Blue
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        elevation: 5,
    },
    smileIcon: {
        position: 'absolute',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 2,
    },
    appName: {
        fontSize: 28,
        fontWeight: '900',
        color: '#2563eb',
        marginBottom: 5,
        letterSpacing: 1,
    },
    tagline: {
        fontSize: 14,
        color: '#2563eb',
        opacity: 0.8,
    },
    buttonContainer: {
        width: '100%',
        gap: 15,
        marginBottom: 20,
    },
    loginButton: {
        backgroundColor: '#2563eb',
        width: '100%',
        padding: 18,
        borderRadius: 30,
        alignItems: 'center',
        elevation: 3,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    registerButton: {
        backgroundColor: '#2563eb', // Detailed design shows same color or slightly lighter? Sticking to primary for consistency or checking image. 
        // Image shows lighter blue/purple for registers sometimes, but let's stick to primary based on "LOGIN 2" image which shows both blue.
        // Actually looking at "LOGIN 2" image (step 77), the buttons are both blue.
        width: '100%',
        padding: 18,
        borderRadius: 30,
        alignItems: 'center',
        elevation: 3,
        opacity: 0.9,
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    sosButton: {
        backgroundColor: '#ef4444', // Red
        width: '90%',
        padding: 15,
        borderRadius: 30,
        alignItems: 'center',
        elevation: 5,
        marginBottom: 5,
    },
    sosText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '900',
    },
    sosSubtext: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 20,
    },
    version: {
        fontSize: 12,
        color: '#9ca3af',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 10,
    },
    backText: {
        color: '#2563eb',
        fontSize: 16,
        marginLeft: 5,
        fontWeight: '600',
    },
});
