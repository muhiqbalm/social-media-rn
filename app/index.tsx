import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image } from "react-native";

export default function Index() {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoggedIn && !loading) {
        router.replace("/login");
      } else {
        router.replace("/(tabs)");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isLoggedIn, loading]);

  return (
    <ThemedView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Image
        source={require("@/assets/images/react-logo.png")}
        style={{ width: 200, height: 200 }}
      />
    </ThemedView>
  );
}
