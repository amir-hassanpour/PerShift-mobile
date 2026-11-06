import React from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Business } from "@/entity/Business";
import { BusinessRequested } from "@/entity/BusinessRequested";
import { LoadProfilePageViewModel } from "@/interface-adapter/profile/LoadProfilePageViewModel";
import { LoadProfilePageController } from "@/interface-adapter/profile/load-profile-page/LoadProfilePageController";

export type ProfileViewProps = {
  viewModel: LoadProfilePageViewModel;
  controller: LoadProfilePageController;
};

type ProfileViewState = {
  loading: boolean;
  errorMessage: string | null;
};

export class ProfileView extends React.Component<
  ProfileViewProps,
  ProfileViewState
> {
  private mounted = false;

  state: ProfileViewState = {
    loading: true,
    errorMessage: null,
  };

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

    void this.loadProfile();
  }

  componentDidUpdate(previousProps: ProfileViewProps): void {
    if (previousProps.viewModel !== this.props.viewModel) {
      this.unsubscribe?.();
      this.subscribeToViewModel();
    }
  }

  componentWillUnmount(): void {
    this.mounted = false;
    this.unsubscribe?.();
  }

  private loadProfile = async (): Promise<void> => {
    if (this.mounted) {
      this.setState({
        loading: true,
        errorMessage: null,
      });
    }

    try {
      await this.props.controller.loadProfilePage({});

      // The controller/interactor updates the supplied view model.
      // setState causes this component to read the updated values.
      if (this.mounted) {
        this.setState({ loading: false });
      }
    } catch (error) {
      if (!this.mounted) {
        return;
      }

      this.setState({
        loading: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : "The profile could not be loaded.",
      });
    }
  };

  private getInitials(firstName?: string, lastName?: string): string {
    const firstInitial = firstName?.trim().charAt(0) ?? "";
    const lastInitial = lastName?.trim().charAt(0) ?? "";

    return `${firstInitial}${lastInitial}`.toUpperCase() || "U";
  }

  private formatLastCheckedIn(date: Date): string {
    const parsedDate = date instanceof Date ? date : new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "No recent check-in";
    }

    return `Last check-in ${parsedDate.toLocaleDateString("en-CA", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  }

  private renderAvatar(): React.ReactNode {
    const { user } = this.props.viewModel;

    if (user?.avatarUrl) {
      return (
        <Image
          accessibilityLabel={`${user.firstName} ${user.lastName}'s profile image`}
          source={{ uri: user.avatarUrl }}
          style={ProfileView.styles.avatar}
        />
      );
    }

    return (
      <View style={ProfileView.styles.avatarFallback}>
        <Text style={ProfileView.styles.avatarInitials}>
          {this.getInitials(user?.firstName, user?.lastName)}
        </Text>
      </View>
    );
  }

  private renderBusinessCard(business: Business): React.ReactNode {
    return (
      <View key={business.id} style={ProfileView.styles.businessCard}>
        <View style={ProfileView.styles.businessIcon}>
          <Text style={ProfileView.styles.businessIconText}>
            {business.name.trim().charAt(0).toUpperCase() || "B"}
          </Text>
        </View>

        <Text numberOfLines={1} style={ProfileView.styles.businessName}>
          {business.name}
        </Text>

        <Text numberOfLines={2} style={ProfileView.styles.businessMetadata}>
          {this.formatLastCheckedIn(business.lastCheckedIn)}
        </Text>
      </View>
    );
  }

  private renderRequestedBusiness(request: BusinessRequested): React.ReactNode {
    return (
      <View key={request.id} style={ProfileView.styles.requestCard}>
        <View style={ProfileView.styles.requestInformation}>
          <View style={ProfileView.styles.requestIcon}>
            <Text style={ProfileView.styles.requestIconText}>
              {request.name.trim().charAt(0).toUpperCase() || "B"}
            </Text>
          </View>

          <View style={ProfileView.styles.requestTextContainer}>
            <Text numberOfLines={1} style={ProfileView.styles.requestName}>
              {request.name}
            </Text>

            <Text style={ProfileView.styles.requestSubtitle}>
              Requested you to join
            </Text>
          </View>
        </View>

        <View style={ProfileView.styles.requestActions}>
          <Pressable
            accessibilityLabel={`Accept ${request.name} request`}
            accessibilityRole="button"
            accessibilityState={{ disabled: true }}
            disabled
            style={[
              ProfileView.styles.requestButton,
              ProfileView.styles.acceptButton,
              ProfileView.styles.disabledButton,
            ]}
          >
            <Text style={ProfileView.styles.acceptButtonText}>✓</Text>
          </Pressable>

          <Pressable
            accessibilityLabel={`Reject ${request.name} request`}
            accessibilityRole="button"
            accessibilityState={{ disabled: true }}
            disabled
            style={[
              ProfileView.styles.requestButton,
              ProfileView.styles.rejectButton,
              ProfileView.styles.disabledButton,
            ]}
          >
            <Text style={ProfileView.styles.rejectButtonText}>×</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  private renderEmptyState(message: string): React.ReactNode {
    return (
      <View style={ProfileView.styles.emptyState}>
        <Text style={ProfileView.styles.emptyStateText}>{message}</Text>
      </View>
    );
  }

  render(): React.ReactNode {
    const { viewModel } = this.props;
    const { user, businesses, businessesRequested } = viewModel;
    const { loading, errorMessage } = this.state;

    return (
      <SafeAreaView style={ProfileView.styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <View style={ProfileView.styles.header}>
          <View style={ProfileView.styles.headerSpacer} />

          <Text style={ProfileView.styles.logo}>
            <Text style={ProfileView.styles.logoDark}>Per</Text>
            <Text style={ProfileView.styles.logoBlue}>Shift</Text>
          </Text>

          <Pressable
            accessibilityLabel="Open profile menu"
            accessibilityRole="button"
            hitSlop={12}
            style={ProfileView.styles.menuButton}
          >
            <View style={ProfileView.styles.menuLine} />
            <View style={ProfileView.styles.menuLine} />
            <View style={ProfileView.styles.menuLine} />
          </Pressable>
        </View>

        {loading ? (
          <View style={ProfileView.styles.centeredState}>
            <ActivityIndicator color="#246BE8" size="large" />
            <Text style={ProfileView.styles.loadingText}>
              Loading profile...
            </Text>
          </View>
        ) : errorMessage ? (
          <View style={ProfileView.styles.centeredState}>
            <Text style={ProfileView.styles.errorTitle}>
              Profile unavailable
            </Text>

            <Text style={ProfileView.styles.errorMessage}>{errorMessage}</Text>

            <Pressable
              accessibilityRole="button"
              onPress={this.loadProfile}
              style={ProfileView.styles.retryButton}
            >
              <Text style={ProfileView.styles.retryButtonText}>Try again</Text>
            </Pressable>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={ProfileView.styles.pageContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={ProfileView.styles.profileSection}>
              <View style={ProfileView.styles.avatarBorder}>
                {this.renderAvatar()}
              </View>

              <Text style={ProfileView.styles.username}>
                @{user?.username ?? "username"}
              </Text>

              <Text style={ProfileView.styles.fullName}>
                {user ? `${user.firstName} ${user.lastName}` : "Profile user"}
              </Text>

              <Pressable
                accessibilityRole="button"
                style={({ pressed }) => [
                  ProfileView.styles.editProfileButton,
                  pressed && ProfileView.styles.pressedButton,
                ]}
              >
                <Text style={ProfileView.styles.editProfileButtonText}>
                  Edit profile
                </Text>
              </Pressable>
            </View>

            <View style={ProfileView.styles.section}>
              <View style={ProfileView.styles.sectionHeader}>
                <Text style={ProfileView.styles.sectionTitle}>
                  Your businesses
                </Text>

                <View style={ProfileView.styles.countBadge}>
                  <Text style={ProfileView.styles.countBadgeText}>
                    {businesses.length}
                  </Text>
                </View>
              </View>

              {businesses.length > 0 ? (
                <ScrollView
                  horizontal
                  contentContainerStyle={ProfileView.styles.businessList}
                  showsHorizontalScrollIndicator={false}
                >
                  {businesses.map((business) =>
                    this.renderBusinessCard(business),
                  )}
                </ScrollView>
              ) : (
                this.renderEmptyState(
                  "You are not associated with any businesses yet.",
                )
              )}
            </View>

            <View style={ProfileView.styles.section}>
              <View style={ProfileView.styles.sectionHeader}>
                <Text style={ProfileView.styles.sectionTitle}>
                  Business requests
                </Text>

                <View style={ProfileView.styles.countBadge}>
                  <Text style={ProfileView.styles.countBadgeText}>
                    {businessesRequested.length}
                  </Text>
                </View>
              </View>

              {businessesRequested.length > 0 ? (
                <ScrollView
                  horizontal
                  contentContainerStyle={ProfileView.styles.requestList}
                  showsHorizontalScrollIndicator={false}
                >
                  {businessesRequested.map((request) =>
                    this.renderRequestedBusiness(request),
                  )}
                </ScrollView>
              ) : (
                this.renderEmptyState(
                  "You do not have any pending business requests.",
                )
              )}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    );
  }

  private static readonly styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: "#FFFFFF",
    },

    header: {
      height: 64,
      paddingHorizontal: 24,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: "#E9EEF7",
    },

    headerSpacer: {
      width: 34,
    },

    logo: {
      fontSize: 27,
      fontWeight: "800",
      letterSpacing: -1.2,
    },

    logoDark: {
      color: "#10284D",
    },

    logoBlue: {
      color: "#246BE8",
    },

    menuButton: {
      width: 34,
      height: 34,
      alignItems: "flex-end",
      justifyContent: "center",
    },

    menuLine: {
      width: 27,
      height: 3,
      marginVertical: 2.5,
      borderRadius: 2,
      backgroundColor: "#10284D",
    },

    pageContent: {
      paddingBottom: 48,
    },

    profileSection: {
      alignItems: "center",
      paddingHorizontal: 24,
      paddingTop: 32,
      paddingBottom: 30,
    },

    avatarBorder: {
      width: 130,
      height: 130,
      padding: 4,
      borderWidth: 3,
      borderColor: "#246BE8",
      borderRadius: 65,
      backgroundColor: "#FFFFFF",
      shadowColor: "#246BE8",
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.16,
      shadowRadius: 12,
      elevation: 5,
    },

    avatar: {
      width: "100%",
      height: "100%",
      borderRadius: 61,
      backgroundColor: "#E8F0FE",
    },

    avatarFallback: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 61,
      backgroundColor: "#E8F0FE",
    },

    avatarInitials: {
      color: "#246BE8",
      fontSize: 40,
      fontWeight: "800",
    },

    username: {
      marginTop: 16,
      color: "#10284D",
      fontSize: 21,
      fontWeight: "800",
    },

    fullName: {
      marginTop: 5,
      color: "#73819C",
      fontSize: 16,
      fontWeight: "500",
    },

    editProfileButton: {
      width: "100%",
      minHeight: 48,
      marginTop: 22,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 14,
      backgroundColor: "#F1F5FB",
      borderWidth: 1,
      borderColor: "#E2E9F5",
    },

    editProfileButtonText: {
      color: "#10284D",
      fontSize: 16,
      fontWeight: "700",
    },

    pressedButton: {
      opacity: 0.7,
    },

    section: {
      marginBottom: 30,
    },

    sectionHeader: {
      marginBottom: 14,
      paddingHorizontal: 24,
      flexDirection: "row",
      alignItems: "center",
    },

    sectionTitle: {
      color: "#10284D",
      fontSize: 20,
      fontWeight: "800",
    },

    countBadge: {
      minWidth: 25,
      height: 25,
      marginLeft: 9,
      paddingHorizontal: 7,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 13,
      backgroundColor: "#E8F0FE",
    },

    countBadgeText: {
      color: "#246BE8",
      fontSize: 13,
      fontWeight: "800",
    },

    businessList: {
      paddingHorizontal: 24,
      paddingBottom: 8,
    },

    businessCard: {
      width: 166,
      minHeight: 174,
      marginRight: 13,
      padding: 17,
      borderRadius: 22,
      backgroundColor: "#F5F8FE",
      borderWidth: 1,
      borderColor: "#E6ECF7",
    },

    businessIcon: {
      width: 50,
      height: 50,
      marginBottom: 16,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 25,
      backgroundColor: "#E3EDFE",
    },

    businessIconText: {
      color: "#246BE8",
      fontSize: 21,
      fontWeight: "800",
    },

    businessName: {
      color: "#10284D",
      fontSize: 17,
      fontWeight: "800",
    },

    businessMetadata: {
      marginTop: 7,
      color: "#7C89A2",
      fontSize: 13,
      lineHeight: 18,
    },

    requestList: {
      paddingHorizontal: 24,
      paddingBottom: 8,
    },

    requestCard: {
      width: 290,
      minHeight: 130,
      marginRight: 13,
      padding: 16,
      justifyContent: "space-between",
      borderRadius: 22,
      backgroundColor: "#F5F8FE",
      borderWidth: 1,
      borderColor: "#E6ECF7",
    },

    requestInformation: {
      flexDirection: "row",
      alignItems: "center",
    },

    requestIcon: {
      width: 48,
      height: 48,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 24,
      backgroundColor: "#E3EDFE",
    },

    requestIconText: {
      color: "#246BE8",
      fontSize: 20,
      fontWeight: "800",
    },

    requestTextContainer: {
      flex: 1,
      marginLeft: 12,
    },

    requestName: {
      color: "#10284D",
      fontSize: 16,
      fontWeight: "800",
    },

    requestSubtitle: {
      marginTop: 3,
      color: "#7C89A2",
      fontSize: 13,
    },

    requestActions: {
      marginTop: 15,
      flexDirection: "row",
      justifyContent: "flex-end",
    },

    requestButton: {
      width: 38,
      height: 34,
      marginLeft: 9,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 11,
      borderWidth: 1,
    },

    acceptButton: {
      backgroundColor: "#246BE8",
      borderColor: "#246BE8",
    },

    acceptButtonText: {
      color: "#FFFFFF",
      fontSize: 19,
      fontWeight: "800",
    },

    rejectButton: {
      backgroundColor: "#FFFFFF",
      borderColor: "#DCE4F1",
    },

    rejectButtonText: {
      color: "#10284D",
      fontSize: 23,
      fontWeight: "500",
      lineHeight: 24,
    },

    disabledButton: {
      opacity: 0.45,
    },

    emptyState: {
      marginHorizontal: 24,
      minHeight: 88,
      paddingHorizontal: 20,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 18,
      backgroundColor: "#F5F8FE",
      borderWidth: 1,
      borderColor: "#E6ECF7",
    },

    emptyStateText: {
      color: "#7C89A2",
      fontSize: 14,
      lineHeight: 20,
      textAlign: "center",
    },

    centeredState: {
      flex: 1,
      padding: 32,
      alignItems: "center",
      justifyContent: "center",
    },

    loadingText: {
      marginTop: 14,
      color: "#73819C",
      fontSize: 15,
    },

    errorTitle: {
      color: "#10284D",
      fontSize: 20,
      fontWeight: "800",
    },

    errorMessage: {
      marginTop: 8,
      color: "#73819C",
      fontSize: 14,
      lineHeight: 20,
      textAlign: "center",
    },

    retryButton: {
      marginTop: 20,
      paddingHorizontal: 26,
      paddingVertical: 13,
      borderRadius: 13,
      backgroundColor: "#246BE8",
    },

    retryButtonText: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "700",
    },
  });
}
