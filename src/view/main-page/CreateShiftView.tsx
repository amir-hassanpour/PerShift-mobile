// src/view/create-shift/CreateShiftView.tsx

import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import React from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { User } from "@/entity/User";
import { LoadCreateShiftPageController } from "@/interface-adapter/shift/create-shift/load-create-shift-page/LoadCreateShiftPageController";
import { LoadCreateShiftPageState } from "@/interface-adapter/shift/create-shift/load-create-shift-page/LoadCreateShiftPageState";
import { LoadCreateShiftPageViewModel } from "@/interface-adapter/shift/create-shift/load-create-shift-page/LoadCreateShiftPageViewModel";

export type CreateShiftCollectedValues = {
  startTime: Date | null;
  endTime: Date | null;
  address: string;
  description: string;
  users: User[];
};

type CreateShiftViewProps = {
  controller: LoadCreateShiftPageController;
  viewModel: LoadCreateShiftPageViewModel;

  /*
   * This callback receives exactly what the view collected.
   * It may receive null start/end values. Validation belongs in
   * your use case, not this view.
   */
  onCreateShift: (values: CreateShiftCollectedValues) => void | Promise<void>;
};

type TimeField = "start" | "end";

type CreateShiftViewState = {
  startTime: Date | null;
  endTime: Date | null;
  address: string;
  description: string;
  selectedUserIds: Set<string>;

  activePicker: TimeField | null;
  androidPickerMode: "date" | "time";
  pickerValue: Date;
};

type StateMessage = {
  text: string;
  type: "error" | "success";
};

export class CreateShiftView extends React.Component<
  CreateShiftViewProps,
  CreateShiftViewState
> {
  private unsubscribeFromViewModel?: () => void;

  constructor(props: CreateShiftViewProps) {
    super(props);

    this.state = {
      startTime: null,
      endTime: null,
      address: "",
      description: "",
      selectedUserIds: new Set<string>(),

      activePicker: null,
      androidPickerMode: "date",
      pickerValue: new Date(),
    };
  }

  componentDidMount(): void {
    this.subscribeToViewModel();

    void this.props.controller
      .loadCreateShiftPage({})
      .catch((error: unknown) => {
        console.error("Unable to load the Create Shift page:", error);
      });
  }

  componentDidUpdate(previousProps: CreateShiftViewProps): void {
    if (previousProps.viewModel !== this.props.viewModel) {
      this.unsubscribeFromViewModel?.();
      this.subscribeToViewModel();
    }

    if (previousProps.controller !== this.props.controller) {
      void this.props.controller
        .loadCreateShiftPage({})
        .catch((error: unknown) => {
          console.error("Unable to load the Create Shift page:", error);
        });
    }
  }

  componentWillUnmount(): void {
    this.unsubscribeFromViewModel?.();
  }

  private subscribeToViewModel = (): void => {
    this.unsubscribeFromViewModel = this.props.viewModel.subscribe(() => {
      this.forceUpdate();
    });
  };

  private openPicker = (field: TimeField): void => {
    const currentValue =
      field === "start" ? this.state.startTime : this.state.endTime;

    this.setState({
      activePicker: field,
      androidPickerMode: "date",
      pickerValue: currentValue ?? new Date(),
    });
  };

  private closePicker = (): void => {
    this.setState({
      activePicker: null,
      androidPickerMode: "date",
    });
  };

  private handlePickerChange = (
    event: DateTimePickerEvent,
    selectedValue?: Date,
  ): void => {
    const { activePicker, androidPickerMode, pickerValue } = this.state;

    if (activePicker === null) {
      return;
    }

    if (event.type === "dismissed") {
      this.closePicker();
      return;
    }

    if (!selectedValue) {
      return;
    }

    if (Platform.OS === "android") {
      if (androidPickerMode === "date") {
        const valueWithSelectedDate = new Date(pickerValue);

        valueWithSelectedDate.setFullYear(
          selectedValue.getFullYear(),
          selectedValue.getMonth(),
          selectedValue.getDate(),
        );

        if (activePicker === "start") {
          this.setState({
            startTime: valueWithSelectedDate,
            pickerValue: valueWithSelectedDate,
            androidPickerMode: "time",
          });
        } else {
          this.setState({
            endTime: valueWithSelectedDate,
            pickerValue: valueWithSelectedDate,
            androidPickerMode: "time",
          });
        }

        return;
      }

      const valueWithSelectedTime = new Date(pickerValue);

      valueWithSelectedTime.setHours(
        selectedValue.getHours(),
        selectedValue.getMinutes(),
        0,
        0,
      );

      if (activePicker === "start") {
        this.setState({
          startTime: valueWithSelectedTime,
          pickerValue: valueWithSelectedTime,
          activePicker: null,
          androidPickerMode: "date",
        });
      } else {
        this.setState({
          endTime: valueWithSelectedTime,
          pickerValue: valueWithSelectedTime,
          activePicker: null,
          androidPickerMode: "date",
        });
      }

      return;
    }

    // iOS supplies the complete date and time.
    if (activePicker === "start") {
      this.setState({
        startTime: selectedValue,
        pickerValue: selectedValue,
      });
    } else {
      this.setState({
        endTime: selectedValue,
        pickerValue: selectedValue,
      });
    }
  };

  private addUser = (userId: string): void => {
    this.setState((currentState) => {
      const selectedUserIds = new Set(currentState.selectedUserIds);

      selectedUserIds.add(userId);

      return { selectedUserIds };
    });
  };

  private removeUser = (userId: string): void => {
    this.setState((currentState) => {
      const selectedUserIds = new Set(currentState.selectedUserIds);

      selectedUserIds.delete(userId);

      return { selectedUserIds };
    });
  };

  private getSelectedUsers = (): User[] => {
    return this.props.viewModel.userToAdd.filter((user) =>
      this.state.selectedUserIds.has(user.id),
    );
  };

  private handleCreateShift = (): void => {
    /*
     * There are intentionally no checks here.
     *
     * Null times and empty optional fields are passed to the
     * application layer. The use case decides which state to set.
     */
    void this.props.onCreateShift({
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      address: this.state.address,
      description: this.state.description,
      users: this.getSelectedUsers(),
    });
  };

  private getStateMessage = (): StateMessage | null => {
    /*
     * These messages are based only on viewModel.state.
     * This method does not inspect any collected input.
     */
    switch (this.props.viewModel.state) {
      case LoadCreateShiftPageState.START_TIME_MISSING:
        return {
          text: "Please select a start time.",
          type: "error",
        };

      case LoadCreateShiftPageState.END_TIME_MISSING:
        return {
          text: "Please select an end time.",
          type: "error",
        };

      case LoadCreateShiftPageState.TIME_INVALID:
        return {
          text: "The end time must be later than the start time.",
          type: "error",
        };

      case LoadCreateShiftPageState.FAILURE:
        return {
          text: "The shift could not be created. Please try again.",
          type: "error",
        };

      case LoadCreateShiftPageState.SUCCESS:
      case LoadCreateShiftPageState.IDLE:
      default:
        return null;
    }
  };

  private formatDateTime = (
    value: Date | null,
    placeholder: string,
  ): string => {
    if (value === null) {
      return placeholder;
    }

    return value.toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  private renderAvatar(user: User, size = 62): React.ReactNode {
    const initials =
      `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();

    return (
      <View
        style={[
          styles.avatarBorder,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      >
        {user.avatarUrl ? (
          <Image
            source={{ uri: user.avatarUrl }}
            style={{
              width: size - 8,
              height: size - 8,
              borderRadius: (size - 8) / 2,
            }}
          />
        ) : (
          <View
            style={[
              styles.avatarFallback,
              {
                width: size - 8,
                height: size - 8,
                borderRadius: (size - 8) / 2,
              },
            ]}
          >
            <Text
              style={[
                styles.avatarInitials,
                {
                  fontSize: Math.max(15, size * 0.29),
                },
              ]}
            >
              {initials}
            </Text>
          </View>
        )}
      </View>
    );
  }

  private renderSectionTitle(title: string, count: number): React.ReactNode {
    return (
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>{title}</Text>

        <View style={styles.countBadge}>
          <Text style={styles.countText}>{count}</Text>
        </View>
      </View>
    );
  }

  private renderPicker(field: TimeField): React.ReactNode {
    const { activePicker, androidPickerMode, pickerValue } = this.state;

    if (activePicker !== field) {
      return null;
    }

    return (
      <View style={styles.pickerPanel}>
        <DateTimePicker
          value={pickerValue}
          mode={Platform.OS === "ios" ? "datetime" : androidPickerMode}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={this.handlePickerChange}
          accentColor={colors.blue}
        />

        {Platform.OS === "ios" && (
          <Pressable
            accessibilityRole="button"
            onPress={this.closePicker}
            style={styles.pickerDoneButton}
          >
            <Text style={styles.pickerDoneText}>Done</Text>
          </Pressable>
        )}
      </View>
    );
  }

  private renderUsersToAdd(users: User[]): React.ReactNode {
    const { selectedUserIds } = this.state;

    return (
      <View style={styles.peopleSection}>
        {this.renderSectionTitle("Users to Add", users.length)}

        <View style={styles.peopleBox}>
          {users.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                There are no users available to add.
              </Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.userList}
            >
              {users.map((user) => {
                const isSelected = selectedUserIds.has(user.id);

                return (
                  <Pressable
                    key={user.id}
                    accessibilityRole="button"
                    accessibilityLabel={`Add ${user.firstName} ${user.lastName}`}
                    accessibilityState={{
                      selected: isSelected,
                    }}
                    disabled={isSelected}
                    onPress={() => this.addUser(user.id)}
                    style={[
                      styles.userOption,
                      isSelected && styles.userOptionSelected,
                    ]}
                  >
                    <View>
                      {this.renderAvatar(user)}

                      {isSelected && (
                        <View style={styles.selectedCheck}>
                          <Text style={styles.selectedCheckText}>✓</Text>
                        </View>
                      )}
                    </View>

                    <Text numberOfLines={1} style={styles.userOptionName}>
                      {user.firstName}
                    </Text>

                    <Text numberOfLines={1} style={styles.userOptionLastName}>
                      {user.lastName}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}
        </View>
      </View>
    );
  }

  private renderUsersAdded(users: User[]): React.ReactNode {
    return (
      <View style={styles.peopleSection}>
        {this.renderSectionTitle("Users Added", users.length)}

        <View style={styles.peopleBox}>
          {users.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Select a profile above to add someone to the shift.
              </Text>
            </View>
          ) : (
            <View style={styles.addedUsersList}>
              {users.map((user, index) => (
                <View
                  key={user.id}
                  style={[
                    styles.addedUserRow,
                    index < users.length - 1 && styles.addedUserDivider,
                  ]}
                >
                  {this.renderAvatar(user, 54)}

                  <View style={styles.addedUserInformation}>
                    <Text style={styles.addedUserName}>
                      {user.firstName} {user.lastName}
                    </Text>

                    <Text style={styles.addedUserStatus}>User added</Text>
                  </View>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Remove ${user.firstName} ${user.lastName}`}
                    hitSlop={10}
                    onPress={() => this.removeUser(user.id)}
                    style={({ pressed }) => [
                      styles.removeButton,
                      pressed && styles.removeButtonPressed,
                    ]}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  }

  private renderStateMessage(): React.ReactNode {
    const message = this.getStateMessage();

    if (message === null) {
      return null;
    }

    return (
      <View
        accessibilityLiveRegion="polite"
        style={[
          styles.messageBox,
          message.type === "error"
            ? styles.errorMessageBox
            : styles.successMessageBox,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            message.type === "error"
              ? styles.errorMessageText
              : styles.successMessageText,
          ]}
        >
          {message.text}
        </Text>
      </View>
    );
  }

  render(): React.ReactNode {
    const { address, description, endTime, startTime } = this.state;

    const usersToAdd = this.props.viewModel.userToAdd;

    const selectedUsers = this.getSelectedUsers();

    return (
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.page}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.header}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={10}
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.backButtonPressed,
              ]}
            >
              <SymbolView
                name={{
                  ios: "chevron.left",
                  android: "arrow_back",
                  web: "arrow_back",
                }}
                tintColor={colors.blue}
                size={22}
                style={styles.backIcon}
              />

              <Text style={styles.backButtonText}>Back</Text>
            </Pressable>

            <Text style={styles.wordmark}>
              <Text style={styles.wordmarkDark}>Per</Text>
              <Text style={styles.wordmarkBlue}>Shift</Text>
            </Text>

            <View style={styles.headerSpacer} />
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.pageTitle}>Create Shift</Text>

            <Text style={styles.pageSubtitle}>
              Enter the shift details and choose the people you want to add.
            </Text>

            {/* Start time */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Start Time
                <Text style={styles.requiredMark}> *</Text>
              </Text>

              <Pressable
                accessibilityRole="button"
                onPress={() => this.openPicker("start")}
                style={({ pressed }) => [
                  styles.selectionField,
                  pressed && styles.fieldPressed,
                ]}
              >
                <Text style={styles.selectionFieldIcon}>◷</Text>

                <Text
                  style={[
                    styles.selectionFieldText,
                    startTime === null && styles.placeholderText,
                  ]}
                >
                  {this.formatDateTime(startTime, "Select a start time")}
                </Text>
              </Pressable>

              {this.renderPicker("start")}
            </View>

            {/* End time */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                End Time
                <Text style={styles.requiredMark}> *</Text>
              </Text>

              <Pressable
                accessibilityRole="button"
                onPress={() => this.openPicker("end")}
                style={({ pressed }) => [
                  styles.selectionField,
                  pressed && styles.fieldPressed,
                ]}
              >
                <Text style={styles.selectionFieldIcon}>◷</Text>

                <Text
                  style={[
                    styles.selectionFieldText,
                    endTime === null && styles.placeholderText,
                  ]}
                >
                  {this.formatDateTime(endTime, "Select an end time")}
                </Text>
              </Pressable>

              {this.renderPicker("end")}
            </View>

            {/* Optional address */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Address
                <Text style={styles.optionalLabel}> — Optional</Text>
              </Text>

              <TextInput
                value={address}
                onChangeText={(value) => this.setState({ address: value })}
                placeholder="Enter the shift address"
                placeholderTextColor={colors.muted}
                selectionColor={colors.blue}
                style={styles.textInput}
              />
            </View>

            {/* Optional description */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Description
                <Text style={styles.optionalLabel}> — Optional</Text>
              </Text>

              <TextInput
                value={description}
                onChangeText={(value) => this.setState({ description: value })}
                placeholder="Describe the shift"
                placeholderTextColor={colors.muted}
                selectionColor={colors.blue}
                multiline
                maxLength={500}
                textAlignVertical="top"
                style={[styles.textInput, styles.descriptionInput]}
              />

              <Text style={styles.characterCount}>
                {description.length}/500
              </Text>
            </View>

            {this.renderUsersToAdd(usersToAdd)}
            {this.renderUsersAdded(selectedUsers)}

            {/* Message is immediately above the button */}
            {this.renderStateMessage()}

            <Pressable
              accessibilityRole="button"
              onPress={this.handleCreateShift}
              style={({ pressed }) => [
                styles.createButton,
                pressed && styles.createButtonPressed,
              ]}
            >
              <Text style={styles.createButtonText}>Create Shift</Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const colors = {
  background: "#FFFFFF",
  navy: "#0B254B",
  blue: "#246BEB",
  paleBlue: "#EAF1FF",
  fieldBackground: "#F5F7FC",
  border: "#DDE6F5",
  muted: "#8190AA",
  error: "#C62828",
  errorBackground: "#FFF0F0",
  errorBorder: "#F3B7B7",
  success: "#19733B",
  successBackground: "#ECF8F0",
  successBorder: "#A7D9B7",
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  page: {
    flex: 1,
  },
  header: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  backButton: {
    minWidth: 78,
    height: 40,
    paddingHorizontal: 6,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonPressed: {
    backgroundColor: colors.paleBlue,
  },
  backIcon: {
    width: 22,
    height: 22,
  },
  backButtonText: {
    color: colors.blue,
    marginLeft: 3,
    fontSize: 16,
    fontWeight: "600",
  },
  headerSpacer: {
    width: 78,
  },
  wordmark: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -1,
  },
  wordmarkDark: {
    color: colors.navy,
  },
  wordmarkBlue: {
    color: colors.blue,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 44,
  },
  pageTitle: {
    color: colors.navy,
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  pageSubtitle: {
    color: colors.muted,
    marginTop: 8,
    marginBottom: 28,
    fontSize: 15,
    lineHeight: 22,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    color: colors.navy,
    marginBottom: 9,
    fontSize: 15,
    fontWeight: "700",
  },
  requiredMark: {
    color: colors.error,
  },
  optionalLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "500",
  },
  selectionField: {
    minHeight: 58,
    paddingHorizontal: 17,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 17,
    backgroundColor: colors.fieldBackground,
    flexDirection: "row",
    alignItems: "center",
  },
  fieldPressed: {
    opacity: 0.7,
  },
  selectionFieldIcon: {
    width: 29,
    color: colors.blue,
    fontSize: 21,
    fontWeight: "700",
  },
  selectionFieldText: {
    flex: 1,
    color: colors.navy,
    fontSize: 15,
    fontWeight: "600",
  },
  placeholderText: {
    color: colors.muted,
    fontWeight: "400",
  },
  textInput: {
    minHeight: 58,
    paddingHorizontal: 17,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 17,
    backgroundColor: colors.fieldBackground,
    color: colors.navy,
    fontSize: 16,
  },
  descriptionInput: {
    minHeight: 132,
    paddingTop: 16,
    paddingBottom: 16,
  },
  characterCount: {
    alignSelf: "flex-end",
    color: colors.muted,
    marginTop: 6,
    marginRight: 4,
    fontSize: 12,
  },
  pickerPanel: {
    overflow: "hidden",
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    backgroundColor: colors.fieldBackground,
  },
  pickerDoneButton: {
    alignSelf: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 11,
    backgroundColor: colors.blue,
  },
  pickerDoneText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  peopleSection: {
    marginTop: 8,
    marginBottom: 22,
  },
  sectionTitleRow: {
    marginBottom: 11,
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    color: colors.navy,
    fontSize: 21,
    fontWeight: "800",
    letterSpacing: -0.35,
  },
  countBadge: {
    minWidth: 32,
    height: 32,
    marginLeft: 10,
    paddingHorizontal: 9,
    borderRadius: 16,
    backgroundColor: colors.paleBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  countText: {
    color: colors.blue,
    fontSize: 14,
    fontWeight: "800",
  },
  peopleBox: {
    minHeight: 142,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 21,
    backgroundColor: colors.fieldBackground,
  },
  emptyState: {
    minHeight: 142,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    color: colors.muted,
    textAlign: "center",
    fontSize: 15,
    lineHeight: 22,
  },
  userList: {
    paddingHorizontal: 15,
    paddingVertical: 16,
  },
  userOption: {
    width: 94,
    minHeight: 116,
    marginRight: 9,
    paddingHorizontal: 7,
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: "center",
  },
  userOptionSelected: {
    backgroundColor: colors.paleBlue,
  },
  userOptionName: {
    width: "100%",
    color: colors.navy,
    marginTop: 7,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "700",
  },
  userOptionLastName: {
    width: "100%",
    color: colors.muted,
    marginTop: 1,
    textAlign: "center",
    fontSize: 12,
  },
  avatarBorder: {
    padding: 3,
    borderWidth: 2.5,
    borderColor: colors.blue,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarFallback: {
    backgroundColor: "#DDE8FA",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    color: colors.blue,
    fontWeight: "800",
  },
  selectedCheck: {
    position: "absolute",
    right: -4,
    bottom: -2,
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    borderRadius: 11,
    backgroundColor: colors.blue,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedCheckText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },
  addedUsersList: {
    paddingHorizontal: 16,
  },
  addedUserRow: {
    minHeight: 82,
    flexDirection: "row",
    alignItems: "center",
  },
  addedUserDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  addedUserInformation: {
    flex: 1,
    marginLeft: 13,
  },
  addedUserName: {
    color: colors.navy,
    fontSize: 16,
    fontWeight: "700",
  },
  addedUserStatus: {
    color: colors.muted,
    marginTop: 4,
    fontSize: 13,
  },
  removeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.paleBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonPressed: {
    opacity: 0.65,
  },
  removeButtonText: {
    color: colors.blue,
    marginTop: -2,
    fontSize: 23,
    fontWeight: "500",
  },
  messageBox: {
    marginBottom: 13,
    paddingHorizontal: 15,
    paddingVertical: 13,
    borderWidth: 1,
    borderRadius: 14,
  },
  errorMessageBox: {
    borderColor: colors.errorBorder,
    backgroundColor: colors.errorBackground,
  },
  successMessageBox: {
    borderColor: colors.successBorder,
    backgroundColor: colors.successBackground,
  },
  messageText: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
  errorMessageText: {
    color: colors.error,
  },
  successMessageText: {
    color: colors.success,
  },
  createButton: {
    height: 58,
    marginTop: 5,
    borderRadius: 18,
    backgroundColor: colors.blue,
    alignItems: "center",
    justifyContent: "center",
  },
  createButtonPressed: {
    opacity: 0.75,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },
});

export default CreateShiftView;
