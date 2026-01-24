import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Alert } from 'react-native';
import { getUserRole, loginUser, logoutUser } from '../services/auth';

export default function LoginCaretakerScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const email = name.replace(/\s+/g, '').toLowerCase() + "@placeholder.com";
            const user = await loginUser(email, password);

            // Verifying Role
            const role = await getUserRole(user.uid);

            if (role === 'CARETAKER') {
                router.replace('/dashboard-caretaker');
            } else {
                await logoutUser();
                Alert.alert("Access Denied", "This account is registered as a Senior. Please use the Senior login.");
            }
        } catch (error: any) {
            console.error("Login Error:", error);
            if (error.message.includes("client is offline") || error.code === 'unavailable') {
                Alert.alert("Connection Error", "You seem to be offline. Please check your internet connection.");
            } else {
                Alert.alert("Login Failed", "Invalid name or password. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Back Button */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#a855f7" />
                    <Text style={styles.backText}>Bumalik</Text>
                </TouchableOpacity>
            </View>

            {/* Logo Section */}
            <View style={styles.logoSection}>
                <View style={styles.logoCircle}>
                    <Ionicons name="heart" size={50} color="#fff" />
                    <View style={styles.smileIcon}>
                        <Ionicons name="happy" size={30} color="#a855f7" />
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

                <TouchableOpacity
                    style={[styles.loginButton, isLoading && { opacity: 0.7 }]}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Text style={styles.loginButtonText}>Loading...</Text>
                    ) : (
                        <Text style={styles.loginButtonText}>Login</Text>
                    )}
                </TouchableOpacity>

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
        color: '#a855f7', // Purple
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
        backgroundColor: '#a855f7', // Purple
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
        color: '#a855f7', // Purple
        marginBottom: 5,
        letterSpacing: 1,
    },
    tagline: {
        fontSize: 14,
        color: '#a855f7', // Purple
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
        backgroundColor: '#a855f7', // Purple
        borderRadius: 25,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
        elevation: 3,
        shadowColor: '#a855f7',
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
        color: '#a855f7', // Purple
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '500',
    },
});
