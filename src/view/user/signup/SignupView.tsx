import { UserSignupController } from "@/interface-adapter/user/signup/UserSignupController";
import { UserSignupState } from "@/interface-adapter/user/signup/UserSignupState";
import { UserSignupViewModel } from "@/interface-adapter/user/signup/UserSignupViewModel";
import { Component } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type SignupViewProps = {
  userSignupController: UserSignupController;
  userSignupViewModel: UserSignupViewModel;
};

type SignupViewState = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
};

type SignupInput = "firstName" | "lastName" | "email" | "username" | "password";

const errorsByInput: Record<SignupInput, UserSignupState[]> = {
  firstName: [UserSignupState.FIRST_NAME_REQUIRED],
  lastName: [UserSignupState.LAST_NAME_REQUIRED],
  email: [
    UserSignupState.EMAIL_REQUIRED,
    UserSignupState.INVALID_EMAIL,
    UserSignupState.EMAIL_ALREADY_EXISTS,
  ],
  username: [
    UserSignupState.USERNAME_REQUIRED,
    UserSignupState.USERNAME_TOO_SHORT,
    UserSignupState.USERNAME_ALREADY_EXISTS,
  ],
  password: [UserSignupState.PASSWORD_REQUIRED, UserSignupState.WEAK_PASSWORD],
};

export class SignupView extends Component<SignupViewProps, SignupViewState> {
  state: SignupViewState = {
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
  };

  getInputError(input: SignupInput): UserSignupState | undefined {
    const currentState = this.props.userSignupViewModel.state;

    return errorsByInput[input].includes(currentState)
      ? currentState
      : undefined;
  }

  handleSubmit = async (): Promise<void> => {
    const { firstName, lastName, email, username, password } = this.state;

    await this.props.userSignupController.signupUser(
      firstName,
      lastName,
      email,
      username,
      password,
    );

    this.forceUpdate();
  };

  render() {
    const firstNameError = this.getInputError("firstName");
    const lastNameError = this.getInputError("lastName");
    const emailError = this.getInputError("email");
    const usernameError = this.getInputError("username");
    const passwordError = this.getInputError("password");

    return (
      <View style={styles.container}>
        <View style={styles.field}>
          <TextInput
            style={[
              styles.input,
              firstNameError ? styles.inputError : undefined,
            ]}
            placeholder="First name"
            value={this.state.firstName}
            onChangeText={(firstName) => this.setState({ firstName })}
          />

          {firstNameError && (
            <Text style={styles.errorText}>{firstNameError}</Text>
          )}
        </View>

        <View style={styles.field}>
          <TextInput
            style={[
              styles.input,
              lastNameError ? styles.inputError : undefined,
            ]}
            placeholder="Last name"
            value={this.state.lastName}
            onChangeText={(lastName) => this.setState({ lastName })}
          />

          {lastNameError && (
            <Text style={styles.errorText}>{lastNameError}</Text>
          )}
        </View>

        <View style={styles.field}>
          <TextInput
            style={[styles.input, emailError ? styles.inputError : undefined]}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={this.state.email}
            onChangeText={(email) => this.setState({ email })}
          />

          {emailError && <Text style={styles.errorText}>{emailError}</Text>}
        </View>

        <View style={styles.field}>
          <TextInput
            style={[
              styles.input,
              usernameError ? styles.inputError : undefined,
            ]}
            placeholder="Username"
            autoCapitalize="none"
            value={this.state.username}
            onChangeText={(username) => this.setState({ username })}
          />

          {usernameError && (
            <Text style={styles.errorText}>{usernameError}</Text>
          )}
        </View>

        <View style={styles.field}>
          <TextInput
            style={[
              styles.input,
              passwordError ? styles.inputError : undefined,
            ]}
            placeholder="Password"
            secureTextEntry
            value={this.state.password}
            onChangeText={(password) => this.setState({ password })}
          />

          {passwordError && (
            <Text style={styles.errorText}>{passwordError}</Text>
          )}
        </View>

        <Pressable style={styles.button} onPress={this.handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    gap: 16,
    backgroundColor: "#FFFFFF",
  },
  field: {
    gap: 6,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  inputError: {
    borderColor: "#DC2626",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 12,
  },
  button: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#2563EB",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
