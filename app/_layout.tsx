import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CopilotProvider } from 'react-native-copilot';
import 'react-native-reanimated';

import ContextualHelpTooltip from '@/components/ContextualHelpTooltip';
import { IdleManager } from '@/components/IdleManager';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SettingsProvider>
      <CopilotProvider
        tooltipComponent={ContextualHelpTooltip}
        overlay="view"
        animated={true}
        arrowColor="transparent" // Clean look
        labels={{
          finish: "Tapos na",
          next: "Susunod",
          skip: "Isara"
        }}
      >
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <IdleManager>
            <Stack screenOptions={{ headerShown: false }}>
              {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
              <Stack.Screen name="role-selection" options={{ headerShown: false }} />
              <Stack.Screen name="welcome-senior" options={{ headerShown: false }} />
              <Stack.Screen name="dashboard-senior" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
            <StatusBar style="auto" />
          </IdleManager>
        </ThemeProvider>
      </CopilotProvider>
    </SettingsProvider>
  );
}
