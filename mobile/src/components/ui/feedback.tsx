import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ErrorProps = {
  type: "error";
  errorText: string;
  onRetry: VoidFunction;
};

type LoadingProps = {
  type: "loading";
};

type Props = ErrorProps | LoadingProps;

function ErrorDefault({ onRetry, errorText }: Omit<ErrorProps, "type">) {
  return (
    <View className="flex-1 items-center justify-center bg-dia-background px-7">
      <Text className="text-center text-xl font-semibold text-dia-ink">
        Algo deu errado
      </Text>
      <Text className="mt-2 text-center text-[13px] leading-5 text-dia-muted">
        {errorText}
      </Text>
      <TouchableOpacity
        className="mt-[18px] rounded-full bg-dia-primary px-[18px] py-2.5"
        onPress={onRetry}
      >
        <Text className="text-xs font-bold text-white">Tentar novamente</Text>
      </TouchableOpacity>
    </View>
  );
}

function LoadingDefault() {
  return (
    <SafeAreaView>
      <View className="flex-1 items-center justify-center bg-dia-background px-7">
        <Text className="text-center text-xl font-semibold text-dia-ink">
          Carregando o resumo...
        </Text>
        <Text className="mt-2 text-center text-[13px] leading-5 text-dia-muted">
          Buscando os sinais registrados de Sofia.
        </Text>
      </View>
    </SafeAreaView>
  );
}

export function Feedback(props: Props) {
  switch (props.type) {
    case "error":
      return (
        <ErrorDefault onRetry={props.onRetry} errorText={props.errorText} />
      );

    case "loading":
      return <LoadingDefault />;

    default:
      return <></>;
  }
}
