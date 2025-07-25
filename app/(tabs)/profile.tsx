import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/authContext";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { TouchableOpacity } from "react-native";

export default function ProfileScreen() {
  const { logout } = useAuth();
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];

  return (
    <ThemedView style={{ height: "100%", padding: 16, paddingTop: 64 }}>
      <ThemedView type="secondary" style={{ borderRadius: 16, padding: 16 }}>
        <ThemedText>Title</ThemedText>
      </ThemedView>

      <TouchableOpacity onPress={logout}>
        <ThemedText style={{ color: currentColors.danger }}>Logout</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}
