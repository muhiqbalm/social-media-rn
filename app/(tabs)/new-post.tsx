import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useContext } from "react";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";

import {
  View,
  TextInput,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "@/contexts/authContext";
import useFetchQuery from "@/hooks/useFetchQuery";
import { router } from "expo-router";
import { z } from "zod";

const UserDetailSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  email: z.string(),
  image: z.string(),
});

const { width } = Dimensions.get("window");

interface UserDetailType {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  image: string;
}

export default function NewPosts() {
  const auth = useAuth();
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];

  const username = auth && auth.user ? auth.user.username : "yourhandle";
  const userId = auth && auth.user ? auth.user.id : null;

  // Fetch user profile data including profile picture
  const { data: userProfile } = useFetchQuery<UserDetailType>(
    ["profile", username],
    `https://dummyjson.com/users/${userId}`,
    UserDetailSchema
  );

  // Better type checking with explicit null check
  const name = `${userProfile?.firstName ?? ""} ${userProfile?.lastName ?? ""}`;

  const [postTitle, setPostTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission Required", "Camera roll access is required!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const newImage = result.assets[0].uri;
        setSelectedImages((prev) => [...prev, newImage].slice(0, 4));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handlePost = async () => {
    if (!postTitle.trim() || !postText.trim()) {
      Alert.alert("Error", "Please fill in both title and content.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://dummyjson.com/posts/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: postTitle.trim(),
          body: postText.trim(),
          userId: userId || 5,
          tags: ["social", "post"],
        }),
      });

      if (response.ok) {
        const newPost = await response.json();

        setPostTitle("");
        setPostText("");
        setSelectedImages([]);

        Alert.alert("Success", "Post created successfully!", [
          {
            text: "OK",
            onPress: () => {
              router.push({
                pathname: "/",
                params: {
                  newPost: JSON.stringify(newPost),
                  refresh: Date.now().toString(),
                },
              });
            },
          },
        ]);
      } else {
        Alert.alert("Error", "Failed to create post.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const renderImageGrid = () => {
    if (!selectedImages.length) return null;

    return (
      <View style={styles.imageGrid}>
        {selectedImages.map((image, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.previewImage} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() =>
                setSelectedImages((prev) => prev.filter((_, i) => i !== index))
              }
            >
              <ThemedText style={styles.removeButtonText}>×</ThemedText>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  // Get profile picture from API or use fallback
  const profileImageUri =
    userProfile?.image ||
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face&auto=format";

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerTitle}>Create New Post</ThemedText>
        <TouchableOpacity
          style={[
            styles.postButton,
            (!postTitle.trim() || !postText.trim()) &&
              styles.postButtonDisabled,
          ]}
          onPress={handlePost}
          disabled={loading || !postTitle.trim() || !postText.trim()}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <ThemedText style={styles.postButtonText}>Post</ThemedText>
          )}
        </TouchableOpacity>
      </ThemedView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.createPostCard}>
          <View style={styles.postContainer}>
            <Image source={{ uri: profileImageUri }} style={styles.avatar} />

            <View style={styles.postContent}>
              <View style={styles.userInfo}>
                <ThemedText style={styles.userName}>{name}</ThemedText>
                <ThemedText style={styles.userHandle}>@{username}</ThemedText>
              </View>

              <TextInput
                style={[styles.titleInput, { color: currentColors.text }]}
                placeholder="Post Title (255 characters max)"
                value={postTitle}
                onChangeText={setPostTitle}
                maxLength={255}
              />

              <TextInput
                style={[styles.textInput, { color: currentColors.text }]}
                placeholder="What's happening?"
                value={postText}
                onChangeText={setPostText}
                multiline
              />

              {renderImageGrid()}
            </View>
          </View>

          <ThemedView style={styles.bottomToolbar}>
            <TouchableOpacity style={styles.toolbarButton} onPress={pickImage}>
              <ThemedText style={styles.toolbarIcon}>📷</ThemedText>
              <ThemedText style={styles.toolbarLabel}>Photo</ThemedText>
            </TouchableOpacity>
            <View style={styles.characterCount}>
              {/* <ThemedText>Title: {255 - postTitle.length}/255</ThemedText> */}
              <ThemedText>Char: {1000 - postText.length}/1000</ThemedText>
            </View>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  postButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonDisabled: { opacity: 0.5 },
  postButtonText: { fontWeight: "600" },
  content: { padding: 16 },
  createPostCard: {
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },
  postContainer: { flexDirection: "row" },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  postContent: { flex: 1 },
  userInfo: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },
  userName: { fontWeight: "600", marginRight: 6 },
  userHandle: { color: "#8E8E93" },
  titleInput: {
    fontWeight: "600",
    fontSize: 18,
    marginBottom: 8,
  },
  textInput: {
    minHeight: 60,
    fontWeight: "600",
    fontSize: 17,
    textAlignVertical: "top",
    marginBottom: 12,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  imageContainer: {
    position: "relative",
  },
  previewImage: {
    width: (width - 80) / 2,
    height: 120,
    borderRadius: 12,
  },
  removeButton: {
    position: "absolute",
    top: 4,
    right: 4,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: { color: "#fff" },
  bottomToolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  toolbarButton: { alignItems: "center" },
  toolbarIcon: { fontSize: 24 },
  toolbarLabel: { fontSize: 12, color: "#007AFF" },
  characterCount: {
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 4,
  },
});
