import { PeriodNotes } from "@/types";
import { Text, View } from "react-native";

function AttentionItem({
  color,
  title,
  children,
}: {
  color: string;
  title: string;
  children: string;
}) {
  return (
    <View className="flex-row gap-2.5">
      <View
        className="min-h-[42px] w-[3px] rounded-sm"
        style={{ backgroundColor: color }}
      />
      <View className="flex-1">
        <Text className="mb-0.5 text-[13px] font-bold text-dia-ink">
          {title}
        </Text>
        <Text className="text-xs leading-[18px] text-dia-muted">
          {children}
        </Text>
      </View>
    </View>
  );
}

export function AttentionCard({ notes }: { notes: PeriodNotes[] }) {
  return (
    <View className="rounded-2xl border-[1.5px] border-dia-alert-border bg-white p-4 shadow-sm">
      <View className="mb-3.5 flex-row items-center gap-2">
        <View className="h-2.5 w-2.5 rounded-full bg-[#D46C5E]" />
        <Text className="text-xs font-extrabold uppercase tracking-[0.7px] text-dia-alert-text">
          O que chamou atenção
        </Text>
      </View>
      <View className="gap-3">
        {notes?.map((note) => (
          <AttentionItem color={note.color} title={note.title}>
            {note.note}
          </AttentionItem>
        ))}
      </View>
      <View className="mt-3.5 rounded-[12px] border border-dia-warning-border bg-dia-warning px-3 py-2.5">
        <Text className="text-[12px] leading-4 text-dia-warning-text">
          <Text className="font-bold">Aviso:</Text> Os dados descrevem sinais do
          corpo, não emoções nem diagnóstico.
        </Text>
      </View>
    </View>
  );
}
