import { Chat } from "@/entity/Chat";
import { LoadingMessagesPageViewModel } from "@/interface-adapter/messages/LoadingMessagesPageViewModel";
import { StatusBar } from "expo-status-bar";
import { SymbolView } from "expo-symbols";
import { Component } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type MessagesProps = {
  viewModel: LoadingMessagesPageViewModel;
};

export type props = {
  chats: Chat[];
};

export class Messages extends Component<MessagesProps> {
  private unsubscribe?: () => void;

  componentDidMount(): void {
    this.subscribeToViewModel();
  }

  componentDidUpdate(previousProps: MessagesProps): void {
    if (previousProps.viewModel !== this.props.viewModel) {
      this.unsubscribe?.();
      this.subscribeToViewModel();
    }
  }

  componentWillUnmount(): void {
    this.unsubscribe?.();
  }

  private subscribeToViewModel(): void {
    this.unsubscribe = this.props.viewModel.subscribe(() => {
      this.forceUpdate();
    });
  }

  render() {
    const { chats }: props = { chats: [] };

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
                disabled
                accessibilityRole="button"
                accessibilityLabel="New message"
                accessibilityState={{ disabled: true }}
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

            <Pressable
              disabled
              accessibilityRole="button"
              accessibilityLabel="Search messages"
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
              <Text style={styles.searchText}>Search messages</Text>
            </Pressable>

            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>Your chats</Text>
            </View>
          </View>

          <FlatList
            style={styles.list}
            contentContainerStyle={styles.listContent}
            data={chats}
            extraData={chats.slice()}
            keyExtractor={(chat) => chat.id}
            showsVerticalScrollIndicator={false}
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
                  disabled
                  accessibilityRole="button"
                  accessibilityState={{ disabled: true }}
                  style={styles.chatRow}
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

                <Text style={styles.emptyTitle}>No messages yet</Text>
              </View>
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
    color: "#718099",
    fontSize: 15,
  },
  listHeader: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 18,
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
  footer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
  },
});
