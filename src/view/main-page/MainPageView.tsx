import { StatusBar } from "expo-status-bar";
import { SymbolView } from "expo-symbols";
import { Component } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AcceptBusinessRequestController } from "@/interface-adapter/main-page/accept-business-request/AcceptBusinessRequestController";
import { DeclineBusinessRequestController } from "@/interface-adapter/main-page/decline-business-request/DeclineBusinessRequestController";
import { LoadingMainPageController } from "@/interface-adapter/main-page/load-main-page/LoadingMainPageController";
import { LoadingMainPageStates } from "@/interface-adapter/main-page/load-main-page/LoadingMainPageState";
import { LoadingMainPageViewModel } from "@/interface-adapter/main-page/LoadingMainPageViewModel";

type MainPageProps = {
  controller: LoadingMainPageController;
  viewModel: LoadingMainPageViewModel;
  declineBusinessRequestController: DeclineBusinessRequestController;
  acceptBusinessRequestController: AcceptBusinessRequestController;
};

export class MainPageView extends Component<MainPageProps> {
  private unsubscribe?: () => void;

  componentDidMount(): void {
    this.unsubscribe = this.props.viewModel.subscribe(() => {
      this.forceUpdate();
    });

    try {
      this.props.controller.loadMainPage();
    } catch (error) {
      console.error("Failed to load main page:", error);
    }
  }

  componentWillUnmount(): void {
    this.unsubscribe?.();
  }

  renderMainContent() {
    const { state, shifts, requestedBusinesses, business } = {
      state: this.props.viewModel.state,
      shifts: this.props.viewModel.shifts,
      requestedBusinesses: this.props.viewModel.businessRequested,
      business: this.props.viewModel.businesses,
    };

    if (shifts.length > 0) {
      return (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your shifts</Text>
          </View>

          {shifts.map((shift) => (
            <Pressable
              key={shift.shiftID}
              accessibilityRole="button"
              onPress={() => {}}
              style={({ pressed }) => [
                styles.listItem,
                pressed && styles.itemPressed,
              ]}
            >
              <Text style={styles.itemTitle}>
                {shift.description || "Shift"}
              </Text>

              <Text style={styles.itemDetail}>
                {shift.startTime.toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
                {" · "}
                {shift.startTime.toLocaleTimeString(undefined, {
                  hour: "numeric",
                  minute: "2-digit",
                })}
                {" – "}
                {shift.endTime.toLocaleTimeString(undefined, {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </Text>
            </Pressable>
          ))}
        </>
      );
    }

    const showRequests =
      business.length === 0 || state === LoadingMainPageStates.NO_BUSINESS;
    const showCreateBusiness =
      showRequests || state === LoadingMainPageStates.NO_REQUEST;

    return (
      <>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {showRequests ? "Requested businesses" : "Your shifts"}
          </Text>
        </View>
        {showRequests && (
          <View style={styles.requestList}>
            {requestedBusinesses.map((business) => (
              <View
                key={business.id}
                style={[styles.listItem, styles.requestRow]}
              >
                <View style={styles.requestInfo}>
                  <Text style={styles.itemTitle}>{business.name}</Text>
                  <Text style={styles.itemDetail}>Pending</Text>
                </View>

                <View style={styles.requestActions}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Accept ${business.name}`}
                    onPress={async () => {
                      await this.props.acceptBusinessRequestController.acceptBusinessRequest(
                        business.id,
                      );
                    }}
                    style={({ pressed }) => [
                      styles.requestActionButton,
                      pressed && { opacity: 0.6 },
                    ]}
                  >
                    <SymbolView
                      name={{
                        ios: "checkmark",
                        android: "check",
                        web: "check",
                      }}
                      tintColor="#2563EB"
                      size={20}
                      style={{ width: 20, height: 20 }}
                    />
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Decline ${business.name}`}
                    onPress={async () => {
                      await this.props.declineBusinessRequestController.declineBusinessRequest(
                        business.id,
                      );
                    }}
                    style={({ pressed }) => [
                      styles.requestActionButton,
                      pressed && { opacity: 0.6 },
                    ]}
                  >
                    <SymbolView
                      name={{ ios: "xmark", android: "close", web: "close" }}
                      tintColor="#718099"
                      size={20}
                      style={{ width: 20, height: 20 }}
                    />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}

        {showCreateBusiness && (
          <Pressable
            accessibilityRole="button"
            onPress={() => {}}
            style={({ pressed }) => [
              styles.createButton,
              pressed && styles.createButtonPressed,
            ]}
          >
            <Text style={styles.createButtonText}>
              Create your own business
            </Text>
          </Pressable>
        )}
      </>
    );
  }
  render() {
    return (
      <SafeAreaView style={styles.screen}>
        <StatusBar style="dark" />

        <View style={styles.page}>
          <View style={styles.header}>
            <View style={styles.headerSpacer} />

            <Text style={styles.brandName}>
              Per<Text style={styles.brandAccent}>Shift</Text>
            </Text>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              onPress={() => {}}
              style={({ pressed }) => [
                styles.notificationButton,
                pressed && { backgroundColor: "#DBEAFE" },
              ]}
            >
              <SymbolView
                name={{
                  ios: "bell",
                  android: "notifications",
                  web: "notifications",
                }}
                tintColor="#2563EB"
                size={24}
                style={{ width: 24, height: 24 }}
              />
            </Pressable>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {this.renderMainContent()}
          </ScrollView>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 20,
  },
  headerSpacer: {
    width: 46,
    height: 46,
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
  notificationButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#EAF1FF",
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#152A4A",
    fontSize: 19,
    fontWeight: "700",
    letterSpacing: -0.4,
  },
  countBadge: {
    backgroundColor: "#EAF1FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  countText: {
    color: "#315DA8",
    fontSize: 11,
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    fontSize: 15,
    color: "#8A94A3",
    textAlign: "center",
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
  },
  requestList: {
    flexGrow: 1,
  },
  listItem: {
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E7ECF3",
  },
  itemPressed: {
    backgroundColor: "#EAF1FF",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#152A4A",
  },
  itemDetail: {
    marginTop: 6,
    fontSize: 13,
    color: "#718099",
    lineHeight: 20,
  },
  createButton: {
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 24,
    borderRadius: 14,
    backgroundColor: "#2563EB",
  },
  createButtonPressed: {
    backgroundColor: "#1D4ED8",
    transform: [{ scale: 0.98 }],
  },
  createButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
  requestRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  requestInfo: {
    flex: 1,
  },
  requestActions: {
    flexDirection: "row",
    gap: 8,
  },
  requestActionButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2EAF7",
    backgroundColor: "#F5F8FF",
    alignItems: "center",
    justifyContent: "center",
  },
});
