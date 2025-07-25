import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/authContext";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import useFetchQuery from "@/hooks/useFetchQuery";
import { UserDetailSchema, UserDetailType } from "@/schemas/userSchema";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const { logout, user } = useAuth();
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];

  const {
    data: profile,
    isLoading,
    error,
  } = useFetchQuery<UserDetailType>(
    "profile",
    `https://dummyjson.com/users/${user?.id}`,
    UserDetailSchema
  );

  if (isLoading) {
    return (
      <ThemedView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color={currentColors.text} />
      </ThemedView>
    );
  }

  if (error || !profile) {
    return (
      <ThemedView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ThemedText>Error loading profile.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
        paddingTop: 64,
        paddingBottom: 120,
        gap: 16,
      }}
    >
      <ThemedText type="title" style={{ fontSize: 18, textAlign: "center" }}>
        Your Profile
      </ThemedText>

      {/* Profile Card */}
      <ThemedView
        type="secondary"
        style={{
          borderRadius: 16,
          padding: 16,
          flexDirection: "row",
          gap: 16,
          alignItems: "center",
        }}
      >
        <Image
          style={{
            height: 64,
            width: 64,
            borderRadius: 32,
            borderWidth: 1,
            borderColor: currentColors.border,
          }}
          source={{ uri: profile.image }}
          resizeMode="cover"
        />

        <View>
          <ThemedText type="title" style={{ fontSize: 16 }}>
            {profile.firstName} {profile.lastName}
          </ThemedText>
          <ThemedText variant="secondary">{profile.username}</ThemedText>
        </View>
      </ThemedView>

      {/* Detail Info */}
      <ThemedView
        type="secondary"
        style={{ borderRadius: 12, padding: 16, gap: 8 }}
      >
        <InfoItem label="Email" value={profile.email} />
        <InfoItem label="Phone" value={profile.phone} />
        <InfoItem label="Gender" value={profile.gender} />
        <InfoItem label="Birth Date" value={profile.birthDate} />
        <InfoItem label="University" value={profile.university} />

        <ThemedText style={{ marginTop: 12, fontWeight: "bold" }}>
          Address
        </ThemedText>
        <InfoItem label="Street" value={profile.address.address} />
        <InfoItem label="City" value={profile.address.city} />
        <InfoItem label="State" value={profile.address.state} />
        <InfoItem label="Postal Code" value={profile.address.postalCode} />
        <InfoItem
          label="Coordinates"
          value={`Lat: ${profile.address.coordinates.lat ?? "-"}, Lng: ${
            profile.address.coordinates.lng ?? "-"
          }`}
        />
      </ThemedView>

      {/* Logout Button */}
      <TouchableOpacity
        onPress={() => {
          Alert.alert(
            "Log Out",
            "Are you sure you want to leave this app?",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Yes, Logout",
                style: "destructive",
                onPress: logout,
              },
            ],
            { cancelable: true }
          );
        }}
      >
        <ThemedView
          type="secondary"
          style={{
            borderWidth: 1,
            backgroundColor: "transparent",
            borderColor: currentColors.secondaryBorder,
            borderRadius: 12,
            padding: 16,
            flexDirection: "row",
            gap: 8,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 16,
          }}
        >
          <IconSymbol
            color={currentColors.danger}
            name="rectangle.portrait.and.arrow.right"
            size={24}
          />
          <ThemedText style={{ color: currentColors.danger }}>
            Log Out
          </ThemedText>
        </ThemedView>
      </TouchableOpacity>
    </ScrollView>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <ThemedText style={{ fontWeight: "500" }}>{label}</ThemedText>

      <ThemedText
        variant="secondary"
        style={{ maxWidth: "60%", textAlign: "right" }}
      >
        {value}
      </ThemedText>
    </View>
  );
}
