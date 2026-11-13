import { Chat } from "@/entity/Chat";
import { Message } from "@/entity/Message";
import { LoadingChatPageController } from "@/interface-adapter/messages/chat-page/load-chat-page/LoadingChatPageController";
import { LoadingChatPageViewModel } from "@/interface-adapter/messages/chat-page/LoadingChatPageViewModel";
import { SendMessageController } from "@/interface-adapter/messages/chat-page/send-message/SendMessageConttroller";
import { StatusBar } from "expo-status-bar";
import { SymbolView } from "expo-symbols";
import { Component } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type ChatProps = {
  chat: Chat;
  user_id: string;
  controller: LoadingChatPageController;
  viewModel: LoadingChatPageViewModel;
  sendMessageController: SendMessageController;
};

const previewViewModel = {
  chatName: "",
  currentUserId: "",
  messages: [] as Message[],
};

export class ChatPage extends Component<ChatProps> {
  private unsubscribe?: () => void;

  state = {
    draft: "",
  };

  private listRef = {
    current: null as FlatList<
      (typeof previewViewModel.messages)[number]
    > | null,
  };

  constructor(props: ChatProps) {
    super(props);
  }

  componentDidMount(): void {
    this.unsubscribe = this.props.viewModel.subscribe(() => {
      this.forceUpdate();
    });

    this.props.controller.loadingChatPage({ chat_id: this.props.chat.id });
  }

  componentWillUnmount() {
    this.unsubscribe?.();
  }

  render() {
    const { chat, user_id, viewModel, sendMessageController } = this.props;
    const { chatName, messages } = {
      chatName: chat.name,
      messages: viewModel.messages,
    };
    previewViewModel.messages = messages;

    return (
      <SafeAreaView style={styles.screen}>
        <StatusBar style="dark" />

        <KeyboardAvoidingView
          style={styles.page}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.header}>
            <Pressable
              disabled
              accessibilityRole="button"
              accessibilityLabel="Back to messages"
              accessibilityState={{ disabled: true }}
              style={styles.headerButton}
            >
              <SymbolView
                name={{
                  ios: "chevron.left",
                  android: "arrow_back",
                  web: "arrow_back",
                }}
                tintColor="#2563EB"
                size={22}
                style={styles.icon}
              />
            </Pressable>

            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {Array.from(chatName.trim() || "?")[0].toLocaleUpperCase()}
              </Text>
            </View>

            <View style={styles.headerInfo}>
              <Text
                accessibilityRole="header"
                style={styles.chatName}
                numberOfLines={1}
              >
                {chatName}
              </Text>
              <Text style={styles.headerSubtitle}>Messages</Text>
            </View>
          </View>

          <FlatList
            ref={(list) => {
              this.listRef.current = list;
            }}
            style={styles.list}
            contentContainerStyle={[
              styles.listContent,
              messages.length === 0 && styles.emptyList,
            ]}
            data={messages}
            keyExtractor={(message) => message.id}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            onLayout={() => {
              this.listRef.current?.scrollToEnd({ animated: false });
            }}
            renderItem={({ item, index }) => {
              const isMine = item.sender_id === user_id;
              const previous = messages[index - 1];
              const showDate =
                !previous ||
                previous.time.toDateString() !== item.time.toDateString();

              const time = item.time.toLocaleTimeString(undefined, {
                hour: "numeric",
                minute: "2-digit",
              });

              return (
                <View>
                  {showDate && (
                    <View style={styles.dateRow}>
                      <Text style={styles.dateText}>
                        {item.time.toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </Text>
                    </View>
                  )}

                  <View
                    style={[
                      styles.messageRow,
                      isMine ? styles.outgoingRow : styles.incomingRow,
                    ]}
                  >
                    <View
                      style={[
                        styles.bubble,
                        isMine ? styles.outgoingBubble : styles.incomingBubble,
                      ]}
                    >
                      <Text
                        selectable
                        style={[
                          styles.messageText,
                          isMine && styles.outgoingText,
                        ]}
                      >
                        {item.content}
                      </Text>

                      <Text
                        style={[
                          styles.timestamp,
                          isMine && styles.outgoingTimestamp,
                        ]}
                      >
                        {time}
                      </Text>
                    </View>
                  </View>
                </View>
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
                    size={30}
                    style={{ width: 30, height: 30 }}
                  />
                </View>

                <Text style={styles.emptyTitle}>No messages yet</Text>
              </View>
            }
          />

          <View style={styles.composerContainer}>
            <View style={styles.composer}>
              <Pressable
                disabled
                accessibilityRole="button"
                accessibilityLabel="Add attachment"
                accessibilityState={{ disabled: true }}
                style={styles.attachmentButton}
              >
                <SymbolView
                  name={{
                    ios: "plus",
                    android: "add",
                    web: "add",
                  }}
                  tintColor="#718099"
                  size={22}
                  style={styles.icon}
                />
              </Pressable>

              <TextInput
                multiline
                value={this.state.draft}
                onChangeText={(draft) => this.setState({ draft })}
                placeholder="Message..."
                placeholderTextColor="#718099"
                accessibilityLabel="Message"
                style={styles.input}
                textAlignVertical="top"
              />

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Send message"
                accessibilityState={{ disabled: true }}
                style={styles.sendButton}
                onPress={() => {
                  if (this.state.draft.trim().length > 0) {
                    sendMessageController.sendMessage({
                      content: this.state.draft,
                      chat_id: chat.id,
                      sender_id: user_id,
                    });
                    this.state.draft = "";
                  }
                }}
              >
                <SymbolView
                  name={{
                    ios: "arrow.up",
                    android: "arrow_upward",
                    web: "arrow_upward",
                  }}
                  tintColor="#FFFFFF"
                  size={21}
                  style={styles.icon}
                />
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fffefe",
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
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E7ECF3",
  },
  headerButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },
  icon: {
    width: 22,
    height: 22,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#EAF1FF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#2563EB",
    fontSize: 19,
    fontWeight: "700",
  },
  headerInfo: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  chatName: {
    color: "#152A4A",
    fontSize: 17,
    fontWeight: "700",
  },
  headerSubtitle: {
    color: "#718099",
    fontSize: 12,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  emptyList: {
    flexGrow: 1,
  },
  dateRow: {
    alignItems: "center",
    marginTop: 12,
    marginBottom: 22,
  },
  dateText: {
    color: "#718099",
    fontSize: 11,
    fontWeight: "500",
    backgroundColor: "#F5F8FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  outgoingRow: {
    justifyContent: "flex-end",
  },
  incomingRow: {
    justifyContent: "flex-start",
  },
  bubble: {
    maxWidth: "84%",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 9,
    borderRadius: 20,
  },
  outgoingBubble: {
    backgroundColor: "#2563EB",
    borderBottomRightRadius: 6,
  },
  incomingBubble: {
    backgroundColor: "#F0F4FB",
    borderBottomLeftRadius: 6,
  },
  messageText: {
    color: "#152A4A",
    fontSize: 15,
    lineHeight: 22,
  },
  outgoingText: {
    color: "#FFFFFF",
  },
  timestamp: {
    color: "#718099",
    fontSize: 10,
    marginTop: 6,
    textAlign: "right",
  },
  outgoingTimestamp: {
    color: "#DBEAFE",
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
  },
  emptyDescription: {
    color: "#718099",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
  composerContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E7ECF3",
  },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    padding: 6,
    borderWidth: 1,
    borderColor: "#E2EAF7",
    borderRadius: 26,
    backgroundColor: "#F5F8FF",
  },
  attachmentButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    minWidth: 0,
    minHeight: 44,
    maxHeight: 120,
    paddingVertical: 11,
    paddingHorizontal: 2,
    color: "#152A4A",
    fontSize: 15,
    lineHeight: 22,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
});
