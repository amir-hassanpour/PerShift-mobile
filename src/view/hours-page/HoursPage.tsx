import React from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { User } from "@/entity/User";
import { CheckHoursController } from "@/interface-adapter/hours/check-hours/CheckHoursController";
import { CheckHoursViewModel } from "@/interface-adapter/hours/check-hours/CheckHoursViewModel";
import { LoadHoursPageController } from "@/interface-adapter/hours/load-hours-page/LoadHoursPageController";
import { LoadHoursPageViewModel } from "@/interface-adapter/hours/load-hours-page/LoadHoursPgaeViewModel";

const COLORS = {
  background: "#FFFFFF",
  navy: "#0B2B54",
  blue: "#2874EA",
  paleBlue: "#EAF2FF",
  softBlue: "#F4F7FD",
  border: "#DCE7F8",
  secondaryText: "#7C8DA8",
  disabledBackground: "#D8E1EE",
  disabledText: "#93A1B5",
  white: "#FFFFFF",
  error: "#B42318",
  errorBackground: "#FEF3F2",
  success: "#027A48",
  successBackground: "#ECFDF3",
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export type HoursPageProps = {
  loadHoursPageController: LoadHoursPageController;
  loadHoursPageViewModel: LoadHoursPageViewModel;
  checkHoursController: CheckHoursController;
  checkHoursViewModel: CheckHoursViewModel;
};

type HoursPageState = {
  selectedUserId: string | null;
  fromDate: Date | null;
  toDate: Date | null;
  displayedMonth: Date;
  isCalendarOpen: boolean;
  isChecking: boolean;
  hasChecked: boolean;
  loadError: string | null;
  checkError: string | null;
};

export class HoursPage extends React.Component<HoursPageProps, HoursPageState> {
  private unsubscribeFromLoadHours?: () => void;
  private unsubscribeFromCheckHours?: () => void;
  private isMountedFlag = false;

  state: HoursPageState = {
    selectedUserId: null,
    fromDate: null,
    toDate: null,
    displayedMonth: this.startOfMonth(new Date()),
    isCalendarOpen: false,
    isChecking: false,
    hasChecked: false,
    loadError: null,
    checkError: null,
  };

  componentDidMount(): void {
    this.isMountedFlag = true;

    this.subscribeToLoadHoursViewModel(this.props.loadHoursPageViewModel);

    this.subscribeToCheckHoursViewModel(this.props.checkHoursViewModel);

    void this.loadHoursPage();
  }

  componentDidUpdate(previousProps: HoursPageProps): void {
    if (
      previousProps.loadHoursPageViewModel !== this.props.loadHoursPageViewModel
    ) {
      this.unsubscribeFromLoadHours?.();

      this.subscribeToLoadHoursViewModel(this.props.loadHoursPageViewModel);

      this.removeMissingUserSelection();
    }

    if (previousProps.checkHoursViewModel !== this.props.checkHoursViewModel) {
      this.unsubscribeFromCheckHours?.();

      this.subscribeToCheckHoursViewModel(this.props.checkHoursViewModel);
    }

    if (
      previousProps.loadHoursPageController !==
      this.props.loadHoursPageController
    ) {
      void this.loadHoursPage();
    }
  }

  componentWillUnmount(): void {
    this.isMountedFlag = false;
    this.unsubscribeFromLoadHours?.();
    this.unsubscribeFromCheckHours?.();
  }

  private subscribeToLoadHoursViewModel(
    viewModel: LoadHoursPageViewModel,
  ): void {
    this.unsubscribeFromLoadHours = viewModel.subscribe(
      this.handleLoadHoursViewModelChange,
    );
  }

  private subscribeToCheckHoursViewModel(viewModel: CheckHoursViewModel): void {
    this.unsubscribeFromCheckHours = viewModel.subscribe(
      this.handleCheckHoursViewModelChange,
    );
  }

  private handleLoadHoursViewModelChange = (): void => {
    if (!this.isMountedFlag) {
      return;
    }

    const { selectedUserId } = this.state;

    if (selectedUserId) {
      const userStillExists = this.props.loadHoursPageViewModel.users.some(
        (user) => user.id === selectedUserId,
      );

      if (!userStillExists) {
        this.setState({
          selectedUserId: null,
          hasChecked: false,
          checkError: null,
        });

        return;
      }
    }

    this.forceUpdate();
  };

  private handleCheckHoursViewModelChange = (): void => {
    if (!this.isMountedFlag) {
      return;
    }

    // Read the newest totalHours and totalMinutes values after
    // CheckHoursViewModel.firePropertyChange() is called.
    this.forceUpdate();
  };

  private removeMissingUserSelection(): void {
    const { selectedUserId } = this.state;

    if (!selectedUserId) {
      return;
    }

    const userStillExists = this.props.loadHoursPageViewModel.users.some(
      (user) => user.id === selectedUserId,
    );

    if (!userStillExists && this.isMountedFlag) {
      this.setState({
        selectedUserId: null,
        hasChecked: false,
        checkError: null,
      });
    }
  }

  private async loadHoursPage(): Promise<void> {
    if (this.isMountedFlag) {
      this.setState({ loadError: null });
    }

    try {
      await this.props.loadHoursPageController.loadHoursPage({});
    } catch (error) {
      if (!this.isMountedFlag) {
        return;
      }

      this.setState({
        loadError:
          error instanceof Error
            ? error.message
            : "The users could not be loaded.",
      });
    }
  }

  private async checkHours(): Promise<void> {
    const { selectedUserId, fromDate, toDate } = this.state;

    if (!selectedUserId || !fromDate || !toDate || this.state.isChecking) {
      return;
    }

    const selectedUser = this.props.loadHoursPageViewModel.users.find(
      (user) => user.id === selectedUserId,
    );

    if (!selectedUser) {
      this.setState({
        checkError: "The selected user is no longer available.",
        hasChecked: false,
      });

      return;
    }

    this.setState({
      isChecking: true,
      hasChecked: false,
      checkError: null,
    });

    try {
      await this.props.checkHoursController.checkHours({
        startDate: fromDate,
        endDate: toDate,
        user: [selectedUser],
      });

      if (!this.isMountedFlag) {
        return;
      }

      this.setState({
        hasChecked: true,
      });
    } catch (error) {
      if (!this.isMountedFlag) {
        return;
      }

      this.setState({
        hasChecked: false,
        checkError:
          error instanceof Error
            ? error.message
            : "The total hours could not be checked.",
      });
    } finally {
      if (this.isMountedFlag) {
        this.setState({
          isChecking: false,
        });
      }
    }
  }

  private getFullName(user: User): string {
    return `${user.firstName} ${user.lastName}`;
  }

  private getInitials(user: User): string {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }

  private selectUser = (user: User): void => {
    this.setState(({ selectedUserId }) => ({
      selectedUserId: selectedUserId === user.id ? null : user.id,
      hasChecked: false,
      checkError: null,
    }));
  };

  private openCalendar = (): void => {
    const initialDate = this.state.fromDate ?? new Date();

    this.setState({
      displayedMonth: this.startOfMonth(initialDate),
      isCalendarOpen: true,
    });
  };

  private closeCalendar = (): void => {
    this.setState({
      isCalendarOpen: false,
    });
  };

  private showPreviousMonth = (): void => {
    this.setState(({ displayedMonth }) => ({
      displayedMonth: new Date(
        displayedMonth.getFullYear(),
        displayedMonth.getMonth() - 1,
        1,
      ),
    }));
  };

  private showNextMonth = (): void => {
    this.setState(({ displayedMonth }) => ({
      displayedMonth: new Date(
        displayedMonth.getFullYear(),
        displayedMonth.getMonth() + 1,
        1,
      ),
    }));
  };

  private selectDate = (date: Date): void => {
    const selectedDate = this.startOfDay(date);

    this.setState(
      ({
        fromDate,
        toDate,
      }): Pick<
        HoursPageState,
        "fromDate" | "toDate" | "hasChecked" | "checkError"
      > => {
        if (!fromDate || toDate) {
          return {
            fromDate: selectedDate,
            toDate: null,
            hasChecked: false,
            checkError: null,
          };
        }

        if (selectedDate.getTime() < fromDate.getTime()) {
          return {
            fromDate: selectedDate,
            toDate: fromDate,
            hasChecked: false,
            checkError: null,
          };
        }

        return {
          fromDate,
          toDate: selectedDate,
          hasChecked: false,
          checkError: null,
        };
      },
    );
  };

  private clearDates = (): void => {
    this.setState({
      fromDate: null,
      toDate: null,
      displayedMonth: this.startOfMonth(new Date()),
      hasChecked: false,
      checkError: null,
    });
  };

  private startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private startOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  private isSameDay(firstDate: Date | null, secondDate: Date): boolean {
    if (!firstDate) {
      return false;
    }

    return (
      firstDate.getFullYear() === secondDate.getFullYear() &&
      firstDate.getMonth() === secondDate.getMonth() &&
      firstDate.getDate() === secondDate.getDate()
    );
  }

  private isInsideSelectedRange(date: Date): boolean {
    const { fromDate, toDate } = this.state;

    if (!fromDate || !toDate) {
      return false;
    }

    const dateTime = this.startOfDay(date).getTime();

    return dateTime > fromDate.getTime() && dateTime < toDate.getTime();
  }

  private getCalendarDays(): Array<Date | null> {
    const { displayedMonth } = this.state;

    const year = displayedMonth.getFullYear();
    const month = displayedMonth.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: Array<Date | null> = [];

    for (let index = 0; index < firstWeekday; index += 1) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      days.push(new Date(year, month, day));
    }

    while (days.length % 7 !== 0) {
      days.push(null);
    }

    return days;
  }

  private formatDate(date: Date | null): string {
    if (!date) {
      return "Select date";
    }

    return `${
      SHORT_MONTHS[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`;
  }

  private renderAvatar(
    user: User,
    selected: boolean,
    small = false,
  ): React.ReactNode {
    const avatarSizeStyle = small ? styles.smallAvatar : styles.avatar;

    if (user.avatarUrl) {
      return (
        <View
          style={[
            avatarSizeStyle,
            styles.avatarImageContainer,
            selected && styles.selectedAvatarBorder,
          ]}
        >
          <Image
            accessibilityLabel={`${this.getFullName(user)} avatar`}
            source={{ uri: user.avatarUrl }}
            style={styles.avatarImage}
          />
        </View>
      );
    }

    return (
      <View
        style={[
          avatarSizeStyle,
          styles.avatarFallback,
          selected && styles.selectedAvatarFallback,
        ]}
      >
        <Text
          style={[
            small ? styles.smallAvatarInitials : styles.avatarInitials,
            selected && styles.selectedAvatarInitials,
          ]}
        >
          {this.getInitials(user)}
        </Text>
      </View>
    );
  }

  private renderUser(user: User): React.ReactNode {
    const selected = this.state.selectedUserId === user.id;

    return (
      <Pressable
        key={user.id}
        accessibilityRole="button"
        accessibilityLabel={`Select ${this.getFullName(user)}`}
        accessibilityState={{ selected }}
        onPress={() => this.selectUser(user)}
        style={({ pressed }) => [
          styles.userCard,
          selected && styles.selectedUserCard,
          pressed && styles.pressed,
        ]}
      >
        {this.renderAvatar(user, selected)}

        <View style={styles.userInformation}>
          <Text numberOfLines={1} style={styles.userName}>
            {this.getFullName(user)}
          </Text>

          <Text numberOfLines={1} style={styles.username}>
            @{user.username}
          </Text>

          <Text numberOfLines={1} style={styles.userEmail}>
            {user.email}
          </Text>
        </View>

        <View
          style={[styles.selectionCircle, selected && styles.selectedCircle]}
        >
          {selected ? <Text style={styles.checkmark}>✓</Text> : null}
        </View>
      </Pressable>
    );
  }

  private renderCalendar(): React.ReactNode {
    const { displayedMonth, fromDate, toDate, isCalendarOpen } = this.state;

    const calendarDays = this.getCalendarDays();
    const canFinish = Boolean(fromDate && toDate);

    return (
      <Modal
        animationType="slide"
        transparent
        visible={isCalendarOpen}
        onRequestClose={this.closeCalendar}
      >
        <View style={styles.modalBackdrop}>
          <SafeAreaView style={styles.calendarSheet}>
            <View style={styles.calendarHeader}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close calendar"
                hitSlop={12}
                onPress={this.closeCalendar}
                style={styles.calendarHeaderButton}
              >
                <Text style={styles.closeIcon}>×</Text>
              </Pressable>

              <Text style={styles.calendarHeading}>Select date range</Text>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Finish selecting dates"
                accessibilityState={{
                  disabled: !canFinish,
                }}
                disabled={!canFinish}
                hitSlop={12}
                onPress={this.closeCalendar}
                style={styles.calendarHeaderButton}
              >
                <Text
                  style={[
                    styles.doneText,
                    !canFinish && styles.disabledDoneText,
                  ]}
                >
                  Done
                </Text>
              </Pressable>
            </View>

            <View style={styles.selectedDatesCard}>
              <View style={styles.selectedDateColumn}>
                <Text style={styles.dateLabel}>FROM</Text>

                <Text style={styles.selectedDateText}>
                  {this.formatDate(fromDate)}
                </Text>
              </View>

              <Text style={styles.selectedDatesArrow}>→</Text>

              <View style={styles.selectedDateColumn}>
                <Text style={styles.dateLabel}>TO</Text>

                <Text style={styles.selectedDateText}>
                  {this.formatDate(toDate)}
                </Text>
              </View>
            </View>

            <View style={styles.monthHeader}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Previous month"
                hitSlop={12}
                onPress={this.showPreviousMonth}
                style={styles.monthButton}
              >
                <Text style={styles.monthButtonText}>‹</Text>
              </Pressable>

              <Text style={styles.monthTitle}>
                {MONTHS[displayedMonth.getMonth()]}{" "}
                {displayedMonth.getFullYear()}
              </Text>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Next month"
                hitSlop={12}
                onPress={this.showNextMonth}
                style={styles.monthButton}
              >
                <Text style={styles.monthButtonText}>›</Text>
              </Pressable>
            </View>

            <View style={styles.weekdayRow}>
              {WEEKDAYS.map((weekday, index) => (
                <View key={`${weekday}-${index}`} style={styles.weekdayCell}>
                  <Text style={styles.weekdayText}>{weekday}</Text>
                </View>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {calendarDays.map((date, index) => {
                if (!date) {
                  return <View key={`empty-${index}`} style={styles.dayCell} />;
                }

                const isStart = this.isSameDay(fromDate, date);

                const isEnd = this.isSameDay(toDate, date);

                const isInsideRange = this.isInsideSelectedRange(date);

                const isSelected = isStart || isEnd;

                return (
                  <View
                    key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}
                    style={[
                      styles.dayCell,
                      isInsideRange && styles.dayRangeBackground,
                      isStart && toDate && styles.dayRangeStart,
                      isEnd && styles.dayRangeEnd,
                    ]}
                  >
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={this.formatDate(date)}
                      accessibilityState={{
                        selected: isSelected || isInsideRange,
                      }}
                      onPress={() => this.selectDate(date)}
                      style={[
                        styles.dayButton,
                        isSelected && styles.selectedDayButton,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          (isSelected || isInsideRange) &&
                            styles.selectedDayText,
                        ]}
                      >
                        {date.getDate()}
                      </Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>

            <View style={styles.calendarFooter}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Clear selected dates"
                onPress={this.clearDates}
                style={styles.clearDatesButton}
              >
                <Text style={styles.clearDatesText}>Clear dates</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    );
  }

  render(): React.ReactNode {
    const { users } = this.props.loadHoursPageViewModel;

    const { totalHours, totalMinutes } = this.props.checkHoursViewModel;

    const {
      selectedUserId,
      fromDate,
      toDate,
      loadError,
      checkError,
      isChecking,
      hasChecked,
    } = this.state;

    const selectedUser =
      users.find((user) => user.id === selectedUserId) ?? null;

    const canCheckHours = Boolean(
      selectedUser && fromDate && toDate && !isChecking,
    );

    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.brandHeader}>
          <View style={styles.brandIcon}>
            <Text style={styles.brandIconText}>P</Text>
          </View>

          <Text style={styles.brandName}>
            Per
            <Text style={styles.brandNameAccent}>Shift</Text>
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.pageTitle}>Hours</Text>

          <Text style={styles.pageDescription}>
            Select a user and the dates you want to review.
          </Text>

          <View style={styles.sectionHeadingRow}>
            <Text style={styles.sectionHeading}>Select a user</Text>

            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{users.length}</Text>
            </View>
          </View>

          {loadError ? (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>{loadError}</Text>

              <Pressable
                accessibilityRole="button"
                onPress={() => void this.loadHoursPage()}
              >
                <Text style={styles.retryText}>Try again</Text>
              </Pressable>
            </View>
          ) : null}

          {users.length > 0 ? (
            <View style={styles.usersList}>
              {users.map((user) => this.renderUser(user))}
            </View>
          ) : (
            <View style={styles.emptyUsersCard}>
              <Text style={styles.emptyUsersTitle}>No users available</Text>

              <Text style={styles.emptyUsersText}>
                Users will appear here once they have been loaded.
              </Text>
            </View>
          )}

          <Text style={styles.dateSectionHeading}>Date range</Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Choose date range"
            onPress={this.openCalendar}
            style={({ pressed }) => [
              styles.dateRangeCard,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.dateColumn}>
              <Text style={styles.dateLabel}>FROM</Text>

              <Text
                style={[styles.dateValue, !fromDate && styles.datePlaceholder]}
              >
                {this.formatDate(fromDate)}
              </Text>
            </View>

            <Text style={styles.dateRangeArrow}>→</Text>

            <View style={styles.dateColumn}>
              <Text style={styles.dateLabel}>TO</Text>

              <Text
                style={[styles.dateValue, !toDate && styles.datePlaceholder]}
              >
                {this.formatDate(toDate)}
              </Text>
            </View>

            <View style={styles.calendarIcon}>
              <Text style={styles.calendarIconText}>▦</Text>
            </View>
          </Pressable>

          {selectedUser ? (
            <View style={styles.selectionSummary}>
              {this.renderAvatar(selectedUser, false, true)}

              <View style={styles.selectionSummaryText}>
                <Text style={styles.selectionSummaryLabel}>HOURS FOR</Text>

                <Text style={styles.selectionSummaryName}>
                  {this.getFullName(selectedUser)}
                </Text>

                <Text style={styles.selectionSummaryUsername}>
                  @{selectedUser.username}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.helperText}>
              Select a user above to continue.
            </Text>
          )}

          {checkError ? (
            <View style={styles.checkErrorCard}>
              <Text style={styles.errorText}>{checkError}</Text>
            </View>
          ) : null}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Check hours"
            accessibilityState={{
              disabled: !canCheckHours,
            }}
            disabled={!canCheckHours}
            onPress={() => void this.checkHours()}
            style={({ pressed }) => [
              styles.checkButton,
              !canCheckHours && styles.disabledCheckButton,
              pressed && canCheckHours && styles.pressedCheckButton,
            ]}
          >
            <Text
              style={[
                styles.checkButtonText,
                !canCheckHours && styles.disabledCheckButtonText,
              ]}
            >
              {isChecking ? "Checking..." : "Check hours"}
            </Text>
          </Pressable>

          {hasChecked && !checkError ? (
            <View style={styles.totalTimeCard}>
              <Text style={styles.totalTimeEyebrow}>TOTAL TIME</Text>

              <Text style={styles.totalTimeTitle}>
                {selectedUser
                  ? this.getFullName(selectedUser)
                  : "Selected user"}
              </Text>

              <Text style={styles.totalTimeDateRange}>
                {this.formatDate(fromDate)} – {this.formatDate(toDate)}
              </Text>

              <View style={styles.timeValuesRow}>
                <View style={styles.timeValueColumn}>
                  <Text style={styles.timeValue}>{totalHours}</Text>

                  <Text style={styles.timeUnit}>
                    {totalHours === 1 ? "hour" : "hours"}
                  </Text>
                </View>

                <View style={styles.timeDivider} />

                <View style={styles.timeValueColumn}>
                  <Text style={styles.timeValue}>{totalMinutes}</Text>

                  <Text style={styles.timeUnit}>
                    {totalMinutes === 1 ? "minute" : "minutes"}
                  </Text>
                </View>
              </View>
            </View>
          ) : null}
        </ScrollView>

        {this.renderCalendar()}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  brandHeader: {
    height: 76,
    paddingHorizontal: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.blue,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.navy,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 5,
  },
  brandIconText: {
    color: COLORS.white,
    fontSize: 21,
    fontWeight: "800",
  },
  brandName: {
    color: COLORS.navy,
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.7,
  },
  brandNameAccent: {
    color: COLORS.blue,
  },
  headerSpacer: {
    width: 42,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 48,
  },
  pageTitle: {
    color: COLORS.navy,
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -1,
  },
  pageDescription: {
    marginTop: 8,
    color: COLORS.secondaryText,
    fontSize: 16,
    lineHeight: 23,
  },
  sectionHeadingRow: {
    marginTop: 32,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  sectionHeading: {
    color: COLORS.navy,
    fontSize: 22,
    fontWeight: "800",
  },
  countBadge: {
    minWidth: 34,
    height: 34,
    marginLeft: 10,
    paddingHorizontal: 10,
    borderRadius: 17,
    backgroundColor: COLORS.paleBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  countBadgeText: {
    color: COLORS.blue,
    fontSize: 16,
    fontWeight: "800",
  },
  usersList: {
    width: "100%",
  },
  userCard: {
    minHeight: 92,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    backgroundColor: COLORS.softBlue,
    flexDirection: "row",
    alignItems: "center",
  },
  selectedUserCard: {
    borderWidth: 2,
    borderColor: COLORS.blue,
    backgroundColor: COLORS.paleBlue,
  },
  pressed: {
    opacity: 0.76,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  smallAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  avatarImageContainer: {
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.paleBlue,
    overflow: "hidden",
  },
  selectedAvatarBorder: {
    borderColor: COLORS.blue,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarFallback: {
    backgroundColor: COLORS.paleBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedAvatarFallback: {
    backgroundColor: COLORS.blue,
  },
  avatarInitials: {
    color: COLORS.blue,
    fontSize: 19,
    fontWeight: "800",
  },
  smallAvatarInitials: {
    color: COLORS.blue,
    fontSize: 15,
    fontWeight: "800",
  },
  selectedAvatarInitials: {
    color: COLORS.white,
  },
  userInformation: {
    flex: 1,
    marginLeft: 14,
    marginRight: 12,
  },
  userName: {
    color: COLORS.navy,
    fontSize: 17,
    fontWeight: "700",
  },
  username: {
    marginTop: 3,
    color: COLORS.blue,
    fontSize: 14,
    fontWeight: "600",
  },
  userEmail: {
    marginTop: 3,
    color: COLORS.secondaryText,
    fontSize: 12,
  },
  selectionCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: "#B7C5D9",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedCircle: {
    borderColor: COLORS.blue,
    backgroundColor: COLORS.blue,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "900",
  },
  emptyUsersCard: {
    minHeight: 142,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    backgroundColor: COLORS.softBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyUsersTitle: {
    color: COLORS.navy,
    fontSize: 17,
    fontWeight: "700",
  },
  emptyUsersText: {
    marginTop: 7,
    color: COLORS.secondaryText,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  errorCard: {
    marginBottom: 14,
    padding: 14,
    borderRadius: 14,
    backgroundColor: COLORS.errorBackground,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  checkErrorCard: {
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    backgroundColor: COLORS.errorBackground,
  },
  errorText: {
    flex: 1,
    color: COLORS.error,
    fontSize: 13,
    lineHeight: 19,
  },
  retryText: {
    marginLeft: 12,
    color: COLORS.error,
    fontSize: 13,
    fontWeight: "800",
  },
  dateSectionHeading: {
    marginTop: 30,
    marginBottom: 14,
    color: COLORS.navy,
    fontSize: 22,
    fontWeight: "800",
  },
  dateRangeCard: {
    minHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    backgroundColor: COLORS.softBlue,
    flexDirection: "row",
    alignItems: "center",
  },
  dateColumn: {
    flex: 1,
  },
  dateLabel: {
    color: COLORS.secondaryText,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  dateValue: {
    marginTop: 7,
    color: COLORS.navy,
    fontSize: 15,
    fontWeight: "700",
  },
  datePlaceholder: {
    color: COLORS.secondaryText,
    fontWeight: "500",
  },
  dateRangeArrow: {
    marginHorizontal: 8,
    color: COLORS.blue,
    fontSize: 20,
    fontWeight: "700",
  },
  calendarIcon: {
    width: 40,
    height: 40,
    marginLeft: 10,
    borderRadius: 13,
    backgroundColor: COLORS.paleBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  calendarIconText: {
    color: COLORS.blue,
    fontSize: 23,
    fontWeight: "700",
  },
  selectionSummary: {
    marginTop: 20,
    padding: 15,
    borderRadius: 18,
    backgroundColor: COLORS.paleBlue,
    flexDirection: "row",
    alignItems: "center",
  },
  selectionSummaryText: {
    flex: 1,
    marginLeft: 12,
  },
  selectionSummaryLabel: {
    color: COLORS.secondaryText,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  selectionSummaryName: {
    marginTop: 3,
    color: COLORS.navy,
    fontSize: 16,
    fontWeight: "700",
  },
  selectionSummaryUsername: {
    marginTop: 2,
    color: COLORS.blue,
    fontSize: 13,
    fontWeight: "600",
  },
  helperText: {
    marginTop: 16,
    color: COLORS.secondaryText,
    fontSize: 14,
    textAlign: "center",
  },
  checkButton: {
    height: 58,
    marginTop: 24,
    borderRadius: 18,
    backgroundColor: COLORS.blue,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.blue,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 4,
  },
  pressedCheckButton: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },
  checkButtonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "800",
  },
  disabledCheckButton: {
    backgroundColor: COLORS.disabledBackground,
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledCheckButtonText: {
    color: COLORS.disabledText,
  },
  totalTimeCard: {
    marginTop: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: "#ABEFC6",
    borderRadius: 24,
    backgroundColor: COLORS.successBackground,
  },
  totalTimeEyebrow: {
    color: COLORS.success,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  totalTimeTitle: {
    marginTop: 6,
    color: COLORS.navy,
    fontSize: 20,
    fontWeight: "800",
  },
  totalTimeDateRange: {
    marginTop: 4,
    color: COLORS.secondaryText,
    fontSize: 13,
  },
  timeValuesRow: {
    marginTop: 22,
    flexDirection: "row",
    alignItems: "center",
  },
  timeValueColumn: {
    flex: 1,
    alignItems: "center",
  },
  timeValue: {
    color: COLORS.success,
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: -1,
  },
  timeUnit: {
    marginTop: 3,
    color: COLORS.secondaryText,
    fontSize: 13,
    fontWeight: "600",
  },
  timeDivider: {
    width: 1,
    height: 52,
    backgroundColor: "#ABEFC6",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(11, 43, 84, 0.28)",
    justifyContent: "flex-end",
  },
  calendarSheet: {
    maxHeight: "92%",
    paddingBottom: 16,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: COLORS.background,
    overflow: "hidden",
  },
  calendarHeader: {
    height: 74,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  calendarHeaderButton: {
    minWidth: 54,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  closeIcon: {
    color: COLORS.navy,
    fontSize: 38,
    fontWeight: "300",
    lineHeight: 40,
  },
  calendarHeading: {
    color: COLORS.navy,
    fontSize: 19,
    fontWeight: "800",
  },
  doneText: {
    color: COLORS.blue,
    fontSize: 16,
    fontWeight: "800",
  },
  disabledDoneText: {
    color: COLORS.disabledText,
  },
  selectedDatesCard: {
    marginHorizontal: 22,
    marginTop: 20,
    padding: 15,
    borderRadius: 18,
    backgroundColor: COLORS.softBlue,
    flexDirection: "row",
    alignItems: "center",
  },
  selectedDateColumn: {
    flex: 1,
  },
  selectedDateText: {
    marginTop: 5,
    color: COLORS.navy,
    fontSize: 14,
    fontWeight: "700",
  },
  selectedDatesArrow: {
    marginHorizontal: 8,
    color: COLORS.blue,
    fontSize: 19,
  },
  monthHeader: {
    height: 76,
    marginHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  monthButton: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: COLORS.paleBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  monthButtonText: {
    color: COLORS.navy,
    fontSize: 34,
    fontWeight: "400",
    lineHeight: 36,
  },
  monthTitle: {
    color: COLORS.navy,
    fontSize: 19,
    fontWeight: "800",
  },
  weekdayRow: {
    marginHorizontal: 16,
    flexDirection: "row",
  },
  weekdayCell: {
    width: "14.285714%",
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  weekdayText: {
    color: COLORS.secondaryText,
    fontSize: 13,
    fontWeight: "800",
  },
  calendarGrid: {
    marginHorizontal: 16,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.285714%",
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  dayButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedDayButton: {
    backgroundColor: COLORS.blue,
  },
  dayText: {
    color: COLORS.navy,
    fontSize: 15,
    fontWeight: "700",
  },
  selectedDayText: {
    color: COLORS.white,
  },
  dayRangeBackground: {
    backgroundColor: COLORS.blue,
  },
  dayRangeStart: {
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
  },
  dayRangeEnd: {
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
  },
  calendarFooter: {
    marginTop: 18,
    paddingHorizontal: 22,
    alignItems: "center",
  },
  clearDatesButton: {
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  clearDatesText: {
    color: COLORS.blue,
    fontSize: 15,
    fontWeight: "700",
  },
});
