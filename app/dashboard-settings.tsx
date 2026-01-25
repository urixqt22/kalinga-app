import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsDashboardScreen() {
    const router = useRouter();
    const { role } = useLocalSearchParams();
    const isCaretaker = role === 'caretaker';

    // Theme Colors
    const themeColor = isCaretaker ? '#a855f7' : '#3b82f6'; // Purple vs Blue
    const lightThemeColor = isCaretaker ? '#f3e8ff' : '#dbeafe'; // Light Purple vs Light Blue
    const borderColor = isCaretaker ? '#d8b4fe' : '#bfdbfe'; // Lighter border

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: themeColor }]}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                    <Text style={styles.backText}>Bumalik</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>SETTINGS</Text>
                <Text style={styles.headerSubtitle}>Mga Pagpipilian</Text>
            </View>

            {/* Font Size Card */}
            <View style={[styles.card, { borderColor: themeColor }]}>
                <View style={styles.cardHeader}>
                    <View style={[styles.iconBox, { backgroundColor: lightThemeColor }]}>
                        <MaterialCommunityIcons name="format-size" size={24} color={themeColor} />
                    </View>
                    <Text style={[styles.cardTitle, { color: themeColor }]}>Laking Letra</Text>
                </View>

                <View style={styles.fontSizeOptions}>
                    <TouchableOpacity style={[styles.optionButtonOutline, { borderColor: borderColor }]}>
                        <Text style={[styles.optionTextOutline, { color: themeColor }]}>Normal</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.optionButtonFilled, { backgroundColor: themeColor }]}>
                        <Text style={styles.optionTextFilled}>Malaki</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.optionButtonOutline, { borderColor: borderColor }]}>
                        <Text style={[styles.optionTextOutline, { color: themeColor }]}>Sobrang Laki</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Other Settings */}
            <View style={styles.settingsList}>

                {/* Tunog */}
                <TouchableOpacity style={[styles.settingItem, { borderColor: borderColor }]}>
                    <View style={[styles.settingIconBox, { backgroundColor: lightThemeColor }]}>
                        <Ionicons name="volume-high-outline" size={24} color={themeColor} />
                    </View>
                    <View style={styles.settingContent}>
                        <Text style={styles.settingTitle}>Tunog</Text>
                        <Text style={styles.settingSubtitle}>Sound settings</Text>
                    </View>
                </TouchableOpacity>

                {/* Kulay */}
                <TouchableOpacity style={[styles.settingItem, { borderColor: borderColor }]}>
                    <View style={[styles.settingIconBox, { backgroundColor: lightThemeColor }]}>
                        <Ionicons name="eye-outline" size={24} color={themeColor} />
                    </View>
                    <View style={styles.settingContent}>
                        <Text style={styles.settingTitle}>Kulay at Contrast</Text>
                        <Text style={styles.settingSubtitle}>Display settings</Text>
                    </View>
                </TouchableOpacity>

                {/* Wika */}
                <TouchableOpacity style={[styles.settingItem, { borderColor: borderColor }]}>
                    <View style={[styles.settingIconBox, { backgroundColor: lightThemeColor }]}>
                        <Ionicons name="language-outline" size={24} color={themeColor} />
                    </View>
                    <View style={styles.settingContent}>
                        <Text style={styles.settingTitle}>Wika/Language</Text>
                        <Text style={styles.settingSubtitle}>Filipino/English</Text>
                    </View>
                </TouchableOpacity>

                {/* Tulong */}
                <TouchableOpacity style={[styles.settingItem, { borderColor: borderColor }]}>
                    <View style={[styles.settingIconBox, { backgroundColor: lightThemeColor }]}>
                        <Ionicons name="help-circle-outline" size={24} color={themeColor} />
                    </View>
                    <View style={styles.settingContent}>
                        <Text style={styles.settingTitle}>Tulong/Help</Text>
                        <Text style={styles.settingSubtitle}>Get assistance</Text>
                    </View>
                </TouchableOpacity>

            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f0f9ff', // We generally keep the background light blueish or white. Layout background.
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    headerSubtitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 16,
        marginTop: 5,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        margin: 20,
        borderWidth: 2,
        // borderColor set dynamically
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    iconBox: {
        padding: 8,
        borderRadius: 10,
        marginRight: 15,
        // backgroundColor set dynamically
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        // color set dynamically
    },
    fontSizeOptions: {
        gap: 10,
    },
    optionButtonOutline: {
        borderWidth: 1,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        // borderColor set dynamically
    },
    optionTextOutline: {
        fontWeight: 'bold',
        // color set dynamically
    },
    optionButtonFilled: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        // backgroundColor set dynamically
    },
    optionTextFilled: {
        color: '#fff',
        fontWeight: 'bold',
    },
    settingsList: {
        paddingHorizontal: 20,
        gap: 15,
        paddingBottom: 40,
    },
    settingItem: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        // borderColor set dynamically
    },
    settingIconBox: {
        width: 50,
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        // backgroundColor set dynamically
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e3a8a', // Keeping dark text for readability, or could act dynamically
    },
    settingSubtitle: {
        fontSize: 14,
        color: '#64748b',
    },
});
