import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";

import AppStacks from "@/components/app-stacks";
import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function StackLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AppStacks />
    </ThemeProvider>
  );
}
