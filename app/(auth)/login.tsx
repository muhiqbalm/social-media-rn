import { FormField } from "@/components/FormField";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/authContext";
import {
  DefaultLoginData,
  LoginFormData,
  LoginSchema,
} from "@/schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const { login, loading } = useAuth();
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
    defaultValues: DefaultLoginData,
  });

  const onValid = async (data: LoginFormData) => {
    try {
      await login(data.username, data.password);
    } catch (err) {
      Alert.alert("Login Failed", "Incorrect username or password");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.screenContainer}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            {/* <ThemedView
              style={styles.headerContainer}
              darkColor="#2f2f2f"
              lightColor="#e9e9e9"
            >
              <IconSymbol
                size={310}
                color="#808080"
                name="chevron.left.forwardslash.chevron.right"
                style={styles.headerImage}
              />
            </ThemedView> */}

            <ThemedView style={styles.formContainer} darkColor="#121212">
              <ThemedText style={styles.title}>Welcome Back!</ThemedText>
              <ThemedText style={styles.subtitle} variant="secondary">
                Sign in to your account
              </ThemedText>

              <FormField
                label="Username"
                name="username"
                control={control}
                error={errors.username}
                autoCapitalize="none"
                placeholder="Enter your username"
              />

              <FormField
                label="Password"
                name="password"
                control={control}
                error={errors.password}
                secureTextEntry
                placeholder="Enter your password"
              />

              <TouchableOpacity
                style={[
                  styles.loginButton,
                  { backgroundColor: currentColors.tint },
                ]}
                disabled={loading}
                onPress={handleSubmit(onValid)}
              >
                {loading ? (
                  <ActivityIndicator
                    color={currentColors.background}
                    style={{ height: 24 }}
                  />
                ) : (
                  <ThemedText
                    style={[
                      styles.loginButtonText,
                      {
                        color: currentColors.background,
                        backgroundColor: currentColors.tint,
                      },
                    ]}
                  >
                    Login
                  </ThemedText>
                )}
              </TouchableOpacity>

              {/* <TouchableOpacity style={styles.forgotPasswordButton}>
                <ThemedText style={{ color: currentColors.text }}>
                  Forgot Password?
                </ThemedText>
              </TouchableOpacity> */}

              <TouchableOpacity
                style={styles.registerButton}
                onPress={() => {
                  router.push("/register");
                }}
              >
                <ThemedText style={{ color: currentColors.text }}>
                  Don't have an account?{" "}
                  <ThemedText
                    style={{ color: currentColors.tint, fontWeight: "bold" }}
                  >
                    Sign Up
                  </ThemedText>
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ScrollView>
        </KeyboardAvoidingView>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  headerContainer: {
    position: "relative",
    height: 200,
  },
  headerImage: {
    color: "#808080",
    bottom: -96,
    left: -32,
    position: "absolute",
  },
  formContainer: {
    flex: 1,
    padding: 32,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: "center",
  },
  loginButton: {
    width: "100%",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    marginBottom: 16,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  forgotPasswordButton: {
    marginTop: 16,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  registerButton: {
    justifyContent: "center",
    alignItems: "center",
  },
});
