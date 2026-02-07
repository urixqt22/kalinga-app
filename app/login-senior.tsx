import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { AdaptiveButton } from '@/components/AdaptiveButton';
import { Alert } from 'react-native';
import { getEmailByName, getUserRole, loginUser, logoutUser } from '../services/auth';

export default function LoginSeniorScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            // 1. Try to find the correct email from Firestore first
            let email = await getEmailByName(name);

            // 2. Fallback: If not found (or offline), reconstruct the placeholder
            if (!email) {
                console.log("Name not found via lookup, using fallback generation.");
                email = name.replace(/\s+/g, '').toLowerCase() + "@placeholder.com";
            }

            console.log("Attempting login with:", email);

            const user = await loginUser(email, password);

            // Verifying Role
            const role = await getUserRole(user.uid);

            if (role === 'SENIOR') {
                router.replace('/dashboard-senior');
            } else {
                await logoutUser();
                Alert.alert("Access Denied", "This account is registered as a Caretaker.");
            }
        } catch (error: any) {
            console.error("Login Error:", error);
            let message = "Invalid name or password";
            if (error.code === 'auth/invalid-credential') message = "Wrong password or name.";
            if (error.code === 'auth/user-not-found') message = "Account not found.";
            if (error.code === 'auth/too-many-requests') message = "Too many attempts. Resetting...";

            Alert.alert("Login Failed", message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Back Button */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#2563eb" />
                    <Text style={styles.backText}>Bumalik</Text>
                </TouchableOpacity>
            </View>

            {/* Logo Section */}
            <View style={styles.logoSection}>
                <View style={styles.logoCircle}>
                    <Ionicons name="heart" size={50} color="#fff" />
                    <View style={styles.smileIcon}>
                        <Ionicons name="happy" size={30} color="#2563eb" />
                    </View>
                </View>
                <Text style={styles.appName}>KALINGA</Text>
                <Text style={styles.tagline}>Empowering Seniors with</Text>
                <Text style={styles.tagline}>Care and Connection</Text>
            </View>

            {/* Form Section */}
            <View style={styles.formContainer}>
                <Text style={styles.label}>Pangalan(Name)</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder=""
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholder=""
                />

                <AdaptiveButton
                    style={[styles.loginButton, isLoading && { opacity: 0.7 }]}
                    onPress={handleLogin}
                    // disabled={isLoading} // AdaptiveButton updates needed for proper disabled support, relying on handler check for now
                    missPadding={30}
                    maxScale={1.05}
                >
                    {isLoading ? (
                        <Text style={styles.loginButtonText}>Loading...</Text>
                    ) : (
                        <Text style={styles.loginButtonText}>Login</Text>
                    )}
                </AdaptiveButton>

                <TouchableOpacity onPress={() => console.log('Forgot Password')}>
                    <Text style={styles.forgotPassword}>Nakalimutan ang password?</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 60,
    },
    header: {
        marginBottom: 40,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        color: '#2563eb', // Blue
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 5,
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: 50,
    },
    logoCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#2563eb', // Blue
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    smileIcon: {
        position: 'absolute',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 2,
    },
    appName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2563eb', // Blue
        marginBottom: 5,
        letterSpacing: 1,
    },
    tagline: {
        fontSize: 14,
        color: '#2563eb', // Blue
        opacity: 0.8,
        textAlign: 'center',
    },
    formContainer: {
        width: '100%',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#000',
    },
    input: {
        backgroundColor: '#e5e7eb', // Light Gray
        borderRadius: 25,
        height: 55,
        paddingHorizontal: 20,
        fontSize: 16,
        marginBottom: 20,
    },
    loginButton: {
        backgroundColor: '#2563eb', // Blue
        borderRadius: 25,
        height: 55,
        width: '95%',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
        elevation: 3,
        shadowColor: '#2563eb',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    forgotPassword: {
        color: '#2563eb',
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '500',
    },
});
