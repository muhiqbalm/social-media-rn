// PRODUCT DETAIL (RIO)

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const URL = "https://dummyjson.com/posts/1";
const URL_COMMENT_BY_POSTID = "https://dummyjson.com/comments/post/6";

export default function PostDetail() {
  return (
    <ThemedView style={{ height: "100%" }}>
      <ThemedText>POST DETAIL</ThemedText>
    </ThemedView>
  );
}
