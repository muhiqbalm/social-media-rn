import { FormField } from "@/components/FormField";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import {
  DefaultProfileData,
  ProfileFormData,
  ProfileSchema,
} from "@/schemas/profileSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

export default function EditProfileScreen() {
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileSchema),
    mode: "onChange",
    defaultValues: DefaultProfileData,
  });

  const onValid = (data: ProfileFormData) => {
    Alert.alert("Profil Disimpan", JSON.stringify(data, null, 2));
  };

  return (
    <ThemedView style={styles.outerContainer} darkColor="#121212">
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 20}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={() =>
              Alert.alert(
                "Ganti Foto",
                "Fitur ganti foto akan ditambahkan di sini!"
              )
            }
          >
            <Image
              source={require("@/assets/images/react-logo.png")}
              style={styles.profileImage}
            />
          </TouchableOpacity>

          <FormField
            label="Username"
            name="username"
            control={control}
            error={errors.username}
          />

          <FormField
            label="Email"
            name="email"
            control={control}
            error={errors.email}
            keyboardType="email-address"
          />

          <FormField
            label="Password"
            name="password"
            control={control}
            error={errors.password}
            secureTextEntry
          />

          <FormField
            label="Nomor Telepon"
            name="phone_number"
            control={control}
            error={errors.phone_number}
            keyboardType="phone-pad"
          />

          <FormField
            label="Alamat"
            name="address"
            control={control}
            error={errors.address}
          />

          <FormField
            label="Bio"
            name="bio"
            control={control}
            error={errors.bio}
            multiline
          />
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: currentColors.tint }]}
            onPress={handleSubmit(onValid)}
          >
            <ThemedText
              style={[
                styles.saveButtonText,
                { color: currentColors.background },
              ]}
            >
              Save Changes
            </ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    paddingTop: 40,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    paddingBottom: 100,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    marginBottom: 20,
    alignSelf: "center",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  saveButton: {
    width: "100%",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
