import { ScrollView, Text, View } from "react-native";

import {
  BodySignalsDisclaimer,
  FamilyLogsCard,
  WeekChartCard,
  WeekDaysCard,
  WeekSummary,
  type DayData,
} from "@/components";

const weekData: DayData[] = [
  { label: "Seg", date: "12/09", fc: 88, rmssd: 27, state: "calmo", hasLog: true },
  { label: "Ter", date: "13/09", fc: 94, rmssd: 23, state: "intermediario", hasLog: false },
  { label: "Qua", date: "14/09", fc: 97, rmssd: 21, state: "acelerado", hasLog: true },
  { label: "Qui", date: "15/09", fc: 86, rmssd: 29, state: "calmo", hasLog: true },
  { label: "Sex", date: "16/09", fc: 92, rmssd: 25, state: "intermediario", hasLog: false },
  { label: "Sab", date: "17/09", fc: 84, rmssd: 31, state: "calmo", hasLog: false },
  { label: "Dom", date: "18/09", fc: 91, rmssd: 25, state: "acelerado", hasLog: false },
];

const familyLogs = [
  { icon: "🏫", label: "Escola", note: "Dia dificil na troca de atividade", date: "18/09" },
  { icon: "😴", label: "Sono", note: "Dormiu bem, acordou descansada", date: "15/09" },
  { icon: "📝", label: "Comportamento", note: "Mais resistencia a tarde", date: "14/09" },
  { icon: "🍽️", label: "Alimentacao", note: "Aceitou bem o almoco", date: "12/09" },
];

export default function WeekScreen() {
  const calmDays = weekData.filter((day) => day.state === "calmo").length;
  const activeDays = weekData.filter((day) => day.state === "acelerado").length;
  const avgFc = (weekData.reduce((sum, day) => sum + day.fc, 0) / weekData.length).toFixed(1);
  const avgRmssd = (weekData.reduce((sum, day) => sum + day.rmssd, 0) / weekData.length).toFixed(1);

  return (
    <ScrollView className="flex-1 bg-dia-background" contentContainerClassName="p-5 pb-8">
      <Text className="text-[22px] font-medium text-dia-ink">Contexto da semana</Text>
      <Text className="mb-5 mt-1 text-xs text-dia-muted">12-18 de setembro · Sofia</Text>

      <View className="mb-4 flex-row gap-2.5">
        <WeekSummary value={calmDays} label="dias calmos" color="#4E7C6A" />
        <WeekSummary value={activeDays} label="maior ativacao" color="#A95A4E" />
        <WeekSummary value={avgFc} label="FC media" />
      </View>

      <WeekChartCard days={weekData} avgRmssd={avgRmssd} />
      <WeekDaysCard days={weekData} />
      <FamilyLogsCard logs={familyLogs} />
      <BodySignalsDisclaimer />
    </ScrollView>
  );
}
