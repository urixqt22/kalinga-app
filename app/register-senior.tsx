import { AdaptiveButton } from '@/components/AdaptiveButton';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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
    const [seniorId, setSeniorId] = useState('');
    const [seniorIdImage, setSeniorIdImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Font Size State
    const [fontSizeScale, setFontSizeScale] = useState(1);

    const toggleFontSize = () => {
        setFontSizeScale(prev => {
            if (prev >= 2.0) return 1;
            return prev + 0.5;
        });
    };

    // Helper for scaled font size
    const getFontSize = (size: number) => size * fontSizeScale;

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
                        <Text style={[styles.loadingText, { fontSize: getFontSize(14) }]}>Creating Account...</Text>
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
                        <Text style={[styles.modalTitle, { fontSize: getFontSize(22) }]}>
                            {modalType === 'success' ? 'Success!' : 'Registration Failed'}
                        </Text>
                        <Text style={[styles.modalMessage, { fontSize: getFontSize(16) }]}>{modalMessage}</Text>
                        <TouchableOpacity
                            style={[styles.modalButton, modalType === 'error' ? styles.errorButton : styles.successButton]}
                            onPress={handleModalClose}
                        >
                            <Text style={[styles.modalButtonText, { fontSize: getFontSize(16) }]}>
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
                        <Text style={[styles.modalTitle, { fontSize: getFontSize(22) }]}>Data Privacy Consent</Text>
                        <ScrollView style={{ maxHeight: 300, marginBottom: 20 }}>
                            <Text style={[styles.consentText, { fontSize: getFontSize(14) }]}>
                                By clicking "I Agree", I hereby grant my free, voluntary, and unconditional consent to KALINGA-APP to collect, store, and process my personal data, which may include my name, contact details, government IDs, etc.
                                {"\n"}{"\n"}
                                I understand that this information will be used for the purpose of processing my membership, or providing medical services. I further authorize the app to share this information with government services solely for the fulfillment of the declared purpose.
                                {"\n"}{"\n"}
                                I acknowledge that I have been informed of my rights as a Data Subject under the Data Privacy Act of 2012, including the right to access, correct, or request the deletion of my data. For any privacy-related concerns, I may contact the Data Protection Officer at urixfarinas@gmail.com.
                            </Text>
                        </ScrollView>
                        <View style={styles.row}>
                            <TouchableOpacity
                                style={[styles.consentButton, { backgroundColor: '#2563eb' }]}
                                onPress={handleConsentAgree}
                            >
                                <Text style={[styles.consentButtonText, { fontSize: getFontSize(16) }]}>I Agree</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.consentButton, { backgroundColor: '#ef4444' }]}
                                onPress={handleConsentDecline}
                            >
                                <Text style={[styles.consentButtonText, { fontSize: getFontSize(16) }]}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Header */}
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                        <Text style={[styles.backText, { fontSize: getFontSize(16) }]}>Bumalik</Text>
                    </TouchableOpacity>

                    {/* Font Size Toggle Button */}
                    <TouchableOpacity onPress={toggleFontSize} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15 }}>
                        <MaterialCommunityIcons name="format-size" size={20} color="#fff" style={{ marginRight: 5 }} />
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>
                            {Math.round(fontSizeScale * 100)}%
                        </Text>
                    </TouchableOpacity>
                </View>

                <Text style={[styles.headerTitle, { fontSize: getFontSize(26) }]}>Gumawa ng Account</Text>
                <Text style={[styles.headerSubtitle, { fontSize: getFontSize(14) }]}>Create your account for personalized care.</Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
                {/* Requirements */}
                <View style={styles.requirementsBox}>
                    <Text style={[styles.reqTitle, { fontSize: getFontSize(16) }]}>Mga Kailangan (Requirements)</Text>
                    <Text style={[styles.reqItem, { fontSize: getFontSize(14) }]}>• Personal Information</Text>
                    <Text style={[styles.reqItem, { fontSize: getFontSize(14) }]}>• Senior Citizen ID</Text>
                    <Text style={[styles.reqItem, { fontSize: getFontSize(14) }]}>• Emergency Contacts</Text>
                </View>

                {/* Inputs */}
                <Text style={[styles.label, { fontSize: getFontSize(14) }]}>Pangalan(Name)</Text>
                <TextInput style={[styles.input, { fontSize: getFontSize(16) }]} value={name} onChangeText={setName} />

                <Text style={[styles.label, { fontSize: getFontSize(14) }]}>Password</Text>
                <TextInput style={[styles.input, { fontSize: getFontSize(16) }]} value={password} onChangeText={setPassword} secureTextEntry />

                <Text style={[styles.label, { fontSize: getFontSize(14) }]}>Kumpirmahin ang iyong Password</Text>
                <TextInput style={[styles.input, { fontSize: getFontSize(16) }]} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

                <Text style={[styles.label, { fontSize: getFontSize(14) }]}>Contact Number</Text>
                <TextInput style={[styles.input, { fontSize: getFontSize(16) }]} value={contact} onChangeText={setContact} keyboardType="phone-pad" />

                {/* Gender Selection */}
                <Text style={[styles.label, { fontSize: getFontSize(14) }]}>Kasarian (Gender)</Text>
                <View style={styles.genderContainer}>
                    {['Male', 'Female', 'Others'].map((option) => (
                        <TouchableOpacity
                            key={option}
                            style={[styles.genderButton, gender === option && styles.genderButtonSelected]}
                            onPress={() => setGender(option)}
                        >
                            <Text style={[styles.genderText, gender === option && styles.genderTextSelected, { fontSize: getFontSize(14) }]}>
                                {option}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Senior ID Upload */}
                <Text style={[styles.label, { fontSize: getFontSize(14) }]}>Senior Citizen ID</Text>
                <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                    {seniorIdImage ? (
                        <Image source={{ uri: seniorIdImage }} style={styles.idImage} />
                    ) : (
                        <View style={styles.uploadPlaceholder}>
                            <Ionicons name="camera" size={20} color="#6b7280" />
                            <Text style={[styles.uploadText, { fontSize: getFontSize(14) }]}>Upload</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* Register Button */}
                <AdaptiveButton style={styles.registerButton} onPress={handleRegister} missPadding={30} maxScale={1.05}>
                    <Text style={[styles.registerButtonText, { fontSize: getFontSize(18) }]}>Register</Text>
                </AdaptiveButton>

                {/* Login Link */}
                <View style={styles.footer}>
                    <Text style={[styles.footerText, { fontSize: getFontSize(14) }]}>May account na? </Text>
                    <TouchableOpacity onPress={() => router.push('/login-senior')}>
                        <Text style={[styles.linkText, { fontSize: getFontSize(14) }]}>Mag-login</Text>
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
        width: '100%',
        gap: 10,
    },
    halfInput: {
        flex: 1,
    },
    registerButton: {
        backgroundColor: '#2563eb',
        padding: 16,
        width: '95%',
        alignSelf: 'center',
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
        backgroundColor: '#2563eb', // Blue for Senior
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
