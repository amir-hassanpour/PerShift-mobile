import { useLocalSearchParams } from "expo-router";
import { useEffect, useState, type ReactElement } from "react";
import { ActivityIndicator, Text } from "react-native";
import { builder } from "../index";

export default function ChatRoute() {
  const { chatID } = useLocalSearchParams<{ chatID: string }>();

  const [page, setPage] = useState<ReactElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setPage(null);
    setError(null);

    async function loadChatPage() {
      try {
        const chatPage = await builder.makeChatPage(chatID);

        if (!cancelled) {
          setPage(chatPage);
        }
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setError("Could not open this chat.");
        }
      }
    }

    void loadChatPage();

    return () => {
      cancelled = true;
    };
  }, [chatID]);

  if (error) return <Text>{error}</Text>;
  if (page === null) return <ActivityIndicator />;

  return page;
}
