import { Text, View } from "react-native";

export type DayState = "calmo" | "intermediario" | "acelerado";
export type DayData = {
  label: string;
  date: string;
  fc: number;
  rmssd: number;
  state: DayState;
  hasLog: boolean;
};

type FamilyLogData = {
  icon: string;
  label: string;
  note: string;
  date: string;
};

const stateStyles: Record<DayState, { bg: string; label: string }> = {
  calmo: { bg: "#B8DEC9", label: "Calmo" },
  intermediario: { bg: "#EDD89A", label: "Intermediario" },
  acelerado: { bg: "#F0B5AF", label: "Maior ativacao" },
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.7px] text-dia-muted">
      {children}
    </Text>
  );
}

export function AppCard({ children }: { children: React.ReactNode }) {
  return (
    <View className="mb-4 rounded-2xl border border-dia-border bg-dia-card p-3.5">
      {children}
    </View>
  );
}

export function WeekSummary({ value, label, color = "#1F1E1C" }: { value: string | number; label: string; color?: string }) {
  return (
    <View className="flex-1 rounded-[14px] border border-dia-border bg-dia-card p-3">
      <Text className="text-[21px] font-medium text-dia-ink">{value}</Text>
      <Text className="mt-1 text-[10px] font-bold" style={{ color }}>
        {label}
      </Text>
    </View>
  );
}

export function FcBarChart({ days }: { days: DayData[] }) {
  const max = Math.max(...days.map((day) => day.fc));

  return (
    <View className="h-[100px] flex-row items-end gap-[7px]">
      {days.map((day, index) => {
        const height = Math.max(8, ((day.fc - 70) / (max - 70)) * 70);
        const isToday = index === days.length - 1;

        return (
          <View key={day.label} className="h-full flex-1 items-center justify-end gap-1.5">
            <View
              className="w-full max-w-7 rounded-t-[5px]"
              style={{
                height,
                backgroundColor: isToday ? "#1F1E1C" : stateStyles[day.state].bg,
              }}
            />
            <Text className={`text-[10px] ${isToday ? "font-bold text-dia-ink" : "text-dia-muted"}`}>
              {day.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export function DayRow({ day, isToday }: { day: DayData; isToday: boolean }) {
  const state = stateStyles[day.state];

  return (
    <View className={`flex-row items-center gap-[9px] rounded-[11px] px-2 py-[9px] ${isToday ? "border border-dia-border bg-[#F0F1F8]" : ""}`}>
      <View className="w-[39px]">
        <Text className="text-xs font-bold text-dia-ink">{day.label}</Text>
        <Text className="mt-0.5 text-[10px] text-dia-muted">{day.date}</Text>
      </View>
      <View className="h-2 w-2 rounded-full" style={{ backgroundColor: state.bg }} />
      <Text className="flex-1 text-[11px] text-dia-muted">{state.label}</Text>
      <Text className="text-[11px] text-dia-ink">
        {day.fc} <Text className="text-[9px] text-dia-muted">bpm</Text>
      </Text>
      <Text className="text-[11px] text-dia-ink">
        {day.rmssd} <Text className="text-[9px] text-dia-muted">ms</Text>
      </Text>
      {day.hasLog && <View className="h-1.5 w-1.5 rounded-full bg-dia-primary" />}
    </View>
  );
}

export function WeekChartCard({ days, avgRmssd }: { days: DayData[]; avgRmssd: string }) {
  return (
    <AppCard>
      <SectionLabel>FC por dia</SectionLabel>
      <FcBarChart days={days} />
      <View className="mt-3 flex-row justify-between border-t border-dia-border pt-3">
        <Text className="text-[11px] leading-[17px] text-dia-muted">RMSSD medio semanal</Text>
        <Text className="text-[13px] font-semibold text-dia-ink">{avgRmssd} ms</Text>
      </View>
    </AppCard>
  );
}

export function WeekDaysCard({ days }: { days: DayData[] }) {
  return (
    <AppCard>
      <SectionLabel>Dias da semana</SectionLabel>
      {days.map((day, index) => (
        <DayRow key={day.label} day={day} isToday={index === days.length - 1} />
      ))}
      <View className="mt-2.5 flex-row items-center gap-1.5">
        <View className="h-1.5 w-1.5 rounded-full bg-dia-primary" />
        <Text className="text-[11px] leading-[17px] text-dia-muted">Registro da familia neste dia</Text>
      </View>
    </AppCard>
  );
}

export function FamilyLogsCard({ logs }: { logs: FamilyLogData[] }) {
  return (
    <AppCard>
      <SectionLabel>Registros da familia</SectionLabel>
      {logs.map((log) => (
        <View className="mb-3 flex-row gap-2.5" key={log.date}>
          <Text className="text-lg">{log.icon}</Text>
          <View className="flex-1">
            <Text className="text-xs font-bold text-dia-ink">{log.label}</Text>
            <Text className="text-[11px] leading-[17px] text-dia-muted">{log.note}</Text>
            <Text className="mt-0.5 text-[10px] text-dia-muted">{log.date}</Text>
          </View>
        </View>
      ))}
    </AppCard>
  );
}

export function BodySignalsDisclaimer() {
  return (
    <View className="rounded-xl border border-dia-warning-border bg-dia-warning p-3">
      <Text className="text-[11px] leading-[17px] text-dia-warning-text">
        <Text className="font-bold">Aviso:</Text> Os dados descrevem sinais do corpo, nao emocoes nem diagnostico.
      </Text>
    </View>
  );
}
