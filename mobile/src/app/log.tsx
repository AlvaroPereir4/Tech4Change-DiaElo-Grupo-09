import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

type Category = {
  id: string;
  label: string;
  icon: string;
  color: string;
  options: string[];
};

const categories: Category[] = [
  { id: "sono", label: "Sono", icon: "😴", color: "#4E5FA3", options: ["Dormiu bem", "Demorou pra dormir", "Acordou de madrugada", "Acordou descansada", "Cochilou"] },
  { id: "alimentacao", label: "Alimentacao", icon: "🍽️", color: "#7AAE8E", options: ["Aceitou bem", "Recusou alimentos", "Comeu pouco", "Seletividade aumentada", "Apetite normal"] },
  { id: "escola", label: "Escola", icon: "🏫", color: "#D4A853", options: ["Dia tranquilo", "Dificuldade na transicao", "Conflito com colega", "Boa participacao", "Dia dificil"] },
  { id: "comportamento", label: "Comportamento", icon: "📝", color: "#9B72CF", options: ["Mais tranquilo que o usual", "Mais agitado", "Resistencia a pedidos", "Birras", "Bem-humorada"] },
  { id: "sensibilidade", label: "Sensibilidade", icon: "🌊", color: "#4EA3B0", options: ["Sem episodios", "Sensivel a barulho", "Sensivel a toque", "Evitou texturas", "Busca de estimulo"] },
  { id: "bemestar", label: "Bem-estar", icon: "💚", color: "#7AAE8E", options: ["Boa disposicao", "Cansada", "Queixou de dor", "Animada", "Apatica"] },
  { id: "outro", label: "Outro", icon: "✏️", color: "#7A7269", options: [] },
];

const recentLogs = [
  ["🏫", "Escola", "Dia dificil na troca de atividade", "hoje, 18/09"],
  ["😴", "Sono", "Dormiu bem, acordou descansada", "15/09"],
  ["📝", "Comportamento", "Mais resistencia a tarde", "14/09"],
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text className="mb-2.5 mt-1 text-[11px] font-extrabold uppercase tracking-[0.7px] text-dia-muted">
      {children}
    </Text>
  );
}

function SavedState() {
  return (
    <View className="flex-1 items-center justify-center bg-dia-background px-10">
      <Text className="mb-4 text-[52px]">✅</Text>
      <Text className="mb-2 text-[22px] font-medium text-dia-ink">Registro salvo</Text>
      <Text className="text-center text-sm leading-[21px] text-dia-muted">
        Sera incluido no contexto da semana e no resumo para a terapeuta.
      </Text>
    </View>
  );
}

function CategoryButton({ item, selected, onPress }: { item: Category; selected: boolean; onPress: VoidFunction }) {
  return (
    <Pressable
      className="min-h-[88px] w-[30%] items-center justify-center gap-1.5 rounded-[14px] border p-2"
      onPress={onPress}
      style={{
        backgroundColor: selected ? item.color : "#F8F5F0",
        borderColor: selected ? item.color : "#E9E3D8",
      }}
    >
      <Text className="text-2xl">{item.icon}</Text>
      <Text className={`text-center text-[11px] font-bold ${selected ? "text-white" : "text-dia-ink"}`}>
        {item.label}
      </Text>
    </Pressable>
  );
}

function OptionChip({ option, selected, color, onPress }: { option: string; selected: boolean; color: string; onPress: VoidFunction }) {
  return (
    <Pressable
      className="rounded-full border px-3.5 py-2"
      onPress={onPress}
      style={{
        backgroundColor: selected ? color : "#F8F5F0",
        borderColor: selected ? color : "#E9E3D8",
      }}
    >
      <Text className={`text-xs font-semibold ${selected ? "text-white" : "text-dia-ink"}`}>{option}</Text>
    </Pressable>
  );
}

function RecentLog({ icon, label, detail, date }: { icon: string; label: string; detail: string; date: string }) {
  return (
    <View className="mb-2 flex-row items-center gap-2.5 rounded-xl border border-dia-border bg-dia-card p-2.5">
      <Text className="text-xl">{icon}</Text>
      <View className="flex-1">
        <Text className="text-xs font-bold text-dia-ink">{label}</Text>
        <Text className="text-[11px] leading-[17px] text-dia-muted">{detail}</Text>
      </View>
      <Text className="text-[10px] text-dia-muted">{date}</Text>
    </View>
  );
}

export default function LogScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const category = categories.find((item) => item.id === selectedCategory);
  const canSave = Boolean(selectedCategory && (selectedOptions.length > 0 || note.trim()));

  const selectCategory = (id: string) => {
    setSelectedCategory(id);
    setSelectedOptions([]);
    setNote("");
  };

  const toggleOption = (option: string) => {
    setSelectedOptions((current) =>
      current.includes(option) ? current.filter((item) => item !== option) : [...current, option],
    );
  };

  if (saved) {
    return <SavedState />;
  }

  return (
    <ScrollView className="flex-1 bg-dia-background" contentContainerClassName="p-5 pb-8">
      <Text className="text-[22px] font-medium text-dia-ink">Registrar</Text>
      <Text className="mb-5 mt-1 text-xs text-dia-muted">Sofia · 18 de setembro</Text>

      <SectionLabel>O que voce quer registrar?</SectionLabel>
      <View className="mb-[18px] flex-row flex-wrap gap-2.5">
        {categories.map((item) => (
          <CategoryButton
            key={item.id}
            item={item}
            selected={selectedCategory === item.id}
            onPress={() => selectCategory(item.id)}
          />
        ))}
      </View>

      {category && category.options.length > 0 && (
        <>
          <SectionLabel>O que aconteceu?</SectionLabel>
          <View className="mb-4 flex-row flex-wrap gap-2">
            {category.options.map((option) => (
              <OptionChip
                key={option}
                option={option}
                selected={selectedOptions.includes(option)}
                color={category.color}
                onPress={() => toggleOption(option)}
              />
            ))}
          </View>
        </>
      )}

      {selectedCategory && (
        <>
          <SectionLabel>Observacao livre (opcional)</SectionLabel>
          <TextInput
            className="mb-4 min-h-[90px] rounded-[14px] border border-dia-border bg-dia-card p-3 text-[13px] text-dia-ink"
            multiline
            numberOfLines={3}
            onChangeText={setNote}
            placeholder="Descreva o que aconteceu com suas palavras..."
            placeholderTextColor="#A39B92"
            textAlignVertical="top"
            value={note}
          />
        </>
      )}

      {canSave && (
        <Pressable className="mb-[18px] items-center rounded-[14px] bg-dia-primary p-3.5" onPress={() => setSaved(true)}>
          <Text className="text-sm font-bold text-white">Salvar registro</Text>
        </Pressable>
      )}

      <SectionLabel>Registros recentes</SectionLabel>
      {recentLogs.map(([icon, label, detail, date]) => (
        <RecentLog key={date} icon={icon} label={label} detail={detail} date={date} />
      ))}
    </ScrollView>
  );
}
