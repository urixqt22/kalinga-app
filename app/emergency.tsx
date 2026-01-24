import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function EmergencyScreen() {
    const router = useRouter();

    const triggerAlert = () => {
        alert("Emergency Alert Triggered! Notifying Caretakers...");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>EMERGENCY</Text>

            <TouchableOpacity style={styles.alertButton} onPress={triggerAlert}>
                <Text style={styles.alertText}>SOS</Text>
            </TouchableOpacity>

            <Text style={styles.instruction}>Press and hold to send alert</Text>

            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Text style={styles.backText}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#c0392b',
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 50,
    },
    alertButton: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#e74c3c',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 5,
        borderColor: '#fff',
        elevation: 10,
    },
    alertText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#fff',
    },
    instruction: {
        color: '#fff',
        marginTop: 30,
        fontSize: 18,
    },
    backButton: {
        marginTop: 50,
        padding: 15,
    },
    backText: {
        color: '#fff',
        fontSize: 18,
        textDecorationLine: 'underline',
    },
});
