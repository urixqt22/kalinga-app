import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { registerSenior } from '../services/auth';

export default function RegisterSeniorScreen() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [contact, setContact] = useState('');
    const [gender, setGender] = useState('');
    const [seniorId, setSeniorId] = useState(''); // Text fallback or status
    const [seniorIdImage, setSeniorIdImage] = useState<string | null>(null);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSeniorIdImage(result.assets[0].uri);
            setSeniorId('Uploaded');
        }
    };




    const handleRegister = async () => {
        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        try {
            // Create a cleaner email from the name (no spaces, lowercase)
            const sanitizedEmail = name.replace(/\s+/g, '').toLowerCase() + "@placeholder.com";

            await registerSenior(sanitizedEmail, password, {
                name,
                contact,
                gender,
                seniorIdStatus: seniorId
            });

            Alert.alert("Success", "Account created successfully!", [
                { text: "OK", onPress: () => router.push('/welcome-senior') }
            ]);
        } catch (error: any) {
            console.error("Registration Error details:", error);
            Alert.alert("Registration Failed", error.message || "Something went wrong");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                    <Text style={styles.backText}>Bumalik</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Gumawa ng Account</Text>
                <Text style={styles.headerSubtitle}>Create your account for personalized care.</Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
                {/* Requirements */}
                <View style={styles.requirementsBox}>
                    <Text style={styles.reqTitle}>Mga Kailangan (Requirements)</Text>
                    <Text style={styles.reqItem}>• Personal Information</Text>
                    <Text style={styles.reqItem}>• Senior Citizen ID</Text>
                    <Text style={styles.reqItem}>• Emergency Contacts</Text>
                </View>

                {/* Inputs */}
                <Text style={styles.label}>Pangalan(Name)</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} />

                <Text style={styles.label}>Password</Text>
                <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />

                <Text style={styles.label}>Kumpirmahin ang iyong Password</Text>
                <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

                <Text style={styles.label}>Contact Number</Text>
                <TextInput style={styles.input} value={contact} onChangeText={setContact} keyboardType="phone-pad" />

                <View style={styles.row}>
                    <View style={styles.halfInput}>
                        <Text style={styles.label}>Kasarian (Gender)</Text>
                        <TextInput style={styles.input} value={gender} onChangeText={setGender} />
                    </View>
                    <View style={styles.halfInput}>
                        <Text style={styles.label}>Senior Citizen ID</Text>
                        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                            {seniorIdImage ? (
                                <Image source={{ uri: seniorIdImage }} style={styles.idImage} />
                            ) : (
                                <View style={styles.uploadPlaceholder}>
                                    <Ionicons name="camera" size={20} color="#6b7280" />
                                    <Text style={styles.uploadText}>Upload</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Register Button */}
                <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                    <Text style={styles.registerButtonText}>Register</Text>
                </TouchableOpacity>

                {/* Login Link */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>May account na? </Text>
                    <TouchableOpacity onPress={() => router.push('/login-senior')}>
                        <Text style={styles.linkText}>Mag-login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#2563eb', // Blue
        paddingTop: 60,
        paddingBottom: 30,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    backText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 5,
        fontWeight: '600',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    headerSubtitle: {
        color: '#bfdbfe',
        fontSize: 14,
    },
    formContainer: {
        padding: 24,
    },
    requirementsBox: {
        marginBottom: 20,
    },
    reqTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    reqItem: {
        fontSize: 14,
        color: '#4b5563',
        marginBottom: 2,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#000',
    },
    input: {
        backgroundColor: '#e5e7eb',
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
        marginBottom: 15,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    halfInput: {
        flex: 1,
    },
    registerButton: {
        backgroundColor: '#2563eb',
        padding: 16,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    footerText: {
        color: '#000',
    },
    linkText: {
        color: '#2563eb',
        fontWeight: 'bold',
    },
    imagePicker: {
        backgroundColor: '#e5e7eb',
        borderRadius: 12,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        overflow: 'hidden',
    },
    uploadPlaceholder: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    uploadText: {
        color: '#6b7280',
        fontSize: 14,
    },
    idImage: {
        width: '100%',
        height: '100%',
    },
});
