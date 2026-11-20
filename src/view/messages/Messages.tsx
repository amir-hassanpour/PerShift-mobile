import { LoadingMessagesPageController } from "@/interface-adapter/messages/loading-messages-page/LoadingMessagesPageController";
import { LoadingMessagesPageViewModel } from "@/interface-adapter/messages/LoadingMessagesPageViewModel";
import { ScrollChatsController } from "@/interface-adapter/messages/scroll-chats/ScrollChatsController";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SymbolView } from "expo-symbols";
import { Component, type ReactElement } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type MessagesProps = {
  controller: LoadingMessagesPageController;
  viewModel: LoadingMessagesPageViewModel;
  scrollViewController: ScrollChatsController;
  makeChatPage: (chat_id: string) => Promise<ReactElement>;
};

type MessagesState = {
  searchQuery: string;
  loadingMore: boolean;
  scrollError: string | null;
};

export class Messages extends Component<MessagesProps, MessagesState> {
  state: MessagesState = {
    searchQuery: "",
    loadingMore: false,
    scrollError: null,
  };

  private unsubscribe?: () => void;
  private mounted = false;

  private bottomHitCount = 0;
  private bottomHitArmed = false;
  private requestInFlight = false;

  componentDidMount(): void {
    this.mounted = true;
    this.subscribeToViewModel();

    this.props.controller.loadMainPageController();
  }

  componentDidUpdate(previousProps: MessagesProps): void {
    if (previousProps.viewModel !== this.props.viewModel) {
      this.unsubscribe?.();
      this.subscribeToViewModel();
    }
  }

  componentWillUnmount(): void {
    this.mounted = false;
    this.unsubscribe?.();
  }

  private subscribeToViewModel(): void {
    this.unsubscribe = this.props.viewModel.subscribe(() => {
      if (this.mounted) {
        this.forceUpdate();
      }
    });
  }

  private handleSearchChange = (searchQuery: string): void => {
    // Filtering changes the list's size. Don't treat that as a bottom hit.
    this.bottomHitArmed = false;

    this.setState({
      searchQuery,
      scrollError: null,
    });
  };

  private handleScrollBeginDrag = (): void => {
    // Only a user gesture can arm the next bottom hit.
    this.bottomHitArmed =
      !this.requestInFlight && this.state.searchQuery.trim() === "";
  };

  private handleScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ): void => {
    if (this.requestInFlight || this.state.searchQuery.trim() !== "") {
      return;
    }

    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;

    const distanceFromBottom =
      contentSize.height - layoutMeasurement.height - contentOffset.y;

    // Leaving the bottom allows another hit when the user returns.
    if (distanceFromBottom > 48) {
      this.bottomHitArmed = true;
      return;
    }

    if (distanceFromBottom <= 16) {
      void this.handleBottomReached();
    }
  };

  private handleBottomReached = async (): Promise<void> => {
    if (
      !this.mounted ||
      !this.bottomHitArmed ||
      this.requestInFlight ||
      this.state.searchQuery.trim() !== "" ||
      this.props.viewModel.chats.length === 0
    ) {
      return;
    }

    // Lock immediately so repeated scroll events cannot duplicate requests.
    this.bottomHitArmed = false;
    this.requestInFlight = true;
    this.bottomHitCount += 1;

    this.setState({
      loadingMore: true,
      scrollError: null,
    });

    try {
      await this.props.scrollViewController.scrolleView({
        numChats: this.bottomHitCount,
      });

      // Your existing view-model subscription refreshes the chat data.
    } catch (error) {
      console.error("Failed to load more chats:", error);

      if (this.mounted) {
        this.setState({
          scrollError: "Could not load more chats.",
        });
      }
    } finally {
      this.requestInFlight = false;

      if (this.mounted) {
        this.setState({ loadingMore: false });
      }
    }
  };

  render() {
    const chats = this.props.viewModel.chats ?? [];
    const query = this.state.searchQuery.trim().toLocaleLowerCase();

    const filteredChats = chats.filter((chat) =>
      chat.name.toLocaleLowerCase().includes(query),
    );

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
            <View style={styles.titleRow}>
              <Text accessibilityRole="header" style={styles.title}>
                Messages
              </Text>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Create chat"
                onPress={() => {
                  router.push("/create-chat/CreateChatView");
                }}
                style={styles.composeButton}
              >
                <SymbolView
                  name={{
                    ios: "square.and.pencil",
                    android: "edit_square",
                    web: "edit_square",
                  }}
                  tintColor="#2563EB"
                  size={23}
                  style={{ width: 23, height: 23 }}
                />
              </Pressable>
            </View>

            <View style={styles.search}>
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

              <TextInput
                value={this.state.searchQuery}
                onChangeText={this.handleSearchChange}
                placeholder="Search chats"
                placeholderTextColor="#718099"
                accessibilityLabel="Search chats by name"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
                style={styles.searchText}
              />
            </View>

            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>Your chats</Text>
            </View>
          </View>

          <FlatList
            style={styles.list}
            contentContainerStyle={styles.listContent}
            data={filteredChats}
            keyExtractor={(chat) => chat.id}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            onScrollBeginDrag={this.handleScrollBeginDrag}
            onScroll={this.handleScroll}
            scrollEventThrottle={16}
            renderItem={({ item }) => {
              const names = item.name.trim().split(/\s+/);
              const first = Array.from(names[0] || "?")[0];
              const last =
                names.length > 1 ? Array.from(names[names.length - 1])[0] : "";

              const lastTexted =
                item.lastTextedAt && !Number.isNaN(item.lastTextedAt.getTime())
                  ? item.lastTextedAt.toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })
                  : null;

              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Open chat with ${item.name}`}
                  onPress={() => {
                    router.push({
                      pathname: "/chat/[chatID]",
                      params: { chatID: item.id },
                    });
                  }}
                  style={({ pressed }) => [
                    styles.chatRow,
                    pressed && styles.chatRowPressed,
                  ]}
                >
                  <View style={styles.avatar} accessible={false}>
                    <Text style={styles.initials}>
                      {(first + last).toLocaleUpperCase()}
                    </Text>
                  </View>

                  <View style={styles.chatInfo}>
                    <Text style={styles.chatName} numberOfLines={1}>
                      {item.name}
                    </Text>

                    <Text style={styles.chatDetail}>
                      {item.messageCount}{" "}
                      {item.messageCount === 1 ? "message" : "messages"}
                    </Text>

                    <Text style={styles.lastTexted}>
                      {lastTexted
                        ? `Last texted ${lastTexted}`
                        : "No messages sent yet"}
                    </Text>
                  </View>
                </Pressable>
              );
            }}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <View style={styles.emptyIcon}>
                  <SymbolView
                    name={{
                      ios: "bubble.left.and.bubble.right",
                      android: "forum",
                      web: "forum",
                    }}
                    tintColor="#2563EB"
                    size={32}
                    style={{ width: 32, height: 32 }}
                  />
                </View>

                <Text style={styles.emptyTitle}>
                  {query ? "No chats found" : "No messages yet"}
                </Text>

                {query !== "" && (
                  <Text style={styles.emptyDetail}>Try a different name.</Text>
                )}
              </View>
            }
            ListFooterComponent={
              query === "" &&
              (this.state.loadingMore || this.state.scrollError) ? (
                <View style={styles.listFooter}>
                  {this.state.loadingMore ? (
                    <ActivityIndicator
                      color="#2563EB"
                      accessibilityLabel="Loading more chats"
                    />
                  ) : (
                    <Text
                      accessibilityLiveRegion="polite"
                      style={styles.errorText}
                    >
                      {this.state.scrollError}
                    </Text>
                  )}
                </View>
              ) : undefined
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
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 18,
  },
  title: {
    flex: 1,
    color: "#152A4A",
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.4,
  },
  composeButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#EAF1FF",
    alignItems: "center",
    justifyContent: "center",
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
    minWidth: 0,
    color: "#152A4A",
    fontSize: 15,
    paddingVertical: 0,
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 8,
  },
  listTitle: {
    color: "#152A4A",
    fontSize: 17,
    fontWeight: "700",
  },
  list: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  chatRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E7ECF3",
  },
  chatRowPressed: {
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
  chatInfo: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  chatName: {
    color: "#152A4A",
    fontSize: 16,
    fontWeight: "600",
  },
  chatDetail: {
    color: "#425675",
    fontSize: 14,
  },
  lastTexted: {
    color: "#718099",
    fontSize: 12,
    lineHeight: 18,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 36,
    gap: 10,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: "#EAF1FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  emptyTitle: {
    color: "#152A4A",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  emptyDetail: {
    color: "#718099",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
  listFooter: {
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  errorText: {
    color: "#B42318",
    fontSize: 13,
    textAlign: "center",
  },
});
