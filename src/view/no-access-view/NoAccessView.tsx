import { StyleSheet, Text, View } from "react-native";

export default function NoAccessView() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Access unavailable</Text>
      <Text style={styles.message}>
        You don’t have permission to view this content.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#334155",
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
  },
});
