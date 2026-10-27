import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState, type ReactElement } from "react";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { builder } from "../index";

type PageState =
  | { trainingId: string; status: "loading" }
  | { trainingId: string; status: "ready"; page: ReactElement }
  | { trainingId: string; status: "error" };

export default function TrainingRoute() {
  const makeTrainingPage = builder.makeTrainingPage;

  const { trainingID } = useLocalSearchParams<{
    trainingID?: string | string[];
  }>();

  const trainingId = Array.isArray(trainingID) ? trainingID[0] : trainingID;

  const [state, setState] = useState<PageState | null>(null);

  useEffect(() => {
    if (!trainingId) return;

    let cancelled = false;

    setState({ trainingId, status: "loading" });

    async function buildPage() {
      try {
        const page = await makeTrainingPage(trainingId!);

        if (!cancelled) {
          setState({ trainingId: trainingId!, status: "ready", page });
        }
      } catch {
        if (!cancelled) {
          setState({ trainingId: trainingId!, status: "error" });
        }
      }
    }

    void buildPage();

    return () => {
      cancelled = true;
    };
  }, [trainingId]);

  let content: ReactElement;

  if (!trainingId) {
    content = (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.message}>No training selected.</Text>
      </SafeAreaView>
    );
  } else if (
    !state ||
    state.trainingId !== trainingId ||
    state.status === "loading"
  ) {
    content = (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator
          size="large"
          color="#2563EB"
          accessibilityLabel="Loading training"
        />
      </SafeAreaView>
    );
  } else if (state.status === "error") {
    content = (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.message}>Unable to load this training.</Text>
      </SafeAreaView>
    );
  } else {
    content = state.page;
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      {content}
    </>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#FFFFFF",
  },
  message: {
    color: "#718099",
    fontSize: 16,
    textAlign: "center",
  },
});
