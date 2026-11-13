import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { router } from "expo-router";
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
import { CreateShiftState } from "@/interface-adapter/shift/create-shift/create-shift/CreateShiftState";
import { LoadCreateShiftPageController } from "@/interface-adapter/shift/create-shift/load-create-shift-page/LoadCreateShiftPageController";
import { LoadCreateShiftPageViewModel } from "@/interface-adapter/shift/create-shift/LoadCreateShiftPageViewModel";

export type CreateShiftCollectedValues = {
  startTime: Date | null;
  endTime: Date | null;
  address: string;
  description: string;
  users: User[];
  businessID: string;
};

type Props = {
  controller: LoadCreateShiftPageController;
  viewModel: LoadCreateShiftPageViewModel;
  onCreateShift: (values: CreateShiftCollectedValues) => void | Promise<void>;
  businessID: string;
};

type PickerTarget = "startTime" | "endTime";

type State = {
  startTime: Date | null;
  endTime: Date | null;
  address: string;
  description: string;
  selectedUserIds: Set<string>;
  pickerTarget: PickerTarget | null;
  pickerMode: "date" | "time";
  pickerValue: Date;
};

export class CreateShiftView extends React.Component<Props, State> {
  private unsubscribe?: () => void;

  state: State = {
    startTime: null,
    endTime: null,
    address: "",
    description: "",
    selectedUserIds: new Set(),
    pickerTarget: null,
    pickerMode: "date",
    pickerValue: new Date(),
  };

  componentDidMount(): void {
    this.unsubscribe = this.props.viewModel.subscribe(() => {
      if (this.props.viewModel.state === CreateShiftState.SUCCESS) {
        router.back();
        return;
      }

      this.forceUpdate();
    });
    void this.props.controller.loadCreateShiftPage({});
  }

  componentWillUnmount(): void {
    this.unsubscribe?.();
  }

  private openPicker = (pickerTarget: PickerTarget): void => {
    this.setState({
      pickerTarget,
      pickerMode: "date",
      pickerValue: this.state[pickerTarget] ?? new Date(),
    });
  };

  private closePicker = (): void => {
    this.setState({
      pickerTarget: null,
      pickerMode: "date",
    });
  };

  private savePickedTime = (
    target: PickerTarget,
    value: Date,
    close: boolean,
  ): void => {
    const pickerState = {
      pickerValue: value,
      pickerTarget: close ? null : target,
      pickerMode: close ? ("date" as const) : ("time" as const),
    };

    if (target === "startTime") {
      this.setState({
        ...pickerState,
        startTime: value,
      });
    } else {
      this.setState({
        ...pickerState,
        endTime: value,
      });
    }
  };

  private changeTime = (
    event: DateTimePickerEvent,
    selectedValue?: Date,
  ): void => {
    const { pickerTarget, pickerMode, pickerValue } = this.state;

    if (pickerTarget === null) {
      return;
    }

    if (event.type === "dismissed") {
      this.closePicker();
      return;
    }

    if (!selectedValue) {
      return;
    }

    if (Platform.OS === "ios") {
      this.savePickedTime(pickerTarget, selectedValue, false);
      return;
    }

    const completeValue = new Date(pickerValue);

    if (pickerMode === "date") {
      completeValue.setFullYear(
        selectedValue.getFullYear(),
        selectedValue.getMonth(),
        selectedValue.getDate(),
      );

      this.savePickedTime(pickerTarget, completeValue, false);
      return;
    }

    completeValue.setHours(
      selectedValue.getHours(),
      selectedValue.getMinutes(),
      0,
      0,
    );

    this.savePickedTime(pickerTarget, completeValue, true);
  };

  private toggleUser = (userId: string): void => {
    this.setState((currentState) => {
      const selectedUserIds = new Set(currentState.selectedUserIds);

      if (selectedUserIds.has(userId)) {
        selectedUserIds.delete(userId);
      } else {
        selectedUserIds.add(userId);
      }

      return { selectedUserIds };
    });
  };

  private getSelectedUsers = (): User[] => {
    return this.props.viewModel.userToAdd.filter((user) =>
      this.state.selectedUserIds.has(user.id),
    );
  };

  private submit = (): void => {
    /*
     * There is intentionally no validation here.
     * The view sends exactly what it collected.
     */
    void this.props.onCreateShift({
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      address: this.state.address,
      description: this.state.description,
      users: this.getSelectedUsers(),
      businessID: this.props.businessID,
    });
  };

  private getMessage = (): string | null => {
    const messages: Partial<Record<Props["viewModel"]["state"], string>> = {
      [CreateShiftState.START_TIME_MISSING]: "Please select a start time.",
      [CreateShiftState.END_TIME_MISSING]: "Please select an end time.",
      [CreateShiftState.TIME_INVALID]:
        "The end time must be later than the start time.",
      [CreateShiftState.FAILURE]:
        "The shift could not be created. Please try again.",
    };

    return messages[this.props.viewModel.state] ?? null;
  };

  private formatTime = (value: Date | null, placeholder: string): string => {
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

  private renderPicker = (target: PickerTarget): React.ReactNode => {
    if (this.state.pickerTarget !== target) {
      return null;
    }

    return (
      <View style={styles.pickerBox}>
        <DateTimePicker
          value={this.state.pickerValue}
          mode={Platform.OS === "ios" ? "datetime" : this.state.pickerMode}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={this.changeTime}
          accentColor={colors.blue}
        />

        {Platform.OS === "ios" && (
          <Pressable
            accessibilityRole="button"
            onPress={this.closePicker}
            style={styles.doneButton}
          >
            <Text style={styles.doneText}>Done</Text>
          </Pressable>
        )}
      </View>
    );
  };

  private renderTimeField = (
    label: string,
    target: PickerTarget,
    placeholder: string,
  ): React.ReactNode => {
    const value = this.state[target];

    return (
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          {label}
          <Text style={styles.required}> *</Text>
        </Text>

        <Pressable
          accessibilityRole="button"
          onPress={() => this.openPicker(target)}
          style={({ pressed }) => [
            styles.selectionField,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.timeIcon}>◷</Text>

          <Text
            style={[styles.selectionText, value === null && styles.placeholder]}
          >
            {this.formatTime(value, placeholder)}
          </Text>
        </Pressable>

        {this.renderPicker(target)}
      </View>
    );
  };

  private renderAvatar = (user: User, size = 58): React.ReactNode => {
    const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

    return (
      <View
        style={[
          styles.avatar,
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
          <Text style={styles.initials}>{initials}</Text>
        )}
      </View>
    );
  };

  private renderTitle = (title: string, count: number): React.ReactNode => (
    <View style={styles.sectionTitleRow}>
      <Text style={styles.sectionTitle}>{title}</Text>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>{count}</Text>
      </View>
    </View>
  );

  private renderAvailableUsers = (users: User[]): React.ReactNode => (
    <View style={styles.peopleSection}>
      {this.renderTitle("Users to Add", users.length)}

      <View style={styles.peopleBox}>
        {users.length === 0 ? (
          this.renderEmpty("There are no users available to add.")
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.availableUsers}
          >
            {users.map((user) => {
              const selected = this.state.selectedUserIds.has(user.id);

              return (
                <Pressable
                  key={user.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => this.toggleUser(user.id)}
                  style={[styles.userOption, selected && styles.selectedOption]}
                >
                  <View>
                    {this.renderAvatar(user)}

                    {selected && (
                      <View style={styles.check}>
                        <Text style={styles.checkText}>✓</Text>
                      </View>
                    )}
                  </View>

                  <Text numberOfLines={1} style={styles.optionFirstName}>
                    {user.firstName}
                  </Text>

                  <Text numberOfLines={1} style={styles.optionLastName}>
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

  private renderSelectedUsers = (users: User[]): React.ReactNode => (
    <View style={styles.peopleSection}>
      {this.renderTitle("Users Added", users.length)}

      <View style={styles.peopleBox}>
        {users.length === 0 ? (
          this.renderEmpty(
            "Select a profile above to add someone to the shift.",
          )
        ) : (
          <View style={styles.selectedUsers}>
            {users.map((user, index) => (
              <View
                key={user.id}
                style={[
                  styles.selectedUserRow,
                  index < users.length - 1 && styles.divider,
                ]}
              >
                {this.renderAvatar(user, 52)}

                <View style={styles.userInformation}>
                  <Text style={styles.userName}>
                    {user.firstName} {user.lastName}
                  </Text>

                  <Text style={styles.userStatus}>User added</Text>
                </View>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${user.firstName}`}
                  hitSlop={10}
                  onPress={() => this.toggleUser(user.id)}
                  style={({ pressed }) => [
                    styles.removeButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.removeText}>×</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  private renderEmpty = (message: string): React.ReactNode => (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );

  render(): React.ReactNode {
    const users = this.props.viewModel.userToAdd;
    const selectedUsers = this.getSelectedUsers();
    const message = this.getMessage();

    return (
      <SafeAreaView style={styles.screen}>
        <KeyboardAvoidingView
          style={styles.screen}
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
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.backText}>‹ Back</Text>
            </Pressable>

            <Text style={styles.brand}>
              Per<Text style={styles.brandBlue}>Shift</Text>
            </Text>

            <View style={styles.headerSpacer} />
          </View>

          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.pageTitle}>Create Shift</Text>

            {this.renderTimeField(
              "Start Time",
              "startTime",
              "Select a start time",
            )}

            {this.renderTimeField("End Time", "endTime", "Select an end time")}

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                Address
                <Text style={styles.optional}> — Optional</Text>
              </Text>

              <TextInput
                value={this.state.address}
                onChangeText={(address) => this.setState({ address })}
                placeholder="Enter the shift address"
                placeholderTextColor={colors.muted}
                selectionColor={colors.blue}
                style={styles.input}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                Description
                <Text style={styles.optional}> — Optional</Text>
              </Text>

              <TextInput
                value={this.state.description}
                onChangeText={(description) => this.setState({ description })}
                placeholder="Describe the shift"
                placeholderTextColor={colors.muted}
                selectionColor={colors.blue}
                multiline
                maxLength={500}
                textAlignVertical="top"
                style={[styles.input, styles.description]}
              />

              <Text style={styles.characterCount}>
                {this.state.description.length}/500
              </Text>
            </View>

            {this.renderAvailableUsers(users)}
            {this.renderSelectedUsers(selectedUsers)}

            {message !== null && (
              <View accessibilityLiveRegion="polite" style={styles.errorBox}>
                <Text style={styles.errorText}>{message}</Text>
              </View>
            )}

            <Pressable
              accessibilityRole="button"
              onPress={this.submit}
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
  white: "#FFFFFF",
  navy: "#0B254B",
  blue: "#246BEB",
  paleBlue: "#EAF1FF",
  background: "#F5F7FC",
  border: "#DDE6F5",
  muted: "#8190AA",
  error: "#C62828",
  errorBackground: "#FFF0F0",
  errorBorder: "#F3B7B7",
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    height: 56,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 80,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
  },
  backText: {
    color: colors.blue,
    fontSize: 16,
    fontWeight: "600",
  },
  brand: {
    color: colors.navy,
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -1,
  },
  brandBlue: {
    color: colors.blue,
  },
  headerSpacer: {
    width: 80,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 44,
  },
  pageTitle: {
    color: colors.navy,
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.8,
    marginBottom: 28,
  },
  subtitle: {
    color: colors.muted,
    marginTop: 8,
    marginBottom: 28,
    fontSize: 15,
    lineHeight: 22,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    color: colors.navy,
    marginBottom: 9,
    fontSize: 15,
    fontWeight: "700",
  },
  required: {
    color: colors.error,
  },
  optional: {
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
    backgroundColor: colors.background,
    flexDirection: "row",
    alignItems: "center",
  },
  timeIcon: {
    width: 29,
    color: colors.blue,
    fontSize: 21,
  },
  selectionText: {
    flex: 1,
    color: colors.navy,
    fontSize: 15,
    fontWeight: "600",
  },
  placeholder: {
    color: colors.muted,
    fontWeight: "400",
  },
  input: {
    minHeight: 58,
    paddingHorizontal: 17,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 17,
    backgroundColor: colors.background,
    color: colors.navy,
    fontSize: 16,
  },
  description: {
    minHeight: 125,
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
  pickerBox: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    backgroundColor: colors.background,
  },
  doneButton: {
    alignSelf: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 11,
    backgroundColor: colors.blue,
  },
  doneText: {
    color: colors.white,
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
  },
  badge: {
    minWidth: 32,
    height: 32,
    marginLeft: 10,
    paddingHorizontal: 9,
    borderRadius: 16,
    backgroundColor: colors.paleBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: colors.blue,
    fontWeight: "800",
  },
  peopleBox: {
    minHeight: 142,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 21,
    backgroundColor: colors.background,
  },
  availableUsers: {
    paddingHorizontal: 15,
    paddingVertical: 16,
  },
  userOption: {
    width: 92,
    marginRight: 8,
    padding: 8,
    borderRadius: 16,
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: colors.paleBlue,
  },
  avatar: {
    padding: 3,
    borderWidth: 2.5,
    borderColor: colors.blue,
    backgroundColor: "#DDE8FA",
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    color: colors.blue,
    fontSize: 17,
    fontWeight: "800",
  },
  check: {
    position: "absolute",
    right: -4,
    bottom: -2,
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: 11,
    backgroundColor: colors.blue,
    alignItems: "center",
    justifyContent: "center",
  },
  checkText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "900",
  },
  optionFirstName: {
    width: "100%",
    color: colors.navy,
    marginTop: 7,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "700",
  },
  optionLastName: {
    width: "100%",
    color: colors.muted,
    textAlign: "center",
    fontSize: 12,
  },
  selectedUsers: {
    paddingHorizontal: 16,
  },
  selectedUserRow: {
    minHeight: 82,
    flexDirection: "row",
    alignItems: "center",
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  userInformation: {
    flex: 1,
    marginLeft: 13,
  },
  userName: {
    color: colors.navy,
    fontSize: 16,
    fontWeight: "700",
  },
  userStatus: {
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
  removeText: {
    color: colors.blue,
    marginTop: -2,
    fontSize: 23,
  },
  empty: {
    minHeight: 142,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: colors.muted,
    textAlign: "center",
    fontSize: 15,
    lineHeight: 22,
  },
  errorBox: {
    marginBottom: 13,
    paddingHorizontal: 15,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: colors.errorBorder,
    borderRadius: 14,
    backgroundColor: colors.errorBackground,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
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
    color: colors.white,
    fontSize: 17,
    fontWeight: "800",
  },
  pressed: {
    opacity: 0.65,
  },
});

export default CreateShiftView;
