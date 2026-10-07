import { supabase } from "@/data-access/supabase/client";
import { useEffect, useState, type ReactElement } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import Builder from "./Builder";

const builder = new Builder();

export default function Index() {
  const [screen, setScreen] = useState<ReactElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialScreen() {
      try {
        const { data, error } = await supabase.auth.getSession();
        console.log(data?.session?.user.id);

        if (error) throw error;
        if (cancelled) return;

        const initialScreen = data.session
          ? builder.makeMainPageView()
          : builder.makeSignupView();

        setScreen(initialScreen);
      } catch (error) {
        if (!cancelled) {
          console.error("Could not restore session:", error);
          setFailed(true);
        }
      }
    }

    void loadInitialScreen();

    return () => {
      cancelled = true;
    };
  }, []);

  if (failed) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>
          Could not restore your session. Please restart and try again.
        </Text>
      </View>
    );
  }

  if (screen === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return screen;
}
