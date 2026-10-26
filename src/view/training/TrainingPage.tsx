import { LoadTrainingsPageController } from "@/interface-adapter/training-page/load-trainings/LoadTrainingsPageController";
import { LoadTrainingsPageViewModel } from "@/interface-adapter/training-page/LoadTrainingsPageViewModel";
import { StatusBar } from "expo-status-bar";
import { SymbolView } from "expo-symbols";
import { Component } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type TrainingPageProps = {
  viewModel: LoadTrainingsPageViewModel;
  controller: LoadTrainingsPageController;
};

export class TrainingPage extends Component<TrainingPageProps> {
  private unsubscribe?: () => void;

  componentDidMount(): void {
    this.subscribeToViewModel();
    this.props.controller?.loadTrainingsPage({});
  }

  componentDidUpdate(previousProps: TrainingPageProps): void {
    if (previousProps.viewModel !== this.props.viewModel) {
      this.unsubscribe?.();
      this.subscribeToViewModel();
    }
  }

  componentWillUnmount(): void {
    this.unsubscribe?.();
  }

  private subscribeToViewModel(): void {
    this.unsubscribe = this.props.viewModel.subscribe?.(() => {
      this.forceUpdate();
    });
  }

  render() {
    const { trainings } = this.props.viewModel;

    return (
      <SafeAreaView style={styles.screen}>
        <StatusBar style="dark" />

        <View style={styles.page}>
          <View style={styles.brandHeader}>
            <Text style={styles.brandName}>
              Per<Text style={styles.brandAccent}>Shift</Text>
            </Text>
          </View>

          <View style={styles.controls}>
            <Text accessibilityRole="header" style={styles.title}>
              Training
            </Text>

            <Pressable
              disabled
              accessibilityRole="button"
              accessibilityLabel="Search training"
              accessibilityState={{ disabled: true }}
              style={styles.search}
            >
              <SymbolView
                name={{
                  ios: "magnifyingglass",
                  android: "search",
                  web: "search",
                }}
                tintColor="#718099"
                size={20}
                style={{ width: 20, height: 20 }}
              />

              <Text style={styles.searchText}>Search training</Text>
            </Pressable>
          </View>

          <FlatList
            style={styles.list}
            contentContainerStyle={styles.listContent}
            data={trainings}
            extraData={trainings.slice()}
            keyExtractor={(training) => training.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const name = item.name.trim() || "Unnamed training";
              const words = name.split(/\s+/);
              const first = Array.from(words[0])[0] || "?";
              const last =
                words.length > 1
                  ? Array.from(words[words.length - 1])[0] || ""
                  : "";

              // Assumes progress is a percentage from 0 to 100.
              const progress = Number.isFinite(item.progress)
                ? Math.round(Math.min(100, Math.max(0, item.progress)))
                : 0;

              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${name}, ${progress}% complete`}
                  onPress={() => {
                    // Training action intentionally left empty.
                  }}
                  style={({ pressed }) => [
                    styles.trainingRow,
                    pressed && styles.trainingRowPressed,
                  ]}
                >
                  <View style={styles.avatar} accessible={false}>
                    <Text style={styles.initials}>
                      {(first + last).toLocaleUpperCase()}
                    </Text>
                  </View>

                  <View style={styles.trainingInfo}>
                    <Text style={styles.trainingName} numberOfLines={1}>
                      {name}
                    </Text>

                    <Text style={styles.trainingDetail}>
                      {progress}% complete
                    </Text>
                  </View>
                </Pressable>
              );
            }}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  page: {
    flex: 1,
    width: "100%",
    maxWidth: 680,
    alignSelf: "center",
  },
  brandHeader: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 84,
    paddingTop: 18,
    paddingBottom: 20,
  },
  brandName: {
    color: "#152A4A",
    fontSize: 25,
    fontWeight: "800",
    letterSpacing: -1,
  },
  brandAccent: {
    color: "#2563EB",
  },
  controls: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    color: "#152A4A",
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.4,
    marginBottom: 18,
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 50,
    borderRadius: 16,
    backgroundColor: "#F5F8FF",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchText: {
    flex: 1,
    color: "#718099",
    fontSize: 15,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  trainingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E7ECF3",
  },
  trainingRowPressed: {
    backgroundColor: "#F5F8FF",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#EAF1FF",
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    color: "#2563EB",
    fontSize: 19,
    fontWeight: "700",
  },
  trainingInfo: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  trainingName: {
    color: "#152A4A",
    fontSize: 16,
    fontWeight: "600",
  },
  trainingDetail: {
    color: "#425675",
    fontSize: 14,
  },
});
