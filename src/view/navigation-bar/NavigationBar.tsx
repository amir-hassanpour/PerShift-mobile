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
    label: "Hours",
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
  activeIndex:
    | ["Home"]
    | ["Messages"]
    | ["Trainings"]
    | ["Hours"]
    | ["Members"]
    | ["Profile"];
  onMainPress: () => void;
  onMessagesPress: () => void;
  onTrainingPress: () => void;
  onMembersPress: () => void;
  onProfilePress: () => void;
  onHoursPress: () => void;
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
            onPress={() => {
              switch (item.label) {
                case "Home":
                  this.props.activeIndex[0] = "Home";
                  this.props.onMainPress();
                  break;

                case "Messages":
                  this.props.activeIndex[0] = "Messages";
                  this.props.onMessagesPress();
                  break;

                case "Trainings":
                  this.props.activeIndex[0] = "Trainings";
                  this.props.onTrainingPress();
                  break;

                case "Members":
                  this.props.activeIndex[0] = "Members";
                  this.props.onMembersPress();
                  break;

                case "Profile":
                  this.props.activeIndex[0] = "Profile";
                  this.props.onProfilePress();
                  break;

                case "Hours":
                  this.props.activeIndex[0] = "Hours";
                  this.props.onHoursPress();
                  break;
              }
            }}
            style={({ pressed }) => [
              styles.button,
              this.props.activeIndex[0] === item.label && styles.buttonActive,
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
  buttonActive: {
    backgroundColor: "#EAF1FF",
  },
});
