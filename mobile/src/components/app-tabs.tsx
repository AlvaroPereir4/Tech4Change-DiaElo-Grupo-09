import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useColorScheme } from "react-native";

import { Colors } from "@/constants/theme";

const ACTIVE = "#4E5FA3";
const INACTIVE = "#B3A898";
const LABEL_INACTIVE = "#726A61";

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "unspecified" ? "light" : scheme];

  return (
    <NativeTabs
      shadowColor={colors.backgroundElement}
      iconColor={{ default: INACTIVE, selected: ACTIVE }}
      labelVisibilityMode="labeled"
      blurEffect="prominent"
      backgroundColor="red"
      sidebarAdaptable
      labelStyle={{
        default: {
          fontSize: 10,
          fontWeight: "400",
          color: LABEL_INACTIVE,
        },
        selected: {
          fontSize: 10,
          fontWeight: "700",
          color: ACTIVE,
        },
      }}
      indicatorColor={colors.backgroundElement}
    >
      <NativeTabs.Trigger name="index" labelVisibilityMode="unlabeled" hidden>
        <NativeTabs.Trigger.Label> </NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="home">
        <NativeTabs.Trigger.Label>Hoje</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "house", selected: "house.fill" }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="week">
        <NativeTabs.Trigger.Label>Semana</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "calendar", selected: "calendar" }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger
        name="log"
        indicatorColor="#4E5FA3"
        role="search"
        labelVisibilityMode="unlabeled"
        contentStyle={{ backgroundColor: colors.backgroundElement }}
      >
        <NativeTabs.Trigger.Icon
          sf={{ default: "plus", selected: "plus.circle.fill" }}
        />
        <NativeTabs.Trigger.Label hidden></NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="session">
        <NativeTabs.Trigger.Label>Sessão</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "message", selected: "message.fill" }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Perfil</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "person", selected: "person.fill" }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
