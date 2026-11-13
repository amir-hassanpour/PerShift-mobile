import { LoadMembersPageController } from "@/interface-adapter/members/load-members-page/LoadMembersPageController";
import { LoadMembersPageViewModel } from "@/interface-adapter/members/LoadMembersPageViewModel";
import React from "react";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Member = LoadMembersPageViewModel["members"][number];

type Props = {
  controller: LoadMembersPageController;
  viewModel: LoadMembersPageViewModel;
  // onMessagePress: (member: Member) => void;
};

type State = {
  search: string;
  error: string | null;
  expandedMemberId: Member["id"] | null;
};

function MemberAvatar({
  member,
  initials,
  expanded,
}: {
  member: Member;
  initials: string;
  expanded: boolean;
}) {
  const avatarUrl = member.avatarUrl?.trim();
  const [failedUrl, setFailedUrl] = React.useState<string | null>(null);

  return (
    <View style={[styles.avatar, expanded && styles.largeAvatar]}>
      {avatarUrl && failedUrl !== avatarUrl ? (
        <Image
          key={avatarUrl}
          source={{ uri: avatarUrl }}
          style={styles.avatarImage}
          resizeMode="cover"
          accessibilityLabel={`${member.firstName} ${member.lastName}'s profile picture`}
          onError={() => setFailedUrl(avatarUrl)}
        />
      ) : (
        <Text style={styles.initials}>{initials}</Text>
      )}
    </View>
  );
}

export class MembersView extends React.Component<Props, State> {
  state: State = {
    search: "",
    error: null,
    expandedMemberId: null,
  };

  private mounted = false;
  private unsubscribe?: () => void;

  private subscribeToViewModel(): void {
    this.unsubscribe = this.props.viewModel.subscribe(() => {
      if (this.mounted) {
        this.forceUpdate();
      }
    });
  }

  componentDidMount(): void {
    this.mounted = true;
    this.subscribeToViewModel();
    void this.loadMembers();
  }

  componentDidUpdate(previousProps: Props): void {
    if (previousProps.viewModel !== this.props.viewModel) {
      this.unsubscribe?.();
      this.subscribeToViewModel();
    }

    if (
      previousProps.viewModel !== this.props.viewModel ||
      previousProps.controller !== this.props.controller
    ) {
      void this.loadMembers();
    }
  }

  componentWillUnmount(): void {
    this.mounted = false;
    this.unsubscribe?.();
  }

  private async loadMembers() {
    try {
      await this.props.controller.loadMembers({});
      if (this.mounted) this.forceUpdate();
    } catch (error) {
      if (this.mounted) {
        this.setState({
          error:
            error instanceof Error ? error.message : "Unable to load members.",
        });
      }
    }
  }

  private toggleMember = (id: Member["id"]) => {
    this.setState((previous) => ({
      expandedMemberId: previous.expandedMemberId === id ? null : id,
    }));
  };

  private confirmMessage = (member: Member) => {
    const name = `${member.firstName} ${member.lastName}`.trim();

    Alert.alert("Send a message?", `Would you like to message ${name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Message",
        // onPress: () => this.props.onMessagePress(member),
      },
    ]);
  };

  render() {
    const query = this.state.search.trim().toLowerCase();
    const members = (this.props.viewModel.members ?? []).filter((member) =>
      `${member.firstName} ${member.lastName} ${member.username} ${member.email}`
        .toLowerCase()
        .includes(query),
    );

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <TextInput
            style={styles.search}
            placeholder="Search members"
            placeholderTextColor="#8190A7"
            accessibilityLabel="Search members"
            value={this.state.search}
            onChangeText={(search) => this.setState({ search })}
            autoCapitalize="none"
            autoCorrect={false}
          />

          {this.state.error && (
            <Text style={styles.error}>{this.state.error}</Text>
          )}

          <FlatList
            data={members}
            extraData={this.state.expandedMemberId}
            keyExtractor={(member) => String(member.id)}
            keyboardShouldPersistTaps="handled"
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={
              <Text style={styles.empty}>No members found.</Text>
            }
            renderItem={({ item }) => {
              const name =
                `${item.firstName} ${item.lastName}`.trim() || "No Name";
              const initials = name
                .split(/\s+/)
                .slice(0, 2)
                .map((part) => part.charAt(0))
                .join("")
                .toUpperCase();

              const expanded = this.state.expandedMemberId === item.id;

              return (
                <View style={expanded ? styles.expandedCard : undefined}>
                  <Pressable
                    onPress={() => this.toggleMember(item.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`${name}, ${
                      expanded ? "hide" : "show"
                    } profile details`}
                    accessibilityState={{ expanded }}
                    style={({ pressed }) => [
                      styles.row,
                      pressed && styles.pressed,
                    ]}
                  >
                    <MemberAvatar
                      member={item}
                      initials={initials}
                      expanded={expanded}
                    />

                    <Text style={styles.name}>{name}</Text>

                    <Text style={styles.toggle}>{expanded ? "−" : "+"}</Text>
                  </Pressable>

                  {expanded && (
                    <View style={styles.details}>
                      <Text style={styles.label}>Username</Text>
                      <Text style={styles.value}>@{item.username}</Text>

                      <Text style={styles.label}>Email</Text>
                      <Text selectable style={styles.value}>
                        {item.email}
                      </Text>

                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Message ${name}`}
                        onPress={() => this.confirmMessage(item)}
                        style={({ pressed }) => [
                          styles.messageButton,
                          pressed && styles.pressed,
                        ]}
                      >
                        <Text style={styles.messageButtonText}>
                          Message {item.firstName}
                        </Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              );
            }}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  search: {
    backgroundColor: "#F5F7FC",
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginVertical: 16,
    fontSize: 17,
    color: "#192F4D",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    gap: 16,
  },
  expandedCard: {
    backgroundColor: "#F5F7FC",
    borderRadius: 18,
    paddingHorizontal: 14,
    marginVertical: 8,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#EAF1FF",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  largeAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  initials: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2864EF",
  },
  name: {
    flex: 1,
    fontSize: 19,
    fontWeight: "600",
    color: "#192F4D",
  },
  toggle: {
    fontSize: 26,
    color: "#2864EF",
  },
  details: {
    paddingBottom: 18,
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8190A7",
    marginTop: 6,
  },
  value: {
    fontSize: 16,
    color: "#192F4D",
  },
  messageButton: {
    marginTop: 16,
    backgroundColor: "#2864EF",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  messageButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.7,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E9EDF3",
  },
  empty: {
    textAlign: "center",
    marginTop: 24,
    color: "#8190A7",
  },
  error: {
    color: "#B13A3A",
    marginBottom: 12,
  },
});
