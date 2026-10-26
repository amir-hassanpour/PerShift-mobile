import { SymbolView } from "expo-symbols";
import { Component } from "react";
import { Pressable, StyleSheet, View } from "react-native";

const items = [
  {
    label: "Home",
    icon: {
      ios: "house",
      android: "home",
      web: "home",
    },
  },
  {
    label: "Messages",
    icon: { ios: "bubble.left", android: "chat_bubble", web: "chat_bubble" },
  },
  {
    label: "Trainings",
    icon: { ios: "book", android: "menu_book", web: "menu_book" },
  },
  {
    label: "Performance",
    icon: { ios: "chart.bar", android: "bar_chart", web: "bar_chart" },
  },
  {
    label: "Members",
    icon: { ios: "person.3", android: "groups", web: "groups" },
  },
  {
    label: "Profile",
    icon: {
      ios: "person.crop.circle",
      android: "account_circle",
      web: "account_circle",
    },
  },
] as const;

type NavigationBarProps = {
  onMainPress: () => void;
  onMessagesPress: () => void;
  onTrainingPress: () => void;
};

export class NavigationBar extends Component<NavigationBarProps> {
  render() {
    return (
      <View style={styles.container}>
        {items.map((item) => (
          <Pressable
            key={item.label}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            onPress={
              item.label === "Messages"
                ? this.props.onMessagesPress
                : item.label === "Home"
                  ? this.props.onMainPress
                  : item.label === "Trainings"
                    ? this.props.onTrainingPress
                    : undefined
            }
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            <SymbolView
              name={item.icon}
              tintColor="#2563EB"
              size={25}
              style={styles.icon}
            />
          </Pressable>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#E2EAF7",
    paddingHorizontal: 4,
    paddingVertical: 10,
    boxShadow: "0px 8px 24px rgba(30, 64, 175, 0.08)",
  },
  button: {
    flex: 1,
    minWidth: 0,
    minHeight: 62,
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingHorizontal: 2,
    paddingVertical: 8,
    borderRadius: 18,
  },
  buttonPressed: {
    backgroundColor: "#EAF1FF",
    transform: [{ scale: 0.96 }],
  },
  icon: {
    width: 25,
    height: 25,
  },
  label: {
    color: "#425675",
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
  },
});
