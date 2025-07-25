import { FormField } from "@/components/FormField";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import useMutationQuery from "@/hooks/useMutationQuery";
import {
  DefaultRegisterData,
  PayloadRegisterType,
  RegisterDataType,
  RegisterSchema,
} from "@/schemas/registerSchema";
import { UserDetailSchema, UserDetailType } from "@/schemas/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";

const register = async (data: PayloadRegisterType): Promise<any> => {
  const res = await axios.post("https://dummyjson.com/users/add", data);

  return res.data;
};

export default function RegisterScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];

  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
  } = useForm<RegisterDataType>({
    resolver: zodResolver(RegisterSchema),
    mode: "onChange",
    defaultValues: DefaultRegisterData,
  });

  const handleNextStep = async () => {
    let isValid = false;

    if (step === 1) {
      isValid = await trigger(["username", "firstName", "lastName"]);
    } else if (step === 2) {
      isValid = await trigger(["email", "password", "confirmPassword"]);
    }

    if (isValid) {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const handlePreviousStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const { mutateAsync: registerAsync, isPending } = useMutationQuery<
    UserDetailType,
    PayloadRegisterType
  >(register, UserDetailSchema, {
    onError: (err: Error) => {
      throw err;
    },
  });

  const onValid = async (data: RegisterDataType) => {
    try {
      let isValid = false;

      isValid = await trigger(["agree"]);

      if (isValid) {
        const { agree, confirmPassword, ...rest } = data;
        await registerAsync(rest);

        Alert.alert("Register Success", "Please login to your account!");
        router.replace("/login");
      }
    } catch (err) {
      Alert.alert("Register Failed");
    }
  };

  const formData = getValues();

  return (
    <ThemedView style={styles.outerContainer} darkColor="#121212">
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <ThemedView style={styles.formContainer}>
            <ThemedText style={styles.title}>Register</ThemedText>

            <View style={styles.stepIndicatorContainer}>
              {[...Array(totalSteps)].map((_, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber === step;
                const isCompleted = stepNumber < step;

                return (
                  <React.Fragment key={stepNumber}>
                    <ThemedView
                      style={[
                        styles.stepCircle,
                        isActive
                          ? { backgroundColor: currentColors.tint }
                          : {
                              borderColor:
                                isActive || isCompleted
                                  ? currentColors.text
                                  : currentColors.border,
                              borderWidth: 1,
                            },
                        isCompleted && { backgroundColor: currentColors.tint },
                      ]}
                    >
                      <ThemedText
                        style={[
                          styles.stepText,
                          isActive || isCompleted
                            ? { color: currentColors.background }
                            : { color: currentColors.text },
                        ]}
                      >
                        {stepNumber}
                      </ThemedText>
                    </ThemedView>

                    {stepNumber < totalSteps && (
                      <ThemedView
                        style={[
                          styles.stepLine,
                          isCompleted
                            ? { backgroundColor: currentColors.tint }
                            : { backgroundColor: currentColors.border },
                        ]}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </View>

            {step === 1 && (
              <>
                <FormField
                  label="First Name"
                  name="firstName"
                  control={control}
                  error={errors.firstName}
                  placeholder="Enter your first name"
                />

                <FormField
                  label="Last Name"
                  name="lastName"
                  control={control}
                  error={errors.lastName}
                  placeholder="Enter your last name"
                />

                <FormField
                  label="Username"
                  name="username"
                  control={control}
                  error={errors.username}
                  placeholder="Enter your username"
                />
              </>
            )}

            {step === 2 && (
              <>
                <FormField
                  label="Email"
                  name="email"
                  control={control}
                  error={errors.email}
                  keyboardType="email-address"
                  placeholder="e.g. johndoe@mail.com"
                />

                <FormField
                  label="Password"
                  name="password"
                  control={control}
                  error={errors.password}
                  secureTextEntry
                  placeholder="Enter your password"
                />

                <FormField
                  label="Confirm Password"
                  name="confirmPassword"
                  control={control}
                  error={errors.confirmPassword}
                  secureTextEntry
                  placeholder="Confirm your password"
                />
              </>
            )}

            {step === 3 && (
              <>
                <ThemedView style={styles.summaryCard} type="secondary">
                  <ThemedText style={styles.summaryTitle}>Summary</ThemedText>

                  <View style={styles.summaryItem}>
                    <ThemedText style={styles.summaryLabel}>
                      Username:
                    </ThemedText>
                    <ThemedText style={styles.summaryValue}>
                      {formData.username}
                    </ThemedText>
                  </View>

                  <View style={styles.summaryItem}>
                    <ThemedText style={styles.summaryLabel}>
                      Full Name:
                    </ThemedText>
                    <ThemedText style={styles.summaryValue}>
                      {formData.firstName} {formData.lastName}
                    </ThemedText>
                  </View>

                  <View style={styles.summaryItem}>
                    <ThemedText style={styles.summaryLabel}>Email:</ThemedText>
                    <ThemedText style={styles.summaryValue}>
                      {formData.email}
                    </ThemedText>
                  </View>

                  {/* <View style={styles.summaryItem}>
                    <ThemedText style={styles.summaryLabel}>
                      Password:
                    </ThemedText>
                    <ThemedText style={styles.summaryValue}>
                      {"********"}
                    </ThemedText>
                  </View> */}
                </ThemedView>

                <Controller
                  name="agree"
                  control={control}
                  render={({
                    field: { value, onChange },
                    fieldState: { error },
                  }) => (
                    <View style={{ marginTop: 16 }}>
                      <TouchableWithoutFeedback
                        onPress={() => onChange(!value)}
                      >
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Checkbox
                            value={value}
                            onValueChange={onChange}
                            color={value ? Colors["light"].tint : undefined}
                          />

                          <ThemedText
                            style={{ marginLeft: 8, color: currentColors.text }}
                          >
                            I agree with the rules and policy
                          </ThemedText>
                        </View>
                      </TouchableWithoutFeedback>

                      {error && (
                        <ThemedText style={{ color: "red", marginTop: 4 }}>
                          {error.message}
                        </ThemedText>
                      )}
                    </View>
                  )}
                />
              </>
            )}

            <ThemedView style={styles.buttonContainer}>
              {step > 1 && (
                <TouchableOpacity
                  style={[
                    styles.navigationButton,
                    {
                      backgroundColor: currentColors.secondaryBg,
                    },
                  ]}
                  onPress={handlePreviousStep}
                >
                  <ThemedText
                    style={[
                      styles.navigationButtonText,
                      { color: currentColors.text },
                    ]}
                  >
                    Back
                  </ThemedText>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[
                  styles.navigationButton,
                  { backgroundColor: currentColors.tint },
                ]}
                onPress={() => {
                  if (step !== 3) {
                    handleNextStep();
                  } else {
                    handleSubmit(onValid)();
                  }
                }}
                disabled={isPending}
              >
                {isPending ? (
                  <ActivityIndicator size={24} />
                ) : (
                  <ThemedText
                    style={[
                      styles.navigationButtonText,
                      { color: currentColors.background },
                    ]}
                  >
                    {step !== 3 ? "Next" : "Submit"}
                  </ThemedText>
                )}
              </TouchableOpacity>
            </ThemedView>

            {step !== 3 && (
              <TouchableOpacity
                disabled={isPending}
                style={styles.registerButton}
                onPress={() => {
                  router.replace("/login");
                }}
              >
                <ThemedText style={{ color: currentColors.text }}>
                  Already have an account?{" "}
                  <ThemedText
                    style={{ color: currentColors.tint, fontWeight: "bold" }}
                  >
                    Sign In
                  </ThemedText>
                </ThemedText>
              </TouchableOpacity>
            )}
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 16,
    paddingTop: 24,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  formContainer: {
    flex: 1,
    padding: 32,
    justifyContent: "center",
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    marginBottom: 20,
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: "center",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  saveButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  navigationButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
  },
  navigationButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  registerButton: {
    marginTop: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 8,
  },
  summaryLabel: {
    fontWeight: "bold",
  },
  stepIndicatorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  stepText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  stepLine: {
    flex: 1,
    height: 2,
    marginHorizontal: 8,
  },

  summaryCard: {
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 20,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingBottom: 5,
  },
  summaryValue: {
    flexShrink: 1,
    textAlign: "right",
  },
});
