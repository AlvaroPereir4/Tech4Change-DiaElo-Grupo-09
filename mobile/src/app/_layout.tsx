import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";

import AppTabs from "@/components/app-tabs";
import { requireOptionalNativeModule } from "expo";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    SplashScreen.hideAsync();
    // Hide the floating dev menu button safely after mount
    const DevMenuPreferences =
      requireOptionalNativeModule("DevMenuPreferences");
    DevMenuPreferences?.setPreferencesAsync({
      showFloatingActionButton: false,
    });
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AppTabs />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
