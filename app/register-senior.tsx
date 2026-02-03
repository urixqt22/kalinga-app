import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
    const [isLoading, setIsLoading] = useState(false);

    // Modal State
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState<'success' | 'error'>('success');
    const [modalMessage, setModalMessage] = useState('');

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

    const showModal = (type: 'success' | 'error', message: string) => {
        setModalType(type);
        setModalMessage(message);
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
        if (modalType === 'success') {
            router.push('/welcome-senior');
        }
    };

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            showModal('error', "Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            // Create a cleaner, unique email from the name (no spaces, lowercase) + timestamp
            const timestamp = Date.now();
            const sanitizedEmail = `${name.replace(/\s+/g, '').toLowerCase()}${timestamp}@placeholder.com`;

            await registerSenior(sanitizedEmail, password, {
                name,
                contact,
                gender,
                seniorIdStatus: seniorId
            });

            setIsLoading(false);
            showModal('success', "Account created successfully!");

        } catch (error: any) {
            setIsLoading(false);
            console.error("Registration Error details:", error);
            showModal('error', error.message || "Something went wrong");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Loading Modal */}
            <Modal transparent={true} animationType="fade" visible={isLoading}>
                <View style={styles.loadingContainer}>
                    <View style={styles.loadingBox}>
                        <ActivityIndicator size="large" color="#2563eb" />
                        <Text style={styles.loadingText}>Creating Account...</Text>
                    </View>
                </View>
            </Modal>

            {/* Custom Success/Error Modal */}
            <Modal transparent={true} animationType="fade" visible={modalVisible} onRequestClose={handleModalClose}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={[styles.iconContainer, modalType === 'error' ? styles.errorIcon : styles.successIcon]}>
                            <Ionicons
                                name={modalType === 'success' ? "checkmark-circle" : "alert-circle"}
                                size={50}
                                color="#fff"
                            />
                        </View>
                        <Text style={styles.modalTitle}>
                            {modalType === 'success' ? 'Success!' : 'Registration Failed'}
                        </Text>
                        <Text style={styles.modalMessage}>{modalMessage}</Text>
                        <TouchableOpacity
                            style={[styles.modalButton, modalType === 'error' ? styles.errorButton : styles.successButton]}
                            onPress={handleModalClose}
                        >
                            <Text style={styles.modalButtonText}>
                                {modalType === 'success' ? 'Continue' : 'Try Again'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

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
                <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={isLoading}>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    loadingBox: {
        width: 150,
        height: 120,
        backgroundColor: 'white',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        marginTop: -50,
        elevation: 5,
    },
    successIcon: {
        backgroundColor: '#22c55e', // Green
    },
    errorIcon: {
        backgroundColor: '#ef4444', // Red
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: 16,
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: 20,
    },
    modalButton: {
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        width: '100%',
        alignItems: 'center',
    },
    successButton: {
        backgroundColor: '#22c55e',
    },
    errorButton: {
        backgroundColor: '#ef4444',
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
