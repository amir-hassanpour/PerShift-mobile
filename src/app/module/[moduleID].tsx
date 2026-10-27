import { useLocalSearchParams } from "expo-router";
import { useEffect, useState, type ReactElement } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { builder } from "../index";

export default function ModuleRoute() {
  const { moduleID, trainingID } = useLocalSearchParams<{
    moduleID: string;
    trainingID: string;
  }>();

  const [screen, setScreen] = useState<ReactElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    setScreen(null);
    setFailed(false);

    async function loadPage() {
      console.log("Module route params:", { moduleID, trainingID });
      try {
        if (!moduleID || !trainingID) {
          throw new Error("Missing module or training ID");
        }

        const page = await builder.makeModulePage(moduleID, trainingID);

        if (!cancelled) setScreen(page);
      } catch (error) {
        console.error("Could not load module:", error);

        if (!cancelled) setFailed(true);
      }
    }

    void loadPage();

    return () => {
      cancelled = true;
    };
  }, [moduleID, trainingID]);

  if (failed) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Could not load this module.</Text>
      </View>
    );
  }

  if (!screen) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return screen;
}
