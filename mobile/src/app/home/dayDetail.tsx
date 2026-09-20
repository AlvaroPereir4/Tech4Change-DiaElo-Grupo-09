import { Feedback } from "@/components";
import { PeriodsFactory } from "@/factories";
import { useDailySummary } from "@/hooks/use-daily-summary";
import { Period } from "@/types";
import { capitalize, getDayWeek } from "@/utils";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function PeriodBlock({ period, last }: { period: Period; last: boolean }) {
  const colors = PeriodsFactory.stateColors[period.state];
  const timeline = PeriodsFactory.periodRanges[period.id];
  const icon = PeriodsFactory.periodIcons[period.id];

  return (
    <View className="flex-row gap-3">
      <View className="w-8 items-center">
        <View
          className="h-8 w-8 items-center justify-center rounded-full border"
          style={{ backgroundColor: colors.bg, borderColor: colors.text }}
        >
          <Text>{icon}</Text>
        </View>
        {!last && <View className="my-1 w-0.5 flex-1 bg-dia-border" />}
      </View>
      <View className={`flex-1 ${last ? "" : "pb-5"}`}>
        <View className="mb-2 flex-row items-center justify-between gap-2">
          <View className="flex-1 flex-row items-baseline gap-2">
            <Text className="text-[15px] font-bold text-dia-ink">
              {capitalize(period.label)}
            </Text>
            <Text className="text-[12px] leading-[17px] text-dia-muted">
              {timeline}
            </Text>
          </View>
          <Text
            className="overflow-hidden rounded-full px-2.5 py-1 text-[12px] font-bold"
            style={{ backgroundColor: colors.bg, color: colors.text }}
          >
            {capitalize(period.state)}
          </Text>
        </View>
        <View className="rounded-2xl border border-dia-border bg-dia-card p-3.5">
          {period.fc !== null && (
            <View className="mb-3 flex-row justify-between">
              <Metric value={String(period.fc)} label="FC bpm" />
              <Metric value={String(period.rmssd)} label="RMSSD ms" />
              <Metric value={String(period.activity)} label="Atividade" />
              <Metric value={String(period.readings)} label="leituras" />
            </View>
          )}
          <Text className="rounded-[12px] bg-dia-background p-2.5 text-xs leading-[18px] text-dia-muted">
            {period.note}
          </Text>
          {period.state === "acelerado" && (
            <Text className="mt-2 rounded-[12px] bg-dia-alert p-2.5 text-[12px] font-semibold text-dia-alert-text">
              💬 Ponto para conversar com a terapeuta
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
function Metric({ value, label }: { value: string; label: string }) {
  return (
    <View>
      <Text className="text-[15px] font-semibold text-dia-ink">{value}</Text>
      <Text className="text-[12px] leading-[17px] text-dia-muted">{label}</Text>
    </View>
  );
}

export default function DayDetailScreen() {
  const { data: summary, isLoading, error, retry } = useDailySummary();
  const { top, bottom } = useSafeAreaInsets();
  const router = useRouter();

  if (error) return <Feedback type="error" errorText={error} onRetry={retry} />;

  if (isLoading || !summary) return <Feedback type="loading" />;

  const periods = PeriodsFactory.toPeriods(summary);

  return (
    <ScrollView
      className="flex-1 bg-dia-background"
      contentContainerClassName="p-5 pb-8 bg-white"
      contentContainerStyle={{ paddingTop: top, paddingBottom: bottom + 20 }}
    >
      <Pressable onPress={router.back} className="mb-2 py-1">
        <Text className="text-sm font-bold text-dia-primary">‹ Voltar</Text>
      </Pressable>
      <Text className="text-[22px] font-medium text-dia-ink">
        Linha do tempo
      </Text>
      <Text className="mb-5 mt-1 text-xs text-dia-muted">
        Sofia · {getDayWeek(new Date())}
      </Text>
      <View>
        {periods.map((period, index) => (
          <PeriodBlock
            key={period.id}
            period={period}
            last={index === periods.length - 1}
          />
        ))}
      </View>
      <View className="mt-8 rounded-xl border border-dia-warning-border bg-dia-warning p-3">
        <Text className="text-[12px] leading-[17px] text-dia-warning-text">
          <Text className="font-bold">Aviso:</Text> Os dados descrevem sinais do
          corpo, não emoções nem diagnóstico. As observações são baseadas em
          sinais fisiológicos registrados.
        </Text>
      </View>
    </ScrollView>
  );
}
