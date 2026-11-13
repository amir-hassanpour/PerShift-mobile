import { useRouter } from "expo-router";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import type { ListRenderItemInfo } from "react-native";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import type { Chat } from "@/entity/Chat";
import type { User } from "@/entity/User";

import type { LoadCreateChatPageController } from "@/interface-adapter/messages/create-chat/load-create-chat-page/LoadCreateChatPageController";
import type { LoadCreateChatPageViewModel } from "@/interface-adapter/messages/create-chat/LoadCreateChatPageViewModel";

import { ChatExistsController } from "@/interface-adapter/messages/create-chat/chat-exists/ChatExistsController";
import { ChatExistsViewModel } from "@/interface-adapter/messages/create-chat/chat-exists/ChatExistsViewModel";
import type { CreateChatController } from "@/interface-adapter/messages/create-chat/create-chat/CreateChatController";
import type { CreateChatViewModel } from "@/interface-adapter/messages/create-chat/create-chat/CreateChatViewModel";

export type CreateChatPageProps = {
  controller: LoadCreateChatPageController;
  viewModel: LoadCreateChatPageViewModel;

  chatExistsController: ChatExistsController;
  chatExistsViewModel: ChatExistsViewModel;

  createChatController: CreateChatController;
  createChatViewModel: CreateChatViewModel;
};

type ChatUser = Chat | User;

const COLORS = {
  background: "#FFFFFF",
  navy: "#102A52",
  blue: "#276EF1",
  softBlue: "#EAF2FF",
  searchBackground: "#F4F7FD",
  secondaryText: "#71809A",
  border: "#E8EDF5",
  disabledIcon: "#9AA7BA",
  error: "#B42318",
};

function isChat(item: ChatUser): item is Chat {
  return "business_id" in item;
}

export default function CreateChatView({
  controller,
  viewModel,
  chatExistsController,
  chatExistsViewModel,
  createChatController,
  createChatViewModel,
}: CreateChatPageProps) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [processingUserID, setProcessingUserID] = useState<string | null>(null);

  const [revision, refresh] = useReducer(
    (currentRevision: number) => currentRevision + 1,
    0,
  );

  const requestRef = useRef<{
    controller: LoadCreateChatPageController;
    request: Promise<void>;
  } | null>(null);

  /*
   * Subscribe to all ViewModels used by this screen.
   */
  useEffect(() => {
    const unsubscribeLoad = viewModel.subscribe(refresh);
    const unsubscribeChatExists = chatExistsViewModel.subscribe(refresh);
    const unsubscribeCreateChat = createChatViewModel.subscribe(refresh);

    return () => {
      unsubscribeLoad();
      unsubscribeChatExists();
      unsubscribeCreateChat();
    };
  }, [viewModel, chatExistsViewModel, createChatViewModel]);

  /*
   * Load the initial chat/user suggestions.
   */
  useEffect(() => {
    let active = true;

    setIsLoading(true);
    setLoadError(null);

    let request: Promise<void>;

    if (requestRef.current?.controller === controller) {
      request = requestRef.current.request;
    } else {
      request = controller.loadCreateChatPage({});

      requestRef.current = {
        controller,
        request,
      };
    }

    void request
      .catch(() => {
        if (active) {
          setLoadError("The suggestions could not be loaded.");
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [controller]);

  /*
   * Preserve the exact order supplied by viewModel.chatUsers.
   * Searching filters the list without changing its order.
   */
  const rows = useMemo<ChatUser[]>(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return viewModel.chatUsers;
    }

    return viewModel.chatUsers.filter((item) => {
      if (isChat(item)) {
        return (
          item.name.toLowerCase().includes(query) ||
          item.lastText.toLowerCase().includes(query)
        );
      }

      const fullName = `${item.firstName} ${item.lastName}`.toLowerCase();

      return (
        fullName.includes(query) ||
        item.username.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query)
      );
    });
  }, [search, revision, viewModel]);

  function pushChat(chat: Chat) {
    router.push({
      pathname: "/chat/[chatID]",
      params: {
        chatID: chat.id,
      },
    });
  }

  function handleChatPress(chat: Chat) {
    pushChat(chat);
  }

  async function handleUserPress(user: User) {
    if (processingUserID !== null) {
      return;
    }

    setProcessingUserID(user.id);
    setActionError(null);

    try {
      /*
       * First check whether a direct chat with this user exists.
       */
      await chatExistsController.chatExists({
        user,
      });

      const existingChat = chatExistsViewModel.chat;

      if (existingChat) {
        pushChat(existingChat);
        return;
      }

      /*
       * No existing chat was found, so create one.
       */
      if (!viewModel.businessID) {
        throw new Error("Business ID is missing.");
      }

      await createChatController.createChat({
        isGroupChat: false,
        name: "",
        users: [user],
        businessID: viewModel.businessID,
      });

      const createdChat = createChatViewModel.chat;

      if (!createdChat) {
        throw new Error("The new chat was not returned.");
      }

      pushChat(createdChat);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "The chat could not be opened.",
      );
    } finally {
      setProcessingUserID(null);
    }
  }

  function renderItem({ item }: ListRenderItemInfo<ChatUser>) {
    if (isChat(item)) {
      return <ChatButton chat={item} onPress={() => handleChatPress(item)} />;
    }

    return (
      <UserButton
        user={item}
        isLoading={processingUserID === item.id}
        isDisabled={processingUserID !== null && processingUserID !== item.id}
        onPress={() => handleUserPress(item)}
      />
    );
  }

  function getKey(item: ChatUser): string {
    if (isChat(item)) {
      return `chat-${item.id}`;
    }

    return `user-${item.id}`;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            hitSlop={12}
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.backButtonPressed,
            ]}
          >
            <Chevron direction="left" color={COLORS.navy} />
          </Pressable>

          <Text style={styles.headerTitle}>New message</Text>

          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.searchContainer}>
          <SearchIcon />

          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
            onChangeText={setSearch}
            placeholder="Search chats and people"
            placeholderTextColor={COLORS.secondaryText}
            returnKeyType="search"
            style={styles.searchInput}
            value={search}
          />
        </View>

        <FlatList
          data={rows}
          keyExtractor={getKey}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            rows.length === 0 && styles.emptyListContent,
          ]}
          ListHeaderComponent={
            <>
              <Pressable
                accessibilityLabel="Create group chat"
                accessibilityRole="button"
                onPress={() => router.push("/create-chat/group")}
                style={({ pressed }) => [
                  styles.groupButton,
                  pressed && styles.rowButtonPressed,
                ]}
              >
                <View style={styles.groupIconContainer}>
                  <PeopleIcon />
                </View>

                <View style={styles.groupTextContainer}>
                  <Text style={styles.groupTitle}>Create group chat</Text>

                  <Text style={styles.groupSubtitle}>
                    Select people and choose a name
                  </Text>
                </View>

                <Chevron direction="right" color={COLORS.blue} />
              </Pressable>

              {loadError ? (
                <Text style={styles.errorText}>{loadError}</Text>
              ) : null}

              {actionError ? (
                <Text style={styles.errorText}>{actionError}</Text>
              ) : null}

              <Text style={styles.suggestionsTitle}>Suggestions</Text>
            </>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIcon}>
                <Text style={styles.emptyIconText}>•••</Text>
              </View>

              <Text style={styles.emptyTitle}>
                {isLoading
                  ? "Loading suggestions…"
                  : search.trim()
                    ? "No results found"
                    : "No suggestions yet"}
              </Text>

              {!isLoading ? (
                <Text style={styles.emptySubtitle}>
                  {search.trim()
                    ? "Try searching with another name."
                    : "Chats and people will appear here."}
                </Text>
              ) : null}
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

type ChatButtonProps = {
  chat: Chat;
  onPress: () => void;
};

function ChatButton({ chat, onPress }: ChatButtonProps) {
  const messageText =
    chat.messageCount === 1 ? "1 message" : `${chat.messageCount} messages`;

  return (
    <Pressable
      accessibilityLabel={`Open chat ${chat.name}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.listButton,
        pressed && styles.rowButtonPressed,
      ]}
    >
      <AvatarFallback name={chat.name} />

      <View style={styles.rowTextContainer}>
        <Text numberOfLines={1} style={styles.rowTitle}>
          {chat.name || "Unnamed chat"}
        </Text>

        <Text numberOfLines={1} style={styles.rowSubtitle}>
          {chat.lastText || messageText}
        </Text>

        <Text numberOfLines={1} style={styles.rowDate}>
          {chat.lastTextedAt
            ? `Last active ${formatDate(chat.lastTextedAt)}`
            : "No messages yet"}
        </Text>
      </View>

      <Chevron direction="right" color={COLORS.blue} />
    </Pressable>
  );
}

type UserButtonProps = {
  user: User;
  isLoading: boolean;
  isDisabled: boolean;
  onPress: () => void;
};

function UserButton({ user, isLoading, isDisabled, onPress }: UserButtonProps) {
  const fullName = `${user.firstName} ${user.lastName}`;
  const disabled = isLoading || isDisabled;

  return (
    <Pressable
      accessibilityLabel={`Start a chat with ${fullName}`}
      accessibilityRole="button"
      accessibilityState={{
        disabled,
        busy: isLoading,
      }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.listButton,
        pressed && styles.rowButtonPressed,
        isDisabled && styles.disabledRow,
      ]}
    >
      {user.avatarUrl ? (
        <Image
          accessibilityLabel={`${fullName}'s profile image`}
          source={{ uri: user.avatarUrl }}
          style={styles.avatar}
        />
      ) : (
        <AvatarFallback name={fullName} />
      )}

      <View style={styles.rowTextContainer}>
        <Text numberOfLines={1} style={styles.rowTitle}>
          {fullName}
        </Text>

        <Text numberOfLines={1} style={styles.rowSubtitle}>
          @{user.username}
        </Text>
      </View>

      {isLoading ? (
        <ActivityIndicator color={COLORS.blue} size="small" />
      ) : (
        <Chevron direction="right" color={COLORS.blue} />
      )}
    </Pressable>
  );
}

function AvatarFallback({ name }: { name: string }) {
  return (
    <View style={styles.avatarFallback}>
      <Text style={styles.avatarInitials}>{getInitials(name)}</Text>
    </View>
  );
}

function Chevron({
  direction,
  color,
}: {
  direction: "left" | "right";
  color: string;
}) {
  return (
    <View
      style={[
        styles.chevron,
        {
          borderColor: color,
          transform: [
            {
              rotate: direction === "right" ? "-45deg" : "135deg",
            },
          ],
        },
      ]}
    />
  );
}

function SearchIcon() {
  return (
    <View style={styles.searchIcon}>
      <View style={styles.searchCircle} />
      <View style={styles.searchHandle} />
    </View>
  );
}

function PeopleIcon() {
  return (
    <View style={styles.peopleIcon}>
      <View style={styles.personLeftHead} />
      <View style={styles.personMainHead} />
      <View style={styles.personRightHead} />

      <View style={styles.personLeftBody} />
      <View style={styles.personMainBody} />
      <View style={styles.personRightBody} />
    </View>
  );
}

function getInitials(name: string): string {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return initials || "?";
}

function getTimestamp(value: Date | undefined): number {
  if (!value) {
    return 0;
  }

  const date =
    value instanceof Date ? value : new Date(value as unknown as string);

  const timestamp = date.getTime();

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function formatDate(value: Date): string {
  const timestamp = getTimestamp(value);

  if (!timestamp) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(timestamp));
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    minHeight: 72,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitle: {
    color: COLORS.navy,
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.4,
  },

  headerSpacer: {
    width: 46,
  },

  backButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
    shadowColor: COLORS.navy,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },

  backButtonPressed: {
    backgroundColor: COLORS.softBlue,
    transform: [{ scale: 0.97 }],
  },

  searchContainer: {
    height: 58,
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 18,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.searchBackground,
  },

  searchInput: {
    flex: 1,
    height: "100%",
    marginLeft: 13,
    color: COLORS.navy,
    fontSize: 17,
  },

  searchIcon: {
    width: 24,
    height: 24,
  },

  searchCircle: {
    position: "absolute",
    top: 2,
    left: 2,
    width: 15,
    height: 15,
    borderWidth: 2,
    borderColor: COLORS.secondaryText,
    borderRadius: 8,
  },

  searchHandle: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 8,
    height: 2,
    borderRadius: 1,
    backgroundColor: COLORS.secondaryText,
    transform: [{ rotate: "45deg" }],
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 36,
  },

  emptyListContent: {
    flexGrow: 1,
  },

  groupButton: {
    minHeight: 78,
    marginTop: 4,
    marginBottom: 12,
    paddingHorizontal: 16,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  groupIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.softBlue,
  },

  groupTextContainer: {
    flex: 1,
    marginHorizontal: 14,
  },

  groupTitle: {
    color: COLORS.navy,
    fontSize: 17,
    fontWeight: "700",
  },

  groupSubtitle: {
    marginTop: 3,
    color: COLORS.secondaryText,
    fontSize: 14,
  },

  suggestionsTitle: {
    marginTop: 18,
    marginBottom: 8,
    color: COLORS.navy,
    fontSize: 20,
    fontWeight: "800",
  },

  peopleIcon: {
    width: 30,
    height: 28,
  },

  personMainHead: {
    position: "absolute",
    top: 1,
    left: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.blue,
  },

  personLeftHead: {
    position: "absolute",
    top: 6,
    left: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.blue,
  },

  personRightHead: {
    position: "absolute",
    top: 6,
    right: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.blue,
  },

  personMainBody: {
    position: "absolute",
    bottom: 1,
    left: 8,
    width: 14,
    height: 13,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: COLORS.blue,
  },

  personLeftBody: {
    position: "absolute",
    bottom: 1,
    left: 0,
    width: 9,
    height: 10,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: COLORS.blue,
  },

  personRightBody: {
    position: "absolute",
    right: 0,
    bottom: 1,
    width: 9,
    height: 10,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: COLORS.blue,
  },

  listButton: {
    minHeight: 88,
    paddingVertical: 13,
    paddingHorizontal: 4,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },

  rowButtonPressed: {
    backgroundColor: COLORS.softBlue,
    borderRadius: 16,
    opacity: 0.85,
  },

  disabledRow: {
    opacity: 0.5,
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.softBlue,
  },

  avatarFallback: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.softBlue,
  },

  avatarInitials: {
    color: COLORS.blue,
    fontSize: 19,
    fontWeight: "800",
  },

  rowTextContainer: {
    flex: 1,
    marginLeft: 14,
    marginRight: 12,
  },

  rowTitle: {
    color: COLORS.navy,
    fontSize: 17,
    fontWeight: "700",
  },

  rowSubtitle: {
    marginTop: 3,
    color: COLORS.secondaryText,
    fontSize: 15,
  },

  rowDate: {
    marginTop: 4,
    color: COLORS.secondaryText,
    fontSize: 12,
  },

  chevron: {
    width: 10,
    height: 10,
    borderRightWidth: 2,
    borderBottomWidth: 2,
  },

  emptyContainer: {
    flex: 1,
    minHeight: 260,
    paddingHorizontal: 34,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.softBlue,
  },

  emptyIconText: {
    marginTop: -8,
    color: COLORS.blue,
    fontSize: 28,
    fontWeight: "800",
  },

  emptyTitle: {
    marginTop: 16,
    color: COLORS.navy,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },

  emptySubtitle: {
    marginTop: 7,
    color: COLORS.secondaryText,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },

  errorText: {
    marginBottom: 8,
    color: COLORS.error,
    fontSize: 14,
    textAlign: "center",
  },
});
