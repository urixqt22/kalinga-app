
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type FontSizeMode = 'normal' | 'large' | 'extra-large';

interface SettingsContextProps {
    fontSizeMode: FontSizeMode;
    setFontSizeMode: (mode: FontSizeMode) => void;
    getFontSize: (baseSize: number) => number;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [fontSizeMode, setFontSizeModeState] = useState<FontSizeMode>('normal');

    useEffect(() => {
        // Load persist settings
        const loadSettings = async () => {
            try {
                const storedMode = await AsyncStorage.getItem('fontSizeMode');
                if (storedMode) {
                    setFontSizeModeState(storedMode as FontSizeMode);
                }
            } catch (error) {
                console.error("Failed to load settings", error);
            }
        };
        loadSettings();
    }, []);

    const setFontSizeMode = async (mode: FontSizeMode) => {
        setFontSizeModeState(mode);
        try {
            await AsyncStorage.setItem('fontSizeMode', mode);
        } catch (error) {
            console.error("Failed to save settings", error);
        }
    };

    const getFontSize = (baseSize: number) => {
        switch (fontSizeMode) {
            case 'large':
                return baseSize * 1.25; // 25% bigger
            case 'extra-large':
                return baseSize * 1.5; // 50% bigger
            default:
                return baseSize;
        }
    };

    return (
        <SettingsContext.Provider value={{ fontSizeMode, setFontSizeMode, getFontSize }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
};
