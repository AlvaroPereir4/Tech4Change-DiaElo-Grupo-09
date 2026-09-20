import { AttentionCard, MetricPill, PeriodCard } from "@/components";
import { Feedback } from "@/components/ui";
import { NotesFactory, PeriodsFactory } from "@/factories";
import { useDailySummary } from "@/hooks/use-daily-summary";
import { getDayWeek } from "@/utils";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { data: summary, isLoading, error, retry } = useDailySummary();
  const { top, bottom } = useSafeAreaInsets();
  const router = useRouter();

  if (error) return <Feedback type="error" errorText={error} onRetry={retry} />;

  if (isLoading || !summary) return <Feedback type="loading" />;

  const periods = PeriodsFactory.toPeriods(summary);
  const notes = NotesFactory.toNotes(summary.periods);
  const formatMetric = (value: number) => value?.toFixed(2).replace(".", ",");

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingTop: top }}
      contentContainerClassName="bg-white"
    >
      <View className="flex-1 bg-dia-background pb-5">
        <View className="border-b border-dia-border bg-white rounded-2xl px-6 pb-5 pt-3">
          <View className="mb-4 flex-row items-center justify-between">
            <View>
              <Text className="text-[22px] font-medium leading-7 text-dia-ink">
                Sofia
              </Text>
              <Text className="mt-0.5 text-xs text-dia-muted">
                {getDayWeek(new Date())}
              </Text>
            </View>

            <View className="h-11 w-11 items-center justify-center rounded-full bg-[#CFEAD9]">
              <Text className="text-xl">🌿</Text>
            </View>
          </View>

          <View className="rounded-2xl border border-dia-border bg-dia-background px-4 py-3.5">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-[12px] font-extrabold uppercase tracking-[0.7px] text-dia-muted">
                Resumo do dia
              </Text>
              <Text className="text-[12px] text-dia-muted">
                {summary.readings_used} leituras
              </Text>
            </View>

            <View className="flex-row items-center justify-around">
              <MetricPill
                label="FC Média"
                value={formatMetric(summary.day_metrics?.heart_rate_avg)}
                unit="bpm"
              />
              <View className="h-9 w-px bg-dia-border" />
              <MetricPill
                label="RMSSD"
                value={formatMetric(summary.day_metrics?.rmssd_avg)}
                unit="ms"
              />
              <View className="h-9 w-px bg-dia-border" />
              <MetricPill
                label="Atividade"
                value={formatMetric(summary.day_metrics?.activity_avg)}
                unit="méd."
              />
            </View>
          </View>
        </View>

        <View className="px-5 pt-5">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-xs font-extrabold uppercase tracking-[0.7px] text-dia-muted">
              Períodos do dia
            </Text>
            <TouchableOpacity onPress={() => router.push("/home/dayDetail")}>
              <Text className="text-xs font-bold text-dia-primary">
                Ver linha do tempo →
              </Text>
            </TouchableOpacity>
          </View>

          <View className="gap-3">
            {periods?.map((period) => (
              <PeriodCard key={period.id} period={period} />
            ))}
          </View>
        </View>

        <View className="px-5 pt-5">
          <AttentionCard notes={notes} />
        </View>

        <View className="px-5 pt-4" style={{ paddingBottom: bottom + 20 }}>
          <View className="flex-row items-center justify-between rounded-2xl border border-dia-border bg-dia-card px-4 py-3.5">
            <View>
              <Text className="text-[13px] font-bold text-dia-ink">
                Quer registrar algo?
              </Text>
              <Text className="mt-0.5 text-sm text-dia-muted">
                Sono, alimentação, comportamento…
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push("/log")}
              className="rounded-full bg-dia-primary px-3.5 py-2"
            >
              <Text className="text-xs font-bold text-white">Registrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
