import { supabase } from "@/data-access/supabase/client";
import { useEffect, useState, type ReactElement } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import Builder from "./Builder";

export const builder = new Builder();

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

        let initialScreen: ReactElement;

        if (data.session) {
          initialScreen = builder.makeMainPageSlider(setScreen);
          console.log(1);
          const listener = builder.subscribeToRoleAssignmentRealTime();
          console.log(2);
          await listener.subscribeNewShift();
          console.log(3);
          await builder.makeNewChatSubscription().subscribeChat();
          console.log(4);
          await builder.makeNewMessageSubscription().subscribeChat();
          console.log(5);
          await builder.makeNewTrainingSubscribe().subscribeChat();
          console.log(6);
          await builder.makeNewModuleSubscribe().subscribeModules();
          console.log(7);

          const business = await builder.makeMemberSubscribe();
          if (business !== undefined) await business.membetSubscribe();
          console.log(8);
          await builder.makeBusinessSubscribe().businessSubscribe();
          // await new ModuleRAMDisk().deleteAllModules();
          console.log(9);
          await builder.startupSync().startupSync();
        } else {
          initialScreen = builder.makeSignupView(setScreen);
        }

        if (cancelled) return;
        setScreen(initialScreen);

        setScreen(initialScreen);
      } catch (error) {
        if (!cancelled) {
          setFailed(true);
          throw error;
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
