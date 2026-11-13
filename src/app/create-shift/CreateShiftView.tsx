import { useEffect, useState, type ReactElement } from "react";
import { ActivityIndicator, Text } from "react-native";
import { builder } from "../index";

export default function CreateShiftRoute() {
  const [page, setPage] = useState<ReactElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadPage() {
      try {
        const result = await builder.makeCreateShiftPage();

        if (!cancelled) {
          setPage(result);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Could not load Create Shift page:", error);
          setFailed(true);
        }
      }
    }

    void loadPage();

    return () => {
      cancelled = true;
    };
  }, []);

  if (failed) {
    return <Text>Unable to load the Create Shift page. Please try again.</Text>;
  }

  if (page === null) {
    return <ActivityIndicator size="large" />;
  }

  return page;
}
