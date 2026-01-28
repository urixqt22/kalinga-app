import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useSettings } from '../contexts/SettingsContext';

export default function SettingsDashboardScreen() {
    const router = useRouter();
    const { role } = useLocalSearchParams();
    const isCaretaker = role === 'caretaker';
    const { fontSizeMode, setFontSizeMode, getFontSize } = useSettings();

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
                    <Text style={[styles.backText, { fontSize: getFontSize(16) }]}>Bumalik</Text>
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { fontSize: getFontSize(28) }]}>SETTINGS</Text>
                <Text style={[styles.headerSubtitle, { fontSize: getFontSize(16) }]}>Mga Pagpipilian</Text>
            </View>

            {/* Font Size Card */}
            <View style={[styles.card, { borderColor: themeColor }]}>
                <View style={styles.cardHeader}>
                    <View style={[styles.iconBox, { backgroundColor: lightThemeColor }]}>
                        <MaterialCommunityIcons name="format-size" size={24} color={themeColor} />
                    </View>
                    <Text style={[styles.cardTitle, { color: themeColor, fontSize: getFontSize(20) }]}>Laking Letra</Text>
                </View>

                <View style={styles.fontSizeOptions}>
                    <TouchableOpacity
                        style={[fontSizeMode === 'normal' ? { backgroundColor: themeColor } : { borderColor: borderColor, borderWidth: 1 }, styles.optionButton]}
                        onPress={() => setFontSizeMode('normal')}
                    >
                        <Text style={[styles.optionText, { color: fontSizeMode === 'normal' ? '#fff' : themeColor, fontSize: 16 }]}>Normal</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[fontSizeMode === 'large' ? { backgroundColor: themeColor } : { borderColor: borderColor, borderWidth: 1 }, styles.optionButton]}
                        onPress={() => setFontSizeMode('large')}
                    >
                        <Text style={[styles.optionText, { color: fontSizeMode === 'large' ? '#fff' : themeColor, fontSize: 20 }]}>Malaki</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[fontSizeMode === 'extra-large' ? { backgroundColor: themeColor } : { borderColor: borderColor, borderWidth: 1 }, styles.optionButton]}
                        onPress={() => setFontSizeMode('extra-large')}
                    >
                        <Text style={[styles.optionText, { color: fontSizeMode === 'extra-large' ? '#fff' : themeColor, fontSize: 24 }]}>Sobrang Laki</Text>
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
                        <Text style={[styles.settingTitle, { fontSize: getFontSize(16) }]}>Tunog</Text>
                        <Text style={[styles.settingSubtitle, { fontSize: getFontSize(14) }]}>Sound settings</Text>
                    </View>
                </TouchableOpacity>

                {/* Kulay */}
                <TouchableOpacity style={[styles.settingItem, { borderColor: borderColor }]}>
                    <View style={[styles.settingIconBox, { backgroundColor: lightThemeColor }]}>
                        <Ionicons name="eye-outline" size={24} color={themeColor} />
                    </View>
                    <View style={styles.settingContent}>
                        <Text style={[styles.settingTitle, { fontSize: getFontSize(16) }]}>Kulay at Contrast</Text>
                        <Text style={[styles.settingSubtitle, { fontSize: getFontSize(14) }]}>Display settings</Text>
                    </View>
                </TouchableOpacity>

                {/* Wika */}
                <TouchableOpacity style={[styles.settingItem, { borderColor: borderColor }]}>
                    <View style={[styles.settingIconBox, { backgroundColor: lightThemeColor }]}>
                        <Ionicons name="language-outline" size={24} color={themeColor} />
                    </View>
                    <View style={styles.settingContent}>
                        <Text style={[styles.settingTitle, { fontSize: getFontSize(16) }]}>Wika/Language</Text>
                        <Text style={[styles.settingSubtitle, { fontSize: getFontSize(14) }]}>Filipino/English</Text>
                    </View>
                </TouchableOpacity>

                {/* Tulong */}
                <TouchableOpacity style={[styles.settingItem, { borderColor: borderColor }]}>
                    <View style={[styles.settingIconBox, { backgroundColor: lightThemeColor }]}>
                        <Ionicons name="help-circle-outline" size={24} color={themeColor} />
                    </View>
                    <View style={styles.settingContent}>
                        <Text style={[styles.settingTitle, { fontSize: getFontSize(16) }]}>Tulong/Help</Text>
                        <Text style={[styles.settingSubtitle, { fontSize: getFontSize(14) }]}>Get assistance</Text>
                    </View>
                </TouchableOpacity>

            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f0f9ff',
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
        fontWeight: 'bold',
        marginLeft: 5,
    },
    headerTitle: {
        color: '#fff',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    headerSubtitle: {
        color: 'rgba(255,255,255,0.8)',
        marginTop: 5,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        margin: 20,
        borderWidth: 2,
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
    },
    cardTitle: {
        fontWeight: 'bold',
    },
    fontSizeOptions: {
        gap: 10,
    },
    optionButton: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    optionText: {
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
    },
    settingIconBox: {
        width: 50,
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        fontWeight: 'bold',
        color: '#1e3a8a',
    },
    settingSubtitle: {
        color: '#64748b',
    },
});
