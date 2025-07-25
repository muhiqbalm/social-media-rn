import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useDebounce } from "@/hooks/useDebounce";
import useFetchQuery from "@/hooks/useFetchQuery";
import { ProductType, ResponseGetProductSchema } from "@/schemas/productSchema";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  TextInput,
  useColorScheme,
  View,
} from "react-native";

export default function MarketplaceScreen() {
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];

  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<ProductType[]>([]);
  const [debouncedSearch, setSearch, search] = useDebounce("", 800);

  const isSearching = debouncedSearch.length > 0;

  const {
    data: resData,
    isLoading,
    isFetching,
    isRefetching,
    refetch,
    error,
  } = useFetchQuery(
    ["products", page, debouncedSearch],
    isSearching
      ? "https://dummyjson.com/products/search"
      : "https://dummyjson.com/products",
    ResponseGetProductSchema,
    {
      params: {
        limit: 20,
        skip: (page - 1) * 20,
        q: debouncedSearch,
      },
    }
  );

  useEffect(() => {
    if (resData) {
      if (page === 1) {
        setAllProducts(resData.products);
      } else {
        setAllProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const unique = resData.products.filter((p) => !existingIds.has(p.id));
          return [...prev, ...unique];
        });
      }
    }
  }, [resData]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleLoadMore = () => {
    if (!isFetching && resData && resData.products.length > 0) {
      setPage((prev) => prev + 1);
    }
  };

  const handleRefresh = async () => {
    if (!isRefetching) {
      setPage(1);
      const result = await refetch();
      if (result.data) {
        setAllProducts(result.data.products);
      }
    }
  };

  const renderItem = ({ item }: { item: ProductType }) => (
    <ThemedView style={styles.card}>
      <Image source={{ uri: item.thumbnail }} style={styles.image} />
      <ThemedText style={styles.title}>{item.title}</ThemedText>
      <ThemedText style={styles.price}>${item.price}</ThemedText>
    </ThemedView>
  );

  const renderFooter = () => {
    if (!isLoading && !isFetching) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="large" />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView
        darkColor="#000"
        style={[
          styles.container,
          { paddingTop: Platform.OS === "android" ? 36 : 0 },
        ]}
      >
        <ThemedText style={styles.header}>PRODUCT LIST</ThemedText>

        <ThemedView style={styles.searchBarContainer}>
          <TextInput
            style={[styles.searchInput, { color: currentColors.text }]}
            placeholder="Search products..."
            placeholderTextColor="#888"
            value={search}
            onChangeText={(text) => {
              setAllProducts([]);
              setSearch(text);
            }}
          />
          <IconSymbol name="magnifyingglass" size={20} color={"#888"} />
        </ThemedView>

        {error ? (
          <ThemedText>Error: {error.message}</ThemedText>
        ) : isLoading && page === 1 ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={allProducts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContainer}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            refreshing={isRefetching}
            onRefresh={handleRefresh}
          />
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    height: "100%",
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  card: {
    borderRadius: 10,
    width: "48%",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: "gray",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 100,
    marginBottom: 16,
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
