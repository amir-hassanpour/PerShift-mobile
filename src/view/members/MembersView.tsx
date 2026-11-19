import { Role } from "@/entity/Role";
import { AddMemberController } from "@/interface-adapter/members/add-member/AddMemberController";
import { AddMemberState } from "@/interface-adapter/members/add-member/AddMemberState";
import { LoadMembersPageController } from "@/interface-adapter/members/load-members-page/LoadMembersPageController";
import { LoadMembersPageViewModel } from "@/interface-adapter/members/LoadMembersPageViewModel";
import React from "react";
import {
  ActivityIndicator,
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
  addMemberController: AddMemberController;
  viewModel: LoadMembersPageViewModel;
  onMessagePress?: (member: Member) => void;
};

type State = {
  search: string;
  loading: boolean;
  error: string | null;
  expandedMemberId: Member["id"] | null;
  addExpanded: boolean;
  rolesExpanded: boolean;
  email: string;
  selectedRole: Role | null;
  adding: boolean;
  addError: string | null;
  success: string | null;
};

// Supports string roles and role objects with a name or label field.
function roleLabel(role: unknown, index: number): string {
  let label = "";

  if (typeof role === "string") {
    label = role;
  } else if (role && typeof role === "object") {
    if ("name" in role && typeof role.name === "string") {
      label = role.name;
    } else if ("label" in role && typeof role.label === "string") {
      label = role.label;
    }
  }

  const words = label.trim().replace(/[_-]+/g, " ");

  return words
    ? words
        .split(/\s+/)
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ")
    : `Role ${index + 1}`;
}

function MemberAvatar({
  member,
  expanded,
}: {
  member: Member;
  expanded: boolean;
}) {
  const avatarUrl = member.avatarUrl?.trim();
  const [failedUrl, setFailedUrl] = React.useState<string | null>(null);

  const initials =
    `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`.toUpperCase();

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
    loading: true,
    error: null,
    expandedMemberId: null,
    addExpanded: false,
    rolesExpanded: false,
    email: "",
    selectedRole: null,
    adding: false,
    addError: null,
    success: null,
  };

  private mounted = false;
  private addInFlight = false;

  componentDidMount() {
    this.mounted = true;
    void this.loadMembers();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  private loadMembers = async () => {
    if (this.mounted) {
      this.setState({ loading: true, error: null });
    }

    try {
      await this.props.controller.loadMembers({});
    } catch (error) {
      if (this.mounted) {
        this.setState({
          error:
            error instanceof Error ? error.message : "Unable to load members.",
        });
      }
    } finally {
      if (this.mounted) {
        this.setState({ loading: false });
      }
    }
  };

  private toggleMember = (id: Member["id"]) => {
    this.setState((previous) => ({
      expandedMemberId: previous.expandedMemberId === id ? null : id,
    }));
  };

  private toggleAddForm = () => {
    if (this.addInFlight) return;

    this.setState((previous) => ({
      addExpanded: !previous.addExpanded,
      rolesExpanded: false,
      addError: null,
      success: null,
    }));
  };

  private confirmMessage = (member: Member) => {
    const name = `${member.firstName} ${member.lastName}`.trim();

    Alert.alert("Send a message?", `Would you like to message ${name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Message",
        onPress: () => this.props.onMessagePress?.(member),
      },
    ]);
  };

  private readViewModelState = (): LoadMembersPageViewModel["state"] => {
    return this.props.viewModel.state;
  };

  private addMember = async () => {
    if (this.addInFlight || !this.props.viewModel.canAddMembers) return;

    const email = this.state.email.trim().toLowerCase();
    const role = this.state.selectedRole;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.setState({
        addError: "Enter a valid email address.",
        success: null,
      });
      return;
    }

    if (role === null || !this.props.viewModel.roles.includes(role)) {
      this.setState({
        addError: "Select an available role.",
        success: null,
      });
      return;
    }

    this.addInFlight = true;
    this.setState({
      adding: true,
      addError: null,
      success: null,
    });

    // Clear the result from the previous attempt.
    this.props.viewModel.state = AddMemberState.IDLE_ADD_MEMBER;

    try {
      // The presenter must set the result before this promise resolves.
      await this.props.addMemberController.addMember({ email, role });

      if (!this.mounted) return;

      const result = this.readViewModelState();

      switch (result) {
        case AddMemberState.SUCCESS_ADD_MEMBER:
          this.setState({
            email: "",
            selectedRole: null,
            addExpanded: false,
            rolesExpanded: false,
            addError: null,
            success: "Member added successfully.",
          });

          // Reload only after reading the add-member result:
          // loading members may change the shared view-model state.
          await this.loadMembers();
          break;

        case AddMemberState.FAILURE_ADD_MEMBER:
          this.setState({
            addError: "Unable to add this member. Please try again.",
          });
          break;

        default:
          this.setState({
            addError:
              "No result was received. Check the members list before retrying.",
          });
          break;
      }
    } catch (error) {
      if (this.mounted) {
        this.setState({
          addError:
            error instanceof Error ? error.message : "Unable to add member.",
        });
      }
    } finally {
      this.addInFlight = false;

      if (this.mounted) {
        this.setState({ adding: false });
      }
    }
  };

  render() {
    const { viewModel } = this.props;
    const {
      search,
      loading,
      error,
      expandedMemberId,
      addExpanded,
      rolesExpanded,
      email,
      selectedRole,
      adding,
      addError,
      success,
    } = this.state;

    const query = search.trim().toLowerCase();
    const roles = viewModel.roles ?? [];
    const selectedIndex =
      selectedRole === null ? -1 : roles.indexOf(selectedRole);

    const members = (viewModel.members ?? []).filter((member) =>
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
            value={search}
            onChangeText={(search) => this.setState({ search })}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <FlatList
            data={members}
            extraData={this.state}
            keyExtractor={(member) => member.id}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <View>
                {viewModel.canAddMembers && (
                  <View style={styles.addSection}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Add member"
                      accessibilityState={{
                        expanded: addExpanded,
                        disabled: adding,
                      }}
                      disabled={adding}
                      onPress={this.toggleAddForm}
                      style={({ pressed }) => [
                        styles.addToggle,
                        pressed && styles.pressed,
                      ]}
                    >
                      <Text style={styles.addToggleText}>Add member</Text>
                      <Text style={styles.toggle}>
                        {addExpanded ? "−" : "+"}
                      </Text>
                    </Pressable>

                    {addExpanded && (
                      <View style={styles.form}>
                        <Text style={styles.label}>Email address</Text>

                        <TextInput
                          style={styles.input}
                          placeholder="name@example.com"
                          placeholderTextColor="#8190A7"
                          accessibilityLabel="New member email"
                          keyboardType="email-address"
                          autoCapitalize="none"
                          autoCorrect={false}
                          editable={!adding}
                          value={email}
                          onChangeText={(email) =>
                            this.setState({ email, addError: null })
                          }
                        />

                        <Text style={styles.label}>Role</Text>

                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel="Choose member role"
                          accessibilityState={{
                            expanded: rolesExpanded,
                            disabled: adding,
                          }}
                          disabled={adding}
                          onPress={() =>
                            this.setState((previous) => ({
                              rolesExpanded: !previous.rolesExpanded,
                            }))
                          }
                          style={styles.roleSelector}
                        >
                          <Text style={styles.value}>
                            {selectedIndex >= 0
                              ? roleLabel(roles[selectedIndex], selectedIndex)
                              : "Select a role"}
                          </Text>

                          <Text style={styles.toggle}>
                            {rolesExpanded ? "−" : "+"}
                          </Text>
                        </Pressable>

                        {rolesExpanded && (
                          <View style={styles.roleOptions}>
                            {roles.length === 0 ? (
                              <Text style={styles.noRoles}>
                                No roles available.
                              </Text>
                            ) : (
                              roles.map((role, index) => {
                                const selected = index === selectedIndex;

                                return (
                                  <Pressable
                                    key={index}
                                    accessibilityRole="radio"
                                    accessibilityLabel={roleLabel(role, index)}
                                    accessibilityState={{
                                      checked: selected,
                                      disabled: adding,
                                    }}
                                    disabled={adding}
                                    onPress={() =>
                                      this.setState({
                                        selectedRole: role,
                                        rolesExpanded: false,
                                        addError: null,
                                      })
                                    }
                                    style={[
                                      styles.roleOption,
                                      selected && styles.selectedRole,
                                    ]}
                                  >
                                    <Text style={styles.value}>
                                      {roleLabel(role, index)}
                                    </Text>

                                    <View
                                      style={[
                                        styles.radio,
                                        selected && styles.selectedRadio,
                                      ]}
                                    >
                                      {selected && (
                                        <View style={styles.radioDot} />
                                      )}
                                    </View>
                                  </Pressable>
                                );
                              })
                            )}
                          </View>
                        )}

                        {addError && (
                          <Text accessibilityRole="alert" style={styles.error}>
                            {addError}
                          </Text>
                        )}

                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={
                            adding ? "Adding member" : "Add member"
                          }
                          accessibilityState={{
                            disabled: adding,
                            busy: adding,
                          }}
                          disabled={adding}
                          onPress={this.addMember}
                          style={({ pressed }) => [
                            styles.primaryButton,
                            (adding || pressed) && styles.pressed,
                          ]}
                        >
                          {adding ? (
                            <View style={styles.buttonContent}>
                              <ActivityIndicator color="#FFFFFF" />
                              <Text style={styles.primaryButtonText}>
                                Adding member…
                              </Text>
                            </View>
                          ) : (
                            <Text style={styles.primaryButtonText}>
                              Add member
                            </Text>
                          )}
                        </Pressable>
                      </View>
                    )}
                  </View>
                )}

                {success && (
                  <Text accessibilityLiveRegion="polite" style={styles.success}>
                    {success}
                  </Text>
                )}

                {error && (
                  <Text accessibilityRole="alert" style={styles.error}>
                    {error}
                  </Text>
                )}
              </View>
            }
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={
              loading ? (
                <ActivityIndicator style={styles.loading} color="#2864EF" />
              ) : (
                <Text style={styles.empty}>
                  {query ? "No matching members found." : "No members found."}
                </Text>
              )
            }
            renderItem={({ item }) => {
              const name =
                `${item.firstName} ${item.lastName}`.trim() || "No Name";
              const expanded = expandedMemberId === item.id;

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
                    <MemberAvatar member={item} expanded={expanded} />

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

                      {!!this.props.onMessagePress && (
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={`Message ${name}`}
                          onPress={() => this.confirmMessage(item)}
                          style={({ pressed }) => [
                            styles.primaryButton,
                            pressed && styles.pressed,
                          ]}
                        >
                          <Text style={styles.primaryButtonText}>
                            Message {item.firstName}
                          </Text>
                        </Pressable>
                      )}
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
  listContent: {
    paddingBottom: 24,
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
  addSection: {
    backgroundColor: "#F5F7FC",
    borderRadius: 18,
    marginBottom: 16,
    overflow: "hidden",
  },
  addToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  addToggleText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#2864EF",
  },
  form: {
    paddingHorizontal: 18,
    paddingBottom: 18,
    gap: 10,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E8F5",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: "#192F4D",
  },
  roleSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E8F5",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 12,
  },
  roleOptions: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E8F5",
    borderRadius: 12,
    overflow: "hidden",
  },
  roleOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    gap: 12,
  },
  selectedRole: {
    backgroundColor: "#EAF1FF",
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#BBC7D9",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedRadio: {
    borderColor: "#2864EF",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2864EF",
  },
  noRoles: {
    padding: 16,
    color: "#8190A7",
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
    flexShrink: 1,
    fontSize: 16,
    color: "#192F4D",
  },
  primaryButton: {
    marginTop: 12,
    backgroundColor: "#2864EF",
    borderRadius: 14,
    minHeight: 48,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  primaryButtonText: {
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
  loading: {
    marginTop: 24,
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
  success: {
    color: "#237A50",
    marginBottom: 12,
  },
});
