import { Training } from "@/entity/Training";
import { LoadTrainingPageController } from "@/interface-adapter/training-page/training-page/laod-training-page/LoadTrainingPageController";
import { LoadTrainingPageViewModel } from "@/interface-adapter/training-page/training-page/LoadTrainingPageViewModel";
import { router } from "expo-router";
import { Component } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type TrainingPageProps = {
  training: Training;
  viewModel: LoadTrainingPageViewModel;
  controller: LoadTrainingPageController;
};

export class TrainingPage extends Component<TrainingPageProps> {
  private unsubscribe?: () => void;

  componentDidMount(): void {
    this.subscribeToViewModel();
    this.loadTraining();
  }

  componentDidUpdate(previousProps: TrainingPageProps): void {
    if (previousProps.viewModel !== this.props.viewModel) {
      this.unsubscribe?.();
      this.subscribeToViewModel();
    }

    if (
      previousProps.training.id !== this.props.training.id ||
      previousProps.controller !== this.props.controller
    ) {
      this.loadTraining();
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

  private loadTraining(): void {
    this.props.controller?.loadTrainingPage(this.props.training.id);
  }

  render() {
    const { name, modules } = {
      name: this.props.training.name,
      modules: this.props.viewModel.modules,
    };

    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.page}>
          <View style={styles.brandHeader}>
            <Text style={styles.brandName}>
              Per<Text style={styles.brandAccent}>Shift</Text>
            </Text>
          </View>

          <View style={styles.controls}>
            <View style={styles.titleRow}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Go back"
                onPress={() => {
                  if (router.canGoBack()) {
                    router.back();
                  } else {
                    router.replace("/");
                  }
                }}
                style={styles.backButton}
              >
                <Text style={styles.backIcon}>‹</Text>
              </Pressable>

              <Text
                accessibilityRole="header"
                style={styles.title}
                numberOfLines={2}
              >
                {name || "Training"}
              </Text>
            </View>

            <TextInput
              editable={false}
              placeholder="Search modules"
              placeholderTextColor="#718099"
              accessibilityLabel="Search modules"
              accessibilityState={{ disabled: true }}
              style={styles.search}
            />

            <Text accessibilityRole="header" style={styles.listTitle}>
              Training modules
            </Text>
          </View>

          <FlatList
            style={styles.list}
            contentContainerStyle={styles.listContent}
            data={modules}
            extraData={modules.slice()}
            keyExtractor={(module) => module.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={item.header}
                onPress={() => {
                  router.push({
                    pathname: "/module/[moduleID]",
                    params: {
                      moduleID: item.id,
                      trainingID: item.training_id,
                    },
                  });
                }}
                style={({ pressed }) => [
                  styles.moduleRow,
                  pressed && styles.moduleRowPressed,
                ]}
              >
                <View style={styles.avatar} accessible={false}>
                  <Text style={styles.moduleNumber}>{index + 1}</Text>
                </View>

                <Text style={styles.moduleName} numberOfLines={2}>
                  {item.header}
                </Text>
              </Pressable>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No modules to display.</Text>
            }
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
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#EAF1FF",
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    color: "#2563EB",
    fontSize: 32,
    lineHeight: 36,
  },
  title: {
    flex: 1,
    color: "#152A4A",
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.4,
  },
  search: {
    minHeight: 50,
    borderRadius: 16,
    backgroundColor: "#F5F8FF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#718099",
    fontSize: 15,
  },
  listTitle: {
    marginTop: 18,
    marginBottom: 8,
    color: "#152A4A",
    fontSize: 17,
    fontWeight: "700",
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  moduleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E7ECF3",
  },
  moduleRowPressed: {
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
  moduleNumber: {
    color: "#2563EB",
    fontSize: 19,
    fontWeight: "700",
  },
  moduleName: {
    flex: 1,
    color: "#152A4A",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyText: {
    padding: 24,
    textAlign: "center",
    color: "#718099",
    fontSize: 15,
  },
});
