import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useDebounce } from "@/hooks/useDebounce";
import useFetchQuery from "@/hooks/useFetchQuery";
import { PostType, ResponseGetPostSchema } from "@/schemas/postSchema";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@/contexts/authContext";
import {
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";

export default function HomeScreen() {
  const [page, setPage] = useState(1);
  const [debouncedSearch, setSearch, search] = useDebounce("", 500);
  const [allPosts, setAllPosts] = useState<PostType[]>([]);
  const params = useLocalSearchParams();

  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];

  const {
    data: resData,
    isLoading,
    isFetching,
    isRefetching,
    refetch,
    error,
  } = useFetchQuery(
    ["posts", page, debouncedSearch],
    debouncedSearch.length > 0
      ? "https://dummyjson.com/posts/search"
      : "https://dummyjson.com/posts",
    ResponseGetPostSchema,
    {
      params: {
        limit: 20,
        skip: (page - 1) * 20,
        q: debouncedSearch,
      },
    }
  );

  useEffect(() => {
    if (params.newPost && typeof params.newPost === "string") {
      try {
        const newPost: PostType = JSON.parse(params.newPost);
        setAllPosts((prevPosts) => {
          const existingIds = new Set(prevPosts.map((post) => post.id));
          if (!existingIds.has(newPost.id)) {
            return [newPost, ...prevPosts];
          }
          return prevPosts;
        });
      } catch (error) {
        console.error("Error parsing new post:", error);
      }
    }
  }, [params.newPost]);

  useEffect(() => {
    if (resData && resData.posts.length > 0) {
      setAllPosts((prevPosts) => {
        const hasNewPost =
          prevPosts.length > 0 &&
          !resData.posts.some((post) => post.id === prevPosts[0].id);

        const existingIds = new Set(prevPosts.map((post) => post.id));
        const uniqueNewPosts = resData.posts.filter(
          (post) => !existingIds.has(post.id)
        );

        if (hasNewPost && page === 1) {
          return [prevPosts[0], ...uniqueNewPosts];
        } else {
          return [...prevPosts, ...uniqueNewPosts];
        }
      });
    }
  }, [resData, page]);

  const handleLoadMore = () => {
    if (!isLoading && !isFetching && resData && resData.posts.length > 0) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleRefresh = async () => {
    if (!isLoading && !isRefetching) {
      setPage(1);
      const result = await refetch();
      if (result.data) {
        setAllPosts(result.data.posts);
      }
    }
  };

  const renderFooter = () => {
    if (!isLoading && !isFetching) return null;
    return <SkeletonLoader />;
  };

  return (
    <SafeAreaView style={{ height: "100%" }}>
      <ThemedView
        darkColor="#000"
        lightColor="#dddddd"
        style={[
          styles.outerContainer,
          { paddingTop: Platform.OS === "android" ? 36 : 0 },
        ]}
      >
        {/* <ThemedText
          type="title"
          style={{ fontSize: 20, paddingHorizontal: 12, paddingTop: 12 }}
        >
          Dashboard
        </ThemedText> */}

        <ThemedView
          style={[
            styles.searchBarContainer,
            { backgroundColor: currentColors.background },
          ]}
        >
          <TextInput
            style={[styles.searchInput, { color: currentColors.text }]}
            placeholder="Search something..."
            placeholderTextColor={colorScheme === "dark" ? "#aaa" : "#888"}
            value={search}
            onChangeText={(text) => {
              setPage(1);
              setAllPosts([]);
              setSearch(text);
            }}
          />
          <IconSymbol name="magnifyingglass" size={20} color={"#888"} />
        </ThemedView>

        {error ? (
          <ThemedText>Error: {error.message}</ThemedText>
        ) : isLoading && page === 1 && allPosts.length === 0 ? (
          <>
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
          </>
        ) : (
          <FlatList
            data={allPosts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <PostItem
                post={item}
                isNewPost={index === 0 && params.newPost ? true : false}
              />
            )}
            contentContainerStyle={styles.listContent}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            ListFooterComponentStyle={{ height: 120, marginBottom: 64 }}
            refreshing={isRefetching}
            onRefresh={handleRefresh}
          />
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const PostItem = ({
  post,
  isNewPost = false,
}: {
  post: PostType;
  isNewPost?: boolean;
}) => {
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useAuth();

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const displayName = post.userId === 1 ? user?.username ?? "You" : `User ${post.userId}`;

  return (
    <ThemedView style={[styles.postItem, isNewPost && styles.newPostHighlight]}>
      {isNewPost && (
        <View style={styles.newPostBadge}>
          <ThemedText style={styles.newPostText}>✨ Your new post</ThemedText>
        </View>
      )}

      <ThemedView
        style={[
          styles.messageContainer,
          { backgroundColor: currentColors.background },
        ]}
      >
        <View style={[styles.interactItem, { marginBottom: 8 }]}>
          <IconSymbol
            name="person.crop.circle.fill"
            size={20}
            color={"#bbbbbb"}
          />
          <ThemedText variant="secondary" style={styles.body}>
            {displayName}
          </ThemedText>
        </View>

          <ThemedText type="title" style={styles.title}>
            {post.title}
          </ThemedText>

          <ThemedText
            style={styles.body}
            numberOfLines={isExpanded ? undefined : 3}
          >
            {post.body}
          </ThemedText>

        {post.body.length > 100 && (
          <TouchableOpacity onPress={toggleExpand}>
            <ThemedText
              variant="secondary"
              style={{ marginTop: 4, fontSize: 14 }}
            >
              {isExpanded ? "Show less" : "Read more"}
            </ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>

      <ThemedView
        style={[styles.interaction, { borderTopColor: currentColors.border }]}
      >
        <View style={styles.interactItem}>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation(); // Prevent navigation when liking
              // Handle like logic here
            }}
          >
            <IconSymbol name="heart" size={24} color={"#bbbbbb"} />
          </TouchableOpacity>
          <ThemedText>{post.reactions?.likes || 0}</ThemedText>
        </View>

        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation(); // Prevent navigation
            handleToDetailPost(post.id); // Go to comments
          }}
        >
          <IconSymbol name="message.fill" size={24} color={"#bbbbbb"} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation(); // Prevent navigation
            // Handle share logic here
          }}
        >
          <IconSymbol
            name="arrowshape.turn.up.right.fill"
            size={24}
            color={"#bbbbbb"}
          />
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
};

const SkeletonLoader = () => {
  return (
    <ThemedView
      skeleton={true}
      style={[styles.postItem, styles.skeletonContainer, { marginVertical: 0 }]}
    >
      <ThemedView
        skeleton={true}
        type="secondary"
        style={styles.skeletonTitle}
      />
      <ThemedView
        skeleton={true}
        type="secondary"
        style={styles.skeletonBodyLine}
      />
      <ThemedView
        skeleton={true}
        type="secondary"
        style={styles.skeletonBodyLine}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  interactItem: {
    display: "flex",
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  outerContainer: {
    height: "100%",
    display: "flex",
    gap: 12,
    flexDirection: "column",
  },
  listContent: {
    display: "flex",
    gap: 12,
    paddingHorizontal: 12,
    flexDirection: "column",
  },
  title: {
    marginBottom: 8,
    fontSize: 18,
    lineHeight: 28,
  },
  body: {
    fontSize: 14,
  },
  postItem: {
    borderRadius: 12,
  },
  newPostHighlight: {
    borderWidth: 2,
    borderColor: "#007AFF",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  newPostBadge: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  newPostText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  interaction: {
    borderTopWidth: 1,
    padding: 12,
    borderBottomEndRadius: 12,
    borderBottomStartRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  messageContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    padding: 16,
    backgroundColor: "transparent",
  },
  skeletonContainer: {
    padding: 16,
    display: "flex",
    gap: 12,
    margin: 12,
    borderRadius: 12,
    justifyContent: "center",
  },
  skeletonTitle: {
    height: 20,
    width: "70%",
    borderRadius: 4,
  },
  skeletonBodyLine: {
    height: 20,
    borderRadius: 4,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 100,
    marginHorizontal: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
});
