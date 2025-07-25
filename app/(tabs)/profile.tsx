import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/authContext";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import useFetchQuery from "@/hooks/useFetchQuery";
import { UserDetailSchema, UserDetailType } from "@/schemas/userSchema";
import {
  Alert,
  Image,
  Platform,
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
        style={{ flex: 1, backgroundColor: currentColors.background }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingTop: Platform.OS === "android" ? 48 : 64,
            paddingBottom: 48,
            gap: 16,
            paddingHorizontal: 16,
          }}
        >
          {/* Skeleton Avatar */}
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <ThemedView
              skeleton={true}
              style={{
                height: 120,
                width: 120,
                borderRadius: 100,
                backgroundColor: "#ccc",
              }}
            />
          </View>

          {/* Skeleton Name and Username */}
          <View>
            <ThemedView
              type="secondary"
              skeleton={true}
              style={{
                height: 24,
                marginBottom: 8,
                borderRadius: 8,
                marginHorizontal: 40,
              }}
            />
            <ThemedView
              type="secondary"
              skeleton={true}
              style={{
                height: 16,
                width: 120,
                alignSelf: "center",
                borderRadius: 8,
              }}
            />
          </View>

          {/* Skeleton Detail Info */}
          <ThemedView
            type="secondary"
            style={{
              borderRadius: 12,
              padding: 20,
              gap: Platform.OS === "android" ? 24 : 16,
            }}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <View key={i} style={{ gap: 8 }}>
                <ThemedView
                  skeleton={true}
                  style={{ height: 16, width: 80, borderRadius: 6 }}
                />
                <ThemedView
                  skeleton={true}
                  style={{ height: 16, borderRadius: 6 }}
                />
              </View>
            ))}
          </ThemedView>

          {/* Skeleton Edit Profile Button */}
          <ThemedView
            skeleton={true}
            type="secondary"
            style={{
              height: 48,
              borderRadius: 12,
            }}
          />

          {/* Skeleton Logout Button */}
          <ThemedView
            skeleton={true}
            type="secondary"
            style={{
              height: 48,
              borderRadius: 12,
              marginBottom: 64,
            }}
          />
        </ScrollView>
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
    <ThemedView style={{ flex: 1, backgroundColor: currentColors.background }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingTop: Platform.OS === "android" ? 48 : 64,
          paddingBottom: 48,
          gap: 16,
          paddingHorizontal: 16,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Image
            style={{
              height: 120,
              width: 120,
              borderRadius: 100,
              borderWidth: 1,
              borderColor: Colors["light"].tint,
              backgroundColor: "#ffffff",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
            }}
            source={{ uri: profile.image }}
            resizeMode="cover"
          />
        </View>

        <View>
          <ThemedText
            type="title"
            style={{ fontSize: 24, textAlign: "center" }}
          >
            {profile.firstName} {profile.lastName}
          </ThemedText>

          <ThemedText variant="secondary" style={{ textAlign: "center" }}>
            @{profile.username}
          </ThemedText>
        </View>

        {/* Detail Info */}
        <ThemedView
          type="secondary"
          lightColor="#f0f0f0"
          style={{
            borderRadius: 12,
            padding: 20,
            gap: Platform.OS === "android" ? 24 : 16,
          }}
        >
          <InfoItem label="Email" value={profile.email} />
          <InfoItem label="Phone" value={profile.phone} />
          <InfoItem label="Birth Date" value={profile.birthDate} />
          <InfoItem label="University" value={profile.university} />
        </ThemedView>

        <View style={{ gap: 16, marginTop: "auto" }}>
          <TouchableOpacity>
            <ThemedView
              type="secondary"
              style={{
                borderWidth: 2,
                backgroundColor: "transparent",
                borderColor: currentColors.secondaryBorder,
                borderRadius: 12,
                padding: 16,
                flexDirection: "row",
                gap: 8,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IconSymbol
                color={Colors["light"].tint}
                name="pencil"
                size={24}
              />
              <ThemedText
                style={{ color: Colors["light"].tint, fontWeight: "bold" }}
              >
                Edit Profile
              </ThemedText>
            </ThemedView>
          </TouchableOpacity>

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
                borderWidth: 2,
                backgroundColor: "transparent",
                borderColor: currentColors.secondaryBorder,
                borderRadius: 12,
                padding: 16,
                flexDirection: "row",
                gap: 8,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 64,
              }}
            >
              <IconSymbol
                color={currentColors.danger}
                name="rectangle.portrait.and.arrow.right"
                size={24}
              />

              <ThemedText
                style={{ color: currentColors.danger, fontWeight: "bold" }}
              >
                Log Out
              </ThemedText>
            </ThemedView>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ justifyContent: "space-between" }}>
      <ThemedText style={{ fontWeight: "500" }}>{label}</ThemedText>

      <ThemedText variant="secondary">{value}</ThemedText>
    </View>
  );
}
