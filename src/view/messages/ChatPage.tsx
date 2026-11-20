import { Chat } from "@/entity/Chat";
import { Message } from "@/entity/Message";

import { LoadingChatPageController } from "@/interface-adapter/messages/chat-page/load-chat-page/LoadingChatPageController";
import { LoadingChatPageViewModel } from "@/interface-adapter/messages/chat-page/LoadingChatPageViewModel";
import { ScrollMessagesController } from "@/interface-adapter/messages/chat-page/scroll-messages/ScrollMessagesController";
import { ScrollMessagesState } from "@/interface-adapter/messages/chat-page/scroll-messages/ScrollMessagesState";
import { SendMessageController } from "@/interface-adapter/messages/chat-page/send-message/SendMessageConttroller";

import { StatusBar } from "expo-status-bar";
import { SymbolView } from "expo-symbols";
import React, { Component } from "react";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import {
  ActivityIndicator,
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
  scrollMessagesController: ScrollMessagesController;
};

type ChatPageState = {
  draft: string;
  isLoadingOlderMessages: boolean;
  scrollError: string | null;
};

export class ChatPage extends Component<ChatProps, ChatPageState> {
  private unsubscribe?: () => void;

  private listRef = {
    current: null as FlatList<Message> | null,
  };

  /*
   * Page zero is already loaded from the local message cache.
   */
  private nextMessagesPage = 1;

  /*
   * Prevents several scroll events from requesting the same page
   * simultaneously.
   */
  private topRequestTriggered = false;

  /*
   * Pagination stays disabled until the initial scroll to the newest
   * message has finished.
   */
  private canLoadFromTop = false;

  private didInitialScroll = false;
  private initialScrollScheduled = false;
  private mounted = false;
  private animationFrame?: number;

  constructor(props: ChatProps) {
    super(props);

    this.state = {
      draft: "",
      isLoadingOlderMessages: false,
      scrollError: null,
    };
  }

  componentDidMount(): void {
    this.mounted = true;

    this.unsubscribe = this.props.viewModel.subscribe(() => {
      if (this.mounted) {
        this.forceUpdate();
      }
    });

    void this.props.controller.loadingChatPage({
      chat_id: this.props.chat.id,
    });
  }

  componentWillUnmount(): void {
    this.mounted = false;
    this.unsubscribe?.();

    if (this.animationFrame !== undefined) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  private loadOlderMessages = async (): Promise<void> => {
    if (!this.canLoadFromTop || this.state.isLoadingOlderMessages) {
      return;
    }

    this.setState({
      isLoadingOlderMessages: true,
      scrollError: null,
    });

    try {
      await this.props.scrollMessagesController.scrollMessages({
        numMessages: this.nextMessagesPage,
        chatID: this.props.chat.id,
      });

      if (
        this.props.viewModel.state ===
        ScrollMessagesState.FAILED_SCROLL_MESSAGES
      ) {
        if (this.mounted) {
          this.setState({
            scrollError: "Older messages could not be loaded.",
          });
        }

        return;
      }

      if (
        this.props.viewModel.state ===
        ScrollMessagesState.SUCCESS_SCROLL_MESSAGES
      ) {
        this.nextMessagesPage += 1;
      }
    } catch {
      if (this.mounted) {
        this.setState({
          scrollError: "Older messages could not be loaded.",
        });
      }
    } finally {
      if (this.mounted) {
        this.setState({
          isLoadingOlderMessages: false,
        });
      }
    }
  };

  private handleScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ): void => {
    const offsetY = event.nativeEvent.contentOffset.y;

    /*
     * Once the user moves away from the top, allow another
     * request the next time they return.
     */
    if (offsetY > 80) {
      this.topRequestTriggered = false;
      return;
    }

    if (offsetY <= 20 && !this.topRequestTriggered && this.canLoadFromTop) {
      this.topRequestTriggered = true;
      void this.loadOlderMessages();
    }
  };

  private handleContentSizeChange = (): void => {
    if (
      this.didInitialScroll ||
      this.initialScrollScheduled ||
      this.props.viewModel.messages.length === 0
    ) {
      return;
    }

    this.initialScrollScheduled = true;

    /*
     * Wait for FlatList to measure the loaded messages.
     */
    this.animationFrame = requestAnimationFrame(() => {
      this.listRef.current?.scrollToEnd({
        animated: false,
      });

      /*
       * Run again on the following frame so the final content
       * height has definitely been applied.
       */
      this.animationFrame = requestAnimationFrame(() => {
        this.listRef.current?.scrollToEnd({
          animated: false,
        });

        this.didInitialScroll = true;
        this.initialScrollScheduled = false;
        this.canLoadFromTop = true;
      });
    });
  };

  private sendMessage = (): void => {
    const content = this.state.draft.trim();

    if (!content) {
      return;
    }

    this.setState({
      draft: "",
    });

    void this.props.sendMessageController.sendMessage({
      content,
      chat_id: this.props.chat.id,
      sender_id: this.props.user_id,
    });
  };

  private renderMessage = ({
    item,
    index,
  }: {
    item: Message;
    index: number;
  }): React.ReactElement => {
    const messages = this.props.viewModel.messages;

    const isMine = item.sender_id === this.props.user_id;

    const previousMessage = messages[index - 1];

    const showDate =
      !previousMessage ||
      previousMessage.time.toDateString() !== item.time.toDateString();

    const time = item.time.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });

    return (
      <View>
        {showDate ? (
          <View style={styles.dateRow}>
            <Text style={styles.dateText}>
              {item.time.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
          </View>
        ) : null}

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
              style={[styles.messageText, isMine && styles.outgoingText]}
            >
              {item.content}
            </Text>

            <Text
              style={[styles.timestamp, isMine && styles.outgoingTimestamp]}
            >
              {time}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  private renderListHeader = (): React.ReactElement | null => {
    if (this.state.isLoadingOlderMessages) {
      return (
        <View style={styles.paginationStatus}>
          <ActivityIndicator color="#2563EB" size="small" />

          <Text style={styles.paginationText}>Loading older messages…</Text>
        </View>
      );
    }

    if (this.state.scrollError) {
      return (
        <Pressable
          accessibilityLabel="Retry loading older messages"
          accessibilityRole="button"
          onPress={() => {
            this.topRequestTriggered = false;
            void this.loadOlderMessages();
          }}
          style={styles.paginationStatus}
        >
          <Text style={styles.paginationError}>{this.state.scrollError}</Text>

          <Text style={styles.retryText}>Tap to retry</Text>
        </Pressable>
      );
    }

    return null;
  };

  render(): React.ReactNode {
    const { chat, user_id, viewModel } = this.props;

    const messages = viewModel.messages;
    const chatName = chat.name;

    const canSend = this.state.draft.trim().length > 0;

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
              accessibilityState={{
                disabled: true,
              }}
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
                numberOfLines={1}
                style={styles.chatName}
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
            renderItem={this.renderMessage}
            ListHeaderComponent={this.renderListHeader}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            onScroll={this.handleScroll}
            scrollEventThrottle={16}
            onContentSizeChange={this.handleContentSizeChange}
            maintainVisibleContentPosition={{
              minIndexForVisible: 0,
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
                    style={{
                      width: 30,
                      height: 30,
                    }}
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
                accessibilityState={{
                  disabled: true,
                }}
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
                accessibilityState={{
                  disabled: !canSend,
                }}
                disabled={!canSend}
                onPress={this.sendMessage}
                style={[
                  styles.sendButton,
                  !canSend && styles.sendButtonDisabled,
                ]}
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
    backgroundColor: "#FFFEFE",
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

  paginationStatus: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 10,
  },

  paginationText: {
    color: "#718099",
    fontSize: 12,
  },

  paginationError: {
    color: "#B42318",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },

  retryText: {
    color: "#2563EB",
    fontSize: 12,
    fontWeight: "700",
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

  sendButtonDisabled: {
    opacity: 0.45,
  },
});
