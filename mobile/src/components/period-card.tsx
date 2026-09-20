import { PeriodsFactory } from "@/factories";
import { Period } from "@/types";
import { capitalize } from "@/utils";
import { Text, View } from "react-native";

interface PeriodCardProps {
  period: Period;
}

export function PeriodCard({ period }: PeriodCardProps) {
  const colors = PeriodsFactory.stateColors[period.state];
  const icon = PeriodsFactory.periodIcons[period.id] ?? "•";

  return (
    <View
      className="w-full rounded-2xl border bg-white px-4 py-3.5 shadow-sm "
      style={{ borderColor: period.highlight ? colors.border : "#E9E3D8" }}
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 flex-row items-center gap-2.5">
          <View
            className="h-[34px] w-[34px] items-center justify-center rounded-[12px] border"
            style={{ backgroundColor: colors.bg, borderColor: colors.border }}
          >
            <Text className="text-base" style={{ color: colors.text }}>
              {icon}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-sm font-bold text-dia-ink">
              {capitalize(period.label)}
            </Text>
            <Text className="mt-0.5 text-[12px] text-dia-muted">
              {period.timeRange}
            </Text>
          </View>
        </View>

        <View className="items-center gap-1.5">
          <View
            className="rounded-full px-2.5 py-1"
            style={{ backgroundColor: colors.bg }}
          >
            <Text
              className="text-[12px] font-bold"
              style={{ color: colors.text }}
            >
              {period.stateLabel}
            </Text>
          </View>
        </View>
      </View>

      {period.state !== "insuficiente" && (
        <View className="mt-3 flex-row items-center justify-between border-t border-dia-border pt-3">
          <View className="flex-row items-end">
            <Text className="text-[13px] font-semibold text-dia-ink">
              {period.fc?.toFixed(0) ?? "--"}
            </Text>
            <Text className="mb-px text-[12px] text-dia-muted"> bpm</Text>
          </View>
          <View className="flex-row items-end">
            <Text className="text-[13px] font-semibold text-dia-ink">
              {period.rmssd?.toFixed(1) ?? "--"}
            </Text>
            <Text className="mb-px text-[12px] text-dia-muted"> ms</Text>
          </View>
          <Text className="text-[12px] text-dia-muted">
            {period.readings} leituras
          </Text>
        </View>
      )}

      {period.state === "insuficiente" && (
        <Text className="mt-2.5 text-xs leading-[18px] text-dia-muted">
          {period.note}
        </Text>
      )}
    </View>
  );
}
