import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeCaretakerScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#a855f7" />
                <Text style={styles.backText}>Bumalik</Text>
            </TouchableOpacity>

            <View style={styles.logoContainer}>
                <View style={styles.logoCircle}>
                    <Ionicons name="heart" size={60} color="#fff" />
                    <View style={styles.smileIcon}>
                        <Ionicons name="happy" size={35} color="#a855f7" />
                    </View>
                </View>
                <Text style={styles.appName}>KALINGA</Text>
                <Text style={styles.tagline}>Empowering Seniors with</Text>
                <Text style={styles.tagline}>Care and Connection</Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => router.push('/login-caretaker')}
                >
                    <Text style={styles.loginButtonText}>Mag-login (Login)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.registerButton}
                    onPress={() => router.push('/register-caretaker')}
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
        backgroundColor: '#a855f7', // Purple
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
        color: '#a855f7',
        marginBottom: 5,
        letterSpacing: 1,
    },
    tagline: {
        fontSize: 14,
        color: '#a855f7',
        opacity: 0.8,
    },
    buttonContainer: {
        width: '100%',
        gap: 15,
        marginBottom: 20,
    },
    loginButton: {
        backgroundColor: '#a855f7', // Purple
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
        backgroundColor: '#a855f7', // Slightly lighter purple for register?
        width: '100%',
        padding: 18,
        borderRadius: 30,
        alignItems: 'center',
        elevation: 3,
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
        color: '#a855f7',
        fontSize: 16,
        marginLeft: 5,
        fontWeight: '600',
    },
});
