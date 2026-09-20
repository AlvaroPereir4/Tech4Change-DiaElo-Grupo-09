import { Text, View } from "react-native";

interface MetricPillProps {
  label: string;
  value: string;
  unit: string;
}

export function MetricPill({ label, value, unit }: MetricPillProps) {
  return (
    <View className="items-center justify-center">
      <Text className="text-lg font-medium leading-[22px] text-dia-ink">
        {value}
      </Text>
      <Text className="mt-0.5 text-[10px] text-dia-muted">{unit}</Text>
      <Text className="mt-0.5 text-[10px] font-semibold tracking-[0.3px] text-dia-muted">
        {label}
      </Text>
    </View>
  );
}
