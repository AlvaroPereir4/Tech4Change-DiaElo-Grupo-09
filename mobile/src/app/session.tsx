import { Pressable, ScrollView, Text, View } from "react-native";

import { AppCard, BodySignalsDisclaimer } from "@/components";

type TalkPoint = {
  id: number;
  priority: "alta" | "media";
  title: string;
  detail: string;
  data: string;
};

const talkPoints: TalkPoint[] = [
  {
    id: 1,
    priority: "alta",
    title: "Tarde com maior ativacao esta semana",
    detail: "FC media de 104,53 bpm e atividade aumentada observados nas tardes de quarta e domingo.",
    data: "FC 104,53 bpm · Atividade 1,34",
  },
  {
    id: 2,
    priority: "alta",
    title: "Registro: dificuldade na troca de atividade",
    detail: "A familia registrou dificuldade na transicao de atividades na escola em 18/09, mesmo dia de maior ativacao.",
    data: "18/09 · Escola",
  },
  {
    id: 3,
    priority: "media",
    title: "RMSSD reduzido nas tardes",
    detail: "Variabilidade cardiaca menor nos periodos de maior ativacao. Padrao consistente ao longo da semana.",
    data: "RMSSD 18,2 ms (tarde) vs 28,4 ms (manha)",
  },
  {
    id: 4,
    priority: "media",
    title: "Manhas dentro do padrao habitual",
    detail: "Sinais das manhas estaveis ao longo da semana, um ponto de referencia positivo.",
    data: "FC 83,95 bpm · RMSSD 28,4 ms",
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.7px] text-dia-muted">
      {children}
    </Text>
  );
}

function TherapistCard() {
  return (
    <View className="mb-4 flex-row items-center gap-3 rounded-2xl border border-dia-border bg-dia-card p-[15px]">
      <View className="h-11 w-11 items-center justify-center rounded-full bg-[#CFE3DD]">
        <Text className="text-xl">👩‍⚕️</Text>
      </View>
      <View className="flex-1">
        <Text className="text-[13px] font-bold text-dia-ink">Dra. Mariana Costa</Text>
        <Text className="text-[11px] leading-[17px] text-dia-muted">Terapeuta Ocupacional</Text>
      </View>
      <View>
        <Text className="text-xs font-semibold text-dia-ink">24/09</Text>
        <Text className="text-[11px] leading-[17px] text-dia-muted">10:00h</Text>
      </View>
    </View>
  );
}

function TherapistSummary() {
  return (
    <AppCard>
      <SectionLabel>Resumo para a terapeuta</SectionLabel>
      <Text className="mb-3 text-[13px] leading-[21px] text-dia-ink">
        Na semana de 12 a 18 de setembro, Sofia apresentou <Text className="font-bold">4 dias com padrao calmo</Text> e{" "}
        <Text className="font-bold">2 dias com maior ativacao</Text>, especialmente nas tardes.
      </Text>
      <Text className="mb-3 text-[13px] leading-[21px] text-dia-ink">
        A <Text className="font-bold">tarde</Text> teve FC media de 104,53 bpm e maior atividade corporal. A familia
        registrou dificuldade na troca de atividades na escola no mesmo periodo.
      </Text>
      <Text className="mb-3 text-[13px] leading-[21px] text-dia-ink">
        As manhas se mantiveram dentro do padrao habitual de Sofia.
      </Text>
      <View className="rounded-[10px] bg-dia-background p-2.5">
        <Text className="text-[11px] leading-[17px] text-dia-muted">
          Gerado a partir de 110 leituras · 12-18/09/2026 · Garmin Forerunner
        </Text>
      </View>
    </AppCard>
  );
}

function TalkPointCard({ point }: { point: TalkPoint }) {
  const highPriority = point.priority === "alta";

  return (
    <View className={`mb-2.5 rounded-2xl border bg-dia-card p-[15px] ${highPriority ? "border-dia-alert-border" : "border-dia-border"}`}>
      <View className="mb-[7px] flex-row items-start gap-2">
        <Text className="flex-1 text-[13px] font-bold leading-[18px] text-dia-ink">{point.title}</Text>
        <Text className={`overflow-hidden rounded-full px-2 py-1 text-[10px] font-extrabold uppercase ${highPriority ? "bg-dia-alert text-dia-alert-text" : "bg-[#F0F1F8] text-dia-muted"}`}>
          {highPriority ? "Atencao" : "Contexto"}
        </Text>
      </View>
      <Text className="text-[11px] leading-[17px] text-dia-muted">{point.detail}</Text>
      <Text className="mt-2 text-[10px] text-dia-primary">{point.data}</Text>
    </View>
  );
}

export default function SessionScreen() {
  return (
    <ScrollView className="flex-1 bg-dia-background" contentContainerClassName="p-5 pb-8">
      <Text className="text-[22px] font-medium text-dia-ink">Proxima sessao</Text>
      <Text className="mb-5 mt-1 text-xs text-dia-muted">Com Dra. Mariana · 24 de setembro, 10h</Text>

      <TherapistCard />
      <TherapistSummary />

      <SectionLabel>Pontos para conversar</SectionLabel>
      {talkPoints.map((point) => (
        <TalkPointCard key={point.id} point={point} />
      ))}

      <Pressable className="mb-4 mt-1.5 items-center rounded-[14px] bg-dia-primary py-3.5 active:opacity-80" onPress={() => {}}>
        <Text className="text-sm font-bold text-white">Compartilhar com a terapeuta</Text>
      </Pressable>

      <BodySignalsDisclaimer />
    </ScrollView>
  );
}
