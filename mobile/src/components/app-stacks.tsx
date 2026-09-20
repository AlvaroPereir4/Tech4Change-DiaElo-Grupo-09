import { Stack, useRouter } from "expo-router";
import { useColorScheme } from "react-native";

import { Colors } from "@/constants/theme";

const ACTIVE = "#4E5FA3";
const INACTIVE = "#B3A898";
const LABEL_INACTIVE = "#726A61";

export default function AppStacks() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "unspecified" ? "light" : scheme];
  const router = useRouter();

  return (
    <Stack
      // See React Navigation documentation for more information on available screenOptions: https://reactnavigation.org/docs/headers/#sharing-common-options-across-screens
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{}} />
      <Stack.Screen name="dayDetail" options={{}} />
    </Stack>
  );
}
