import { useState } from "react";
import { ScrollView, Switch, Text, View } from "react-native";

type RowProps = {
  icon: string;
  label: string;
  value?: string;
  right?: React.ReactNode;
  last?: boolean;
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="mb-5">
      <Text className="mb-2.5 text-[11px] font-extrabold uppercase tracking-[0.7px] text-dia-muted">
        {title}
      </Text>
      <View className="overflow-hidden rounded-2xl border border-dia-border bg-dia-card">
        {children}
      </View>
    </View>
  );
}

function Row({ icon, label, value, right, last = false }: RowProps) {
  return (
    <View className={`min-h-[66px] flex-row items-center gap-3 px-[15px] py-3 ${last ? "" : "border-b border-dia-border"}`}>
      <Text className="w-6 text-center text-lg">{icon}</Text>
      <View className="flex-1">
        <Text className="mb-0.5 text-[13px] font-semibold text-dia-ink">{label}</Text>
        {value && <Text className="text-xs leading-[18px] text-dia-muted">{value}</Text>}
      </View>
      {right}
    </View>
  );
}

function Header() {
  return (
    <View className="mb-6 flex-row items-center gap-4">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-[#CFE3DD]">
        <Text className="text-3xl">🌿</Text>
      </View>
      <View>
        <Text className="text-[22px] font-medium text-dia-ink">Sofia</Text>
        <Text className="text-xs leading-[18px] text-dia-muted">7 anos · Desde jun. 2026</Text>
      </View>
    </View>
  );
}

function MedicalDisclaimer() {
  return (
    <View className="rounded-[14px] border border-dia-warning-border bg-dia-warning p-3.5">
      <Text className="text-xs leading-[19px] text-dia-warning-text">
        <Text className="font-bold">DiaElo nao e um aplicativo medico.</Text> Os dados descrevem sinais do corpo, nao
        emocoes nem diagnostico. Sempre consulte profissionais de saude qualificados.
      </Text>
    </View>
  );
}

export default function ProfileScreen() {
  const [notifications, setNotifications] = useState(true);
  const [dataSharing, setDataSharing] = useState(true);
  const [anonymize, setAnonymize] = useState(false);

  const switchProps = (value: boolean, onValueChange: (value: boolean) => void) => ({
    value,
    onValueChange,
    trackColor: { false: "#D8D3CB", true: "#AAB7E8" },
    thumbColor: value ? "#4E5FA3" : "#FFF",
  });

  return (
    <ScrollView className="flex-1 bg-dia-background" contentContainerClassName="p-5 pb-8">
      <Header />

      <Section title="Crianca">
        <Row icon="👧" label="Nome" value="Sofia Menezes" />
        <Row icon="🎂" label="Nascimento" value="14 de marco de 2019 (7 anos)" />
        <Row icon="🏷️" label="Diagnostico" value="Nao informado no app" last />
      </Section>

      <Section title="Terapeuta">
        <Row icon="👩‍⚕️" label="Dra. Mariana Costa" value="Terapeuta Ocupacional" />
        <Row icon="📅" label="Proxima sessao" value="24 de setembro, 10h" last />
      </Section>

      <Section title="Dispositivo">
        <Row
          icon="⌚"
          label="Garmin Forerunner 245"
          value="Conectado · Ultima sincronia: hoje, 18:42"
          right={<View className="h-2 w-2 rounded-full bg-[#7AAE8E]" />}
        />
        <Row icon="📊" label="Metricas coletadas" value="FC, RMSSD, atividade" />
        <Row icon="🔋" label="Bateria do dispositivo" value="74%" last />
      </Section>

      <Section title="Privacidade">
        <Row
          icon="🔔"
          label="Notificacoes"
          value="Alertas de mudanca observada"
          right={<Switch {...switchProps(notifications, setNotifications)} />}
        />
        <Row
          icon="🤝"
          label="Compartilhar com terapeuta"
          value="Resumo semanal automatico"
          right={<Switch {...switchProps(dataSharing, setDataSharing)} />}
        />
        <Row
          icon="🔒"
          label="Anonimizar dados"
          value="Remover nome nos relatorios"
          right={<Switch {...switchProps(anonymize, setAnonymize)} />}
          last
        />
      </Section>

      <Section title="Sobre o DiaElo">
        <Row icon="📋" label="Versao" value="0.0.1 (MVP)" />
        <Row icon="❓" label="Como funciona" value="O contexto da semana chega antes da sessao." />
        <Row icon="📧" label="Contato e suporte" value="suporte@diaelo.app" last />
      </Section>

      <MedicalDisclaimer />
      <Text className="mt-4 text-center text-[11px] text-dia-muted">DiaElo · v0.0.1 · 2026</Text>
    </ScrollView>
  );
}
