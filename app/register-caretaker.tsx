import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { registerCaretaker } from '../services/auth';

export default function RegisterCaretakerScreen() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [contact, setContact] = useState('');
    const [gender, setGender] = useState('');
    const [validId, setValidId] = useState('');
    const [validIdImage, setValidIdImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Modal State
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState<'success' | 'error'>('success');
    const [modalMessage, setModalMessage] = useState('');
    const [consentModalVisible, setConsentModalVisible] = useState(true); // Show on load

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setValidIdImage(result.assets[0].uri);
            setValidId('Uploaded');
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
            router.push('/welcome-caretaker');
        }
    };

    const handleConsentAgree = () => {
        setConsentModalVisible(false);
    };

    const handleConsentDecline = () => {
        setConsentModalVisible(false);
        router.back();
    };

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            showModal('error', "Passwords do not match");
            return;
        }

        if (isLoading) return;
        setIsLoading(true);

        try {
            // Standard/Predictable email generation
            const sanitizedEmail = name.replace(/\s+/g, '').toLowerCase() + "@placeholder.com";
            console.log("Attempting registration with email:", sanitizedEmail);

            await registerCaretaker(sanitizedEmail, password, {
                name,
                contact,
                gender,
                validIdStatus: validId
            });

            setIsLoading(false);
            showModal('success', "Account created successfully!");

        } catch (error: any) {
            setIsLoading(false);
            console.error("Registration Error:", error);

            let errorMessage = error.message;
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "This name is already registered. Please use a different name or login.";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "Password should be at least 6 characters.";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "The generated email is invalid. Please check the name format.";
            }

            showModal('error', errorMessage || "Registration failed.");
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
                {/* Loading Modal */}
                <Modal transparent={true} animationType="fade" visible={isLoading}>
                    <View style={styles.loadingContainer}>
                        <View style={styles.loadingBox}>
                            <ActivityIndicator size="large" color="#a855f7" />
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

                {/* Data Privacy Consent Modal */}
                <Modal transparent={true} animationType="slide" visible={consentModalVisible} onRequestClose={() => setConsentModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Data Privacy Consent</Text>
                            <ScrollView style={{ maxHeight: 300, marginBottom: 20 }}>
                                <Text style={styles.consentText}>
                                    By clicking "I Agree", I hereby grant my free, voluntary, and unconditional consent to KALINGA-APP to collect, store, and process my personal data, which may include my name, contact details, government IDs, etc.
                                    {"\n"}{"\n"}
                                    I understand that this information will be used for the purpose of processing my membership, or providing medical services. I further authorize the app to share this information with government services solely for the fulfillment of the declared purpose.
                                    {"\n"}{"\n"}
                                    I acknowledge that I have been informed of my rights as a Data Subject under the Data Privacy Act of 2012, including the right to access, correct, or request the deletion of my data. For any privacy-related concerns, I may contact the Data Protection Officer at urixfarinas@gmail.com.
                                </Text>
                            </ScrollView>
                            <View style={styles.row}>
                                <TouchableOpacity
                                    style={[styles.consentButton, { backgroundColor: '#a855f7' }]}
                                    onPress={handleConsentAgree}
                                >
                                    <Text style={styles.consentButtonText}>I Agree</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.consentButton, { backgroundColor: '#ef4444' }]}
                                    onPress={handleConsentDecline}
                                >
                                    <Text style={styles.consentButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
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

                    {/* Gender Selection */}
                    <Text style={styles.label}>Kasarian (Gender)</Text>
                    <View style={styles.genderContainer}>
                        {['Male', 'Female', 'Others'].map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={[styles.genderButton, gender === option && styles.genderButtonSelected]}
                                onPress={() => setGender(option)}
                            >
                                <Text style={[styles.genderText, gender === option && styles.genderTextSelected]}>
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Valid ID Upload */}
                    <Text style={styles.label}>Imahe ng Valid ID</Text>
                    <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                        {validIdImage ? (
                            <Image source={{ uri: validIdImage }} style={styles.idImage} />
                        ) : (
                            <View style={styles.uploadPlaceholder}>
                                <Ionicons name="camera" size={20} color="#6b7280" />
                                <Text style={styles.uploadText}>Upload</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* Register Button */}
                    <TouchableOpacity
                        style={[styles.registerButton, isLoading && { opacity: 0.7 }]}
                        onPress={handleRegister}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Text style={styles.registerButtonText}>Loading...</Text>
                        ) : (
                            <Text style={styles.registerButtonText}>Register</Text>
                        )}
                    </TouchableOpacity>

                    {/* Login Link */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>May account na? </Text>
                        <TouchableOpacity onPress={() => router.push('/login-caretaker')}>
                            <Text style={styles.linkText}>Mag-login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        paddingBottom: 150, // Increased padding for large fonts/scrolling
    },
    header: {
        backgroundColor: '#a855f7', // Purple
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
        color: '#f3e8ff',
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
        width: '100%',
        gap: 10,
    },
    halfInput: {
        flex: 1,
    },
    registerButton: {
        backgroundColor: '#a855f7', // Purple
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
        color: '#a855f7',
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
        width: '90%',
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
    genderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        marginBottom: 15,
    },
    genderButton: {
        flex: 1,
        backgroundColor: '#e5e7eb',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    genderButtonSelected: {
        backgroundColor: '#a855f7', // Purple for Caretaker
    },
    genderText: {
        fontSize: 14,
        color: '#4b5563',
        fontWeight: '500',
    },
    genderTextSelected: {
        color: '#fff',
        fontWeight: 'bold',
    },
    consentText: {
        fontSize: 14,
        color: '#374151',
        lineHeight: 22,
        marginBottom: 20,
        textAlign: 'justify'
    },
    consentButton: {
        flex: 1,
        height: 45,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    consentButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
