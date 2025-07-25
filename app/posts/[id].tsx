// PRODUCT DETAIL (RIO)

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import useFetchQuery from "@/hooks/useFetchQuery";
import {
  CommentsResponseSchema,
  PostDetailSchema,
} from "@/schemas/postDetailSchemas";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Share,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const URL = "https://dummyjson.com/posts/1";
const URL_COMMENT_BY_POSTID = "https://dummyjson.com/comments/post/6";

interface PostType {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  userId: number;
  views: number;
}

interface CommentType {
  id: number;
  body: string;
  postId: number;
  likes: number;
  user: {
    id: number;
    username: string;
    fullName: string;
  };
}

interface CommentResponse {
  comments: CommentType[];
  total: number;
  skip: number;
  limit: number;
}

export default function PostDetail() {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const { id } = useLocalSearchParams();
  const postId = String(id);

  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];

  // Fetch post detail
  const {
    data: postData,
    isLoading: isPostLoading,
    error: postError,
  } = useFetchQuery(
    ["post", postId],
    `https://dummyjson.com/posts/${postId}`,
    PostDetailSchema,
    {}
  );

  // Fetch comments
  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    error: commentsError,
    refetch: refetchComments,
  } = useFetchQuery(
    ["comments", postId],
    `https://dummyjson.com/comments/post/${postId}`,
    CommentsResponseSchema,
    {}
  );

  useEffect(() => {
    if (postData) {
      setLikesCount(postData.reactions?.likes || 0);
    }
  }, [postData]);

  useEffect(() => {
    if (commentsData?.comments) {
      setComments(commentsData.comments);
    }
  }, [commentsData]);

  const handleLike = async () => {
    const newIsLiked = !isLiked;
    const newLikesCount = newIsLiked ? likesCount + 1 : likesCount - 1;

    // Optimistic update - update UI immediately
    setIsLiked(newIsLiked);
    setLikesCount(newLikesCount);

    try {
      // Update post with new likes count via DummyJSON API
      const response = await fetch(`https://dummyjson.com/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reactions: {
            likes: newLikesCount,
            dislikes: postData?.reactions?.dislikes || 0,
          },
        }),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        // Update with server response to ensure consistency
        setLikesCount(updatedPost.reactions?.likes || newLikesCount);
        console.log("Post updated successfully:", updatedPost);
      } else {
        // Revert optimistic update on failure
        setIsLiked(!newIsLiked);
        setLikesCount(likesCount);
        Alert.alert("Error", "Failed to update like status");
      }
    } catch (error) {
      // Revert optimistic update on error
      setIsLiked(!newIsLiked);
      setLikesCount(likesCount);
      Alert.alert("Error", "Network error occurred while updating like");
      console.error("Error updating like:", error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);

    try {
      // DummyJSON API call for adding comment
      const response = await fetch("https://dummyjson.com/comments/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: newComment,
          postId: postId,
          userId: 1, // You'd get this from your auth context
        }),
      });

      if (response.ok) {
        const newCommentData = await response.json();

        // Add the new comment to the local state
        setComments((prev) => [newCommentData, ...prev]);
        setNewComment("");
        Alert.alert("Success", "Comment added successfully!");
      } else {
        Alert.alert("Error", "Failed to add comment");
      }
    } catch (error) {
      Alert.alert("Error", "Network error occurred");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleShare = async () => {
    // Alert.alert("Share", "Share functionality would be implemented here");
    try {
      const shareContent = {
        title: postData?.title || "Check out this post!",
        message: `${postData?.title || "Check out this post!"}\n\n${
          postData?.body || ""
        }\n\n${postData?.tags?.map((tag) => `#${tag}`).join(" ") || ""}`,
        url: `https://yourapp.com/posts/${postId}`, // Optional: replace with your app's deep link
      };

      const result = await Share.share(shareContent);

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          console.log("Shared via:", result.activityType);
        } else {
          // shared
          console.log("Content shared successfully");
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        console.log("Share dialog dismissed");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to share content");
      console.error("Share error:", error);
    }
  };

  const handleBack = () => {
    router.push("/(tabs)");
  };

  const renderComment = ({ item }: { item: CommentType }) => (
    <ThemedView style={styles.commentItem}>
      <View style={styles.commentHeader}>
        <IconSymbol name="person.crop.circle.fill" size={32} color="#bbbbbb" />
        <View style={styles.commentContent}>
          <ThemedView style={styles.commentBubble}>
            <ThemedText type="defaultSemiBold" style={styles.commentAuthor}>
              {item.user?.fullName ||
                item.user?.username ||
                `User ${item.user?.id}`}
            </ThemedText>
            <ThemedText style={styles.commentText}>{item.body}</ThemedText>
          </ThemedView>

          <View style={styles.commentActions}>
            <TouchableOpacity>
              <ThemedText variant="secondary" style={styles.commentAction}>
                Like
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity>
              <ThemedText variant="secondary" style={styles.commentAction}>
                Reply
              </ThemedText>
            </TouchableOpacity>
            <ThemedText variant="secondary" style={styles.commentTime}>
              1w
            </ThemedText>
          </View>
        </View>
      </View>
    </ThemedView>
  );

  if (isPostLoading) {
    return (
      <SafeAreaView>
        <ThemedView style={styles.container}>
          <ThemedText>Loading post...</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  if (postError || !postData) {
    return (
      <SafeAreaView>
        <ThemedView style={styles.container}>
          <ThemedText>Error loading post</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderComment}
          ListHeaderComponent={
            <View>
              {/* Post Header */}
              <ThemedView style={styles.postHeader}>
                <View style={styles.headerLeft}>
                  <TouchableOpacity
                    onPress={handleBack}
                    style={styles.backButton}
                  >
                    <IconSymbol
                      name="chevron.left"
                      size={24}
                      color={currentColors.text}
                    />
                  </TouchableOpacity>
                  <View style={styles.authorInfo}>
                    <IconSymbol
                      name="person.crop.circle.fill"
                      size={40}
                      color="#bbbbbb"
                    />
                    <View>
                      <ThemedText type="defaultSemiBold">
                        User {postData.userId}
                      </ThemedText>
                      <ThemedText variant="secondary" style={styles.timestamp}>
                        28 Jun • 🌍
                      </ThemedText>
                    </View>
                  </View>
                </View>

                <TouchableOpacity>
                  <IconSymbol name="ellipsis" size={24} color="#bbbbbb" />
                </TouchableOpacity>
              </ThemedView>

              {/* Post Content */}
              <ThemedView style={styles.postContent}>
                <ThemedText style={styles.postText}>
                  {postData.title}
                </ThemedText>
                <ThemedText style={styles.postBody}>{postData.body}</ThemedText>

                {/* Tags */}
                {postData.tags && postData.tags.length > 0 && (
                  <View style={styles.tagsContainer}>
                    {postData.tags.map((tag, index) => (
                      <ThemedText key={index} style={styles.tag}>
                        #{tag}
                      </ThemedText>
                    ))}
                  </View>
                )}

                {/* Views count */}
                <ThemedText variant="secondary" style={styles.viewsCount}>
                  {postData.views} views
                </ThemedText>
              </ThemedView>

              {/* Reaction Summary */}
              <ThemedView style={styles.reactionSummary}>
                <View style={styles.reactionCount}>
                  <View style={styles.reactionIcons}>
                    <View style={[styles.reactionIcon, styles.likeIcon]}>
                      <ThemedText style={styles.reactionEmoji}>👍</ThemedText>
                    </View>
                    <View style={[styles.reactionIcon, styles.loveIcon]}>
                      <ThemedText style={styles.reactionEmoji}>❤️</ThemedText>
                    </View>
                  </View>
                  <ThemedText variant="secondary">
                    {likesCount.toLocaleString()}
                  </ThemedText>
                </View>

                <ThemedText variant="secondary">
                  {comments.length} comments • 99 shares
                </ThemedText>
              </ThemedView>

              {/* Action Buttons */}
              <ThemedView
                style={[
                  styles.actionButtons,
                  {
                    borderTopColor: currentColors.border,
                    borderBottomColor: currentColors.border,
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleLike}
                >
                  <IconSymbol
                    name="heart"
                    size={24}
                    color={isLiked ? "#e74c3c" : "#bbbbbb"}
                  />
                  <ThemedText
                    variant={isLiked ? "primary" : "secondary"}
                    style={[styles.actionText, isLiked && { color: "#e74c3c" }]}
                  >
                    Like
                  </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                  <IconSymbol name="message" size={24} color="#bbbbbb" />
                  <ThemedText variant="secondary" style={styles.actionText}>
                    Comment
                  </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleShare}
                >
                  <IconSymbol
                    name="arrowshape.turn.up.right"
                    size={24}
                    color="#bbbbbb"
                  />
                  <ThemedText variant="secondary" style={styles.actionText}>
                    Share
                  </ThemedText>
                </TouchableOpacity>
              </ThemedView>

              {/* Comment Input */}
              <ThemedView style={styles.commentInputContainer}>
                <IconSymbol
                  name="person.crop.circle.fill"
                  size={32}
                  color="#bbbbbb"
                />
                <View style={styles.commentInputWrapper}>
                  <TextInput
                    style={[
                      styles.commentInput,
                      {
                        color: currentColors.text,
                        backgroundColor: currentColors.secondaryBg,
                      },
                    ]}
                    placeholder="Write a comment..."
                    placeholderTextColor="#888"
                    value={newComment}
                    onChangeText={setNewComment}
                    multiline
                  />
                  <TouchableOpacity
                    onPress={handleAddComment}
                    disabled={!newComment.trim() || isSubmittingComment}
                    style={[
                      styles.sendButton,
                      (!newComment.trim() || isSubmittingComment) &&
                        styles.sendButtonDisabled,
                    ]}
                  >
                    <IconSymbol
                      name="paperplane.fill"
                      size={16}
                      color={
                        !newComment.trim() || isSubmittingComment
                          ? "#ccc"
                          : "#007AFF"
                      }
                    />
                  </TouchableOpacity>
                </View>
              </ThemedView>

              {/* Comments Header */}
              <ThemedView style={styles.commentsHeader}>
                <ThemedText type="defaultSemiBold">Most relevant ▼</ThemedText>
              </ThemedView>
            </View>
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 2,
  },
  backButton: {
    padding: 4,
  },
  postContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  postText: {
    fontSize: 18,
    lineHeight: 24,
    marginBottom: 8,
    fontWeight: 800,
  },
  postBody: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  tag: {
    fontSize: 14,
    color: "#1877f2",
  },
  viewsCount: {
    fontSize: 13,
  },
  reactionSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  reactionCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reactionIcons: {
    flexDirection: "row",
    marginRight: 4,
  },
  reactionIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -2,
  },
  likeIcon: {
    backgroundColor: "#1877f2",
  },
  loveIcon: {
    backgroundColor: "#e74c3c",
  },
  reactionEmoji: {
    fontSize: 10,
  },
  actionButtons: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
  },
  actionText: {
    fontSize: 15,
    fontWeight: "600",
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    gap: 12,
  },
  commentInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  commentInput: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 8,
    padding: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  commentsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  commentItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  commentContent: {
    flex: 1,
  },
  commentBubble: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  commentAuthor: {
    fontSize: 13,
    marginBottom: 2,
  },
  commentText: {
    fontSize: 15,
    lineHeight: 20,
  },
  commentActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 4,
    marginLeft: 12,
  },
  commentAction: {
    fontSize: 13,
    fontWeight: "600",
  },
  commentTime: {
    fontSize: 13,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
});
