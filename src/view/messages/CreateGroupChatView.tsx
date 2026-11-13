import { router } from "expo-router";
import React from "react";
import type { ListRenderItemInfo } from "react-native";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import type { User } from "@/entity/User";

import type { CreateChatController } from "@/interface-adapter/messages/create-chat/create-chat/CreateChatController";
import type { CreateChatViewModel } from "@/interface-adapter/messages/create-chat/create-chat/CreateChatViewModel";
import { LoadCreateGroupchatPageController } from "@/interface-adapter/messages/create-chat/load-create-group-chat-page/LoadCreateGroupchatPageController";
import { LoadCreateGroupchatPageState } from "@/interface-adapter/messages/create-chat/load-create-group-chat-page/LoadCreateGroupchatPageState";
import { LoadCreateGroupchatPageViewModel } from "@/interface-adapter/messages/create-chat/load-create-group-chat-page/LoadCreateGroupchatPageViewModel";
import { SafeAreaView } from "react-native-safe-area-context";

export type CreateGroupChatPageProps = {
  loadController: LoadCreateGroupchatPageController;
  loadViewModel: LoadCreateGroupchatPageViewModel;

  createController: CreateChatController;
  createViewModel: CreateChatViewModel;
};

type CreateGroupChatPageLocalState = {
  groupName: string;
  search: string;
  selectedUserIDs: Set<string>;
  isCreating: boolean;
  createError: string | null;
  loadError: string | null;
};

const COLORS = {
  background: "#FFFFFF",
  navy: "#102A52",
  blue: "#276EF1",
  softBlue: "#EAF2FF",
  searchBackground: "#F4F7FD",
  secondaryText: "#71809A",
  border: "#E8EDF5",
  disabled: "#A8B2C2",
  error: "#B42318",
};

export default class CreateGroupChatView extends React.Component<
  CreateGroupChatPageProps,
  CreateGroupChatPageLocalState
> {
  private unsubscribeLoadViewModel?: () => void;
  private unsubscribeCreateViewModel?: () => void;
  private mounted = false;

  constructor(props: CreateGroupChatPageProps) {
    super(props);

    this.state = {
      groupName: "",
      search: "",
      selectedUserIDs: new Set<string>(),
      isCreating: false,
      createError: null,
      loadError: null,
    };
  }

  componentDidMount(): void {
    this.mounted = true;

    this.unsubscribeLoadViewModel = this.props.loadViewModel.subscribe(() => {
      if (this.mounted) {
        this.forceUpdate();
      }
    });

    this.unsubscribeCreateViewModel = this.props.createViewModel.subscribe(
      () => {
        if (this.mounted) {
          this.forceUpdate();
        }
      },
    );

    void this.loadPage();
  }

  componentWillUnmount(): void {
    this.mounted = false;

    this.unsubscribeLoadViewModel?.();
    this.unsubscribeCreateViewModel?.();
  }

  private loadPage = async (): Promise<void> => {
    this.setState({
      loadError: null,
    });

    try {
      await this.props.loadController.loadCreateGroupchatPage({});
    } catch {
      if (this.mounted) {
        this.setState({
          loadError: "The group-chat page could not be loaded.",
        });
      }
    }
  };

  private getFilteredUsers(): User[] {
    const query = this.state.search.trim().toLowerCase();
    const users = this.props.loadViewModel.users;

    if (!query) {
      return users;
    }

    return users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();

      return (
        fullName.includes(query) ||
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
    });
  }

  private getSelectedUsers(): User[] {
    return this.props.loadViewModel.users.filter((user) =>
      this.state.selectedUserIDs.has(user.id),
    );
  }

  private toggleUser = (userID: string): void => {
    if (this.state.isCreating) {
      return;
    }

    this.setState((currentState) => {
      const selectedUserIDs = new Set(currentState.selectedUserIDs);

      if (selectedUserIDs.has(userID)) {
        selectedUserIDs.delete(userID);
      } else {
        selectedUserIDs.add(userID);
      }

      return {
        selectedUserIDs,
      };
    });
  };

  private canSubmit(): boolean {
    /*
     * There is intentionally no selectedUserIDs.size >= 2 check here.
     * The use case owns that validation.
     */
    return (
      this.state.groupName.trim().length > 0 &&
      this.props.loadViewModel.businessID.trim().length > 0 &&
      !this.state.isCreating
    );
  }

  private createGroupChat = async (): Promise<void> => {
    if (!this.canSubmit()) {
      return;
    }

    this.setState({
      isCreating: true,
      createError: null,
    });

    try {
      await this.props.createController.createChat({
        isGroupChat: true,
        name: this.state.groupName.trim(),
        users: this.getSelectedUsers(),
        businessID: this.props.loadViewModel.businessID,
      });

      const createdChat = this.props.createViewModel.chat;

      if (!createdChat) {
        throw new Error(
          "The group chat was not created. Select at least two members.",
        );
      }

      router.push({
        pathname: "/chat/[chatID]",
        params: {
          chatID: createdChat.id,
        },
      });
    } catch (error) {
      if (this.mounted) {
        this.setState({
          createError:
            error instanceof Error
              ? error.message
              : "The group chat could not be created.",
        });
      }
    } finally {
      if (this.mounted) {
        this.setState({
          isCreating: false,
        });
      }
    }
  };

  private renderUser = ({
    item,
  }: ListRenderItemInfo<User>): React.ReactElement => {
    const isSelected = this.state.selectedUserIDs.has(item.id);

    return (
      <UserSelectionButton
        user={item}
        isSelected={isSelected}
        isDisabled={this.state.isCreating}
        onPress={() => this.toggleUser(item.id)}
      />
    );
  };

  private renderLoadingPage(): React.ReactNode {
    return (
      <PageMessage
        title="Loading people…"
        message="Getting the available group members."
        loading
      />
    );
  }

  private renderMinimumMembersFailure(): React.ReactNode {
    return (
      <PageMessage
        title="Not enough members"
        message="At least two members are required to create a group chat."
      />
    );
  }

  private renderFailurePage(): React.ReactNode {
    return (
      <PageMessage
        title="Unable to load people"
        message={
          this.state.loadError ?? "The group-chat page could not be loaded."
        }
        actionLabel="Try again"
        onAction={this.loadPage}
      />
    );
  }

  render(): React.ReactNode {
    const loadState = this.props.loadViewModel.state;

    if (
      loadState ===
      LoadCreateGroupchatPageState.LOAD_CCREATE_GROUPCHAT_PAGE_IDLE
    ) {
      return this.renderLoadingPage();
    }

    if (
      loadState ===
      LoadCreateGroupchatPageState.LOAD_CCREATE_GROUPCHAT_PAGE_MINIMUM_MEMBERS_FAILED
    ) {
      return this.renderMinimumMembersFailure();
    }

    if (
      loadState ===
        LoadCreateGroupchatPageState.LOAD_CREATE_GROUPCHAT_PAGE_FAILURE ||
      this.state.loadError
    ) {
      return this.renderFailurePage();
    }

    const filteredUsers = this.getFilteredUsers();
    const canSubmit = this.canSubmit();

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
              <Text style={styles.backButtonText}>‹</Text>
            </Pressable>

            <Text style={styles.headerTitle}>New group</Text>

            <Pressable
              accessibilityLabel="Create group chat"
              accessibilityRole="button"
              accessibilityState={{
                disabled: !canSubmit,
                busy: this.state.isCreating,
              }}
              disabled={!canSubmit}
              onPress={this.createGroupChat}
              style={[
                styles.createButton,
                !canSubmit && styles.createButtonDisabled,
              ]}
            >
              {this.state.isCreating ? (
                <ActivityIndicator color={COLORS.background} size="small" />
              ) : (
                <Text style={styles.createButtonText}>Create</Text>
              )}
            </Pressable>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Group name</Text>

            <TextInput
              autoCapitalize="sentences"
              autoCorrect
              editable={!this.state.isCreating}
              maxLength={80}
              onChangeText={(groupName) => this.setState({ groupName })}
              placeholder="Enter a group name"
              placeholderTextColor={COLORS.secondaryText}
              returnKeyType="done"
              style={styles.input}
              value={this.state.groupName}
            />

            <View style={styles.peopleHeader}>
              <Text style={styles.peopleTitle}>Add people</Text>

              <Text style={styles.selectedCount}>
                {this.state.selectedUserIDs.size} selected
              </Text>
            </View>

            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
              editable={!this.state.isCreating}
              onChangeText={(search) => this.setState({ search })}
              placeholder="Search people"
              placeholderTextColor={COLORS.secondaryText}
              returnKeyType="search"
              style={styles.input}
              value={this.state.search}
            />

            {this.state.createError ? (
              <Text style={styles.errorText}>{this.state.createError}</Text>
            ) : null}
          </View>

          <FlatList
            data={filteredUsers}
            keyExtractor={(user) => user.id}
            keyboardShouldPersistTaps="handled"
            renderItem={this.renderUser}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </SafeAreaView>
    );
  }
}

type UserSelectionButtonProps = {
  user: User;
  isSelected: boolean;
  isDisabled: boolean;
  onPress: () => void;
};

class UserSelectionButton extends React.PureComponent<UserSelectionButtonProps> {
  render(): React.ReactNode {
    const { user, isSelected, isDisabled, onPress } = this.props;

    const fullName = `${user.firstName} ${user.lastName}`;

    return (
      <Pressable
        accessibilityLabel={`${isSelected ? "Remove" : "Add"} ${fullName}`}
        accessibilityRole="checkbox"
        accessibilityState={{
          checked: isSelected,
          disabled: isDisabled,
        }}
        disabled={isDisabled}
        onPress={onPress}
        style={({ pressed }) => [
          styles.userButton,
          pressed && styles.userButtonPressed,
          isDisabled && styles.disabledUser,
        ]}
      >
        {user.avatarUrl ? (
          <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarInitials}>{getInitials(fullName)}</Text>
          </View>
        )}

        <View style={styles.userText}>
          <Text numberOfLines={1} style={styles.userName}>
            {fullName}
          </Text>

          <Text numberOfLines={1} style={styles.username}>
            @{user.username}
          </Text>
        </View>

        <View
          style={[
            styles.selectionCircle,
            isSelected && styles.selectionCircleSelected,
          ]}
        >
          {isSelected ? <Text style={styles.checkmark}>✓</Text> : null}
        </View>
      </Pressable>
    );
  }
}

type PageMessageProps = {
  title: string;
  message: string;
  loading?: boolean;
  actionLabel?: string;
  onAction?: () => void;
};

class PageMessage extends React.PureComponent<PageMessageProps> {
  render(): React.ReactNode {
    const { title, message, loading, actionLabel, onAction } = this.props;

    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.messageHeader}>
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>‹</Text>
          </Pressable>
        </View>

        <View style={styles.messageContainer}>
          {loading ? (
            <ActivityIndicator color={COLORS.blue} size="large" />
          ) : null}

          <Text style={styles.messageTitle}>{title}</Text>

          <Text style={styles.messageText}>{message}</Text>

          {actionLabel && onAction ? (
            <Pressable
              accessibilityRole="button"
              onPress={onAction}
              style={styles.retryButton}
            >
              <Text style={styles.retryButtonText}>{actionLabel}</Text>
            </Pressable>
          ) : null}
        </View>
      </SafeAreaView>
    );
  }
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
  },

  headerTitle: {
    flex: 1,
    marginHorizontal: 12,
    color: COLORS.navy,
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
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
  },

  backButtonText: {
    marginTop: -3,
    color: COLORS.navy,
    fontSize: 40,
    fontWeight: "300",
    lineHeight: 40,
  },

  createButton: {
    minWidth: 72,
    height: 42,
    paddingHorizontal: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.blue,
  },

  createButtonDisabled: {
    backgroundColor: COLORS.disabled,
    opacity: 0.65,
  },

  createButtonText: {
    color: COLORS.background,
    fontSize: 15,
    fontWeight: "700",
  },

  formContainer: {
    paddingHorizontal: 20,
  },

  label: {
    marginTop: 8,
    marginBottom: 8,
    color: COLORS.navy,
    fontSize: 15,
    fontWeight: "700",
  },

  input: {
    height: 54,
    paddingHorizontal: 17,
    borderRadius: 18,
    color: COLORS.navy,
    backgroundColor: COLORS.searchBackground,
    fontSize: 16,
  },

  peopleHeader: {
    marginTop: 24,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  peopleTitle: {
    color: COLORS.navy,
    fontSize: 20,
    fontWeight: "800",
  },

  selectedCount: {
    color: COLORS.blue,
    fontSize: 14,
    fontWeight: "700",
  },

  errorText: {
    marginTop: 12,
    color: COLORS.error,
    fontSize: 14,
    textAlign: "center",
  },

  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 36,
  },

  userButton: {
    minHeight: 82,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },

  userButtonPressed: {
    paddingHorizontal: 8,
    borderRadius: 16,
    backgroundColor: COLORS.softBlue,
  },

  disabledUser: {
    opacity: 0.55,
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.softBlue,
  },

  avatarFallback: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.softBlue,
  },

  avatarInitials: {
    color: COLORS.blue,
    fontSize: 18,
    fontWeight: "800",
  },

  userText: {
    flex: 1,
    marginHorizontal: 14,
  },

  userName: {
    color: COLORS.navy,
    fontSize: 17,
    fontWeight: "700",
  },

  username: {
    marginTop: 4,
    color: COLORS.secondaryText,
    fontSize: 14,
  },

  selectionCircle: {
    width: 27,
    height: 27,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.disabled,
    alignItems: "center",
    justifyContent: "center",
  },

  selectionCircleSelected: {
    borderColor: COLORS.blue,
    backgroundColor: COLORS.blue,
  },

  checkmark: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "800",
  },

  messageHeader: {
    minHeight: 72,
    paddingHorizontal: 20,
    justifyContent: "center",
  },

  messageContainer: {
    flex: 1,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  messageTitle: {
    marginTop: 18,
    color: COLORS.navy,
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },

  messageText: {
    marginTop: 10,
    color: COLORS.secondaryText,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },

  retryButton: {
    marginTop: 22,
    minWidth: 120,
    height: 46,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.blue,
  },

  retryButtonText: {
    color: COLORS.background,
    fontSize: 15,
    fontWeight: "700",
  },
});
