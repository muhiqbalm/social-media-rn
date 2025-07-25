// PRODUCT LIST (MONICA)

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  View
} from "react-native";

const URL = "https://dummyjson.com/products";

export default function MarketplaceScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await fetch(URL);
      const json = await response.json();
      setProducts(json.products); // assume response has a `products` array
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.thumbnail }} style={styles.image} />
      <ThemedText style={styles.title}>{item.title}</ThemedText>
      <ThemedText style={styles.price}>${item.price}</ThemedText>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <ThemedText>Loading products...</ThemedText>
        </ThemedView>
      </SafeAreaView>

    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.header}>PRODUCT LIST</ThemedText>
        <FlatList
          data={products}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.row}
        />
      </ThemedView>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },

  loadingContainer: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 16,
  },

  listContainer: {
    paddingHorizontal: 16, // ✅ padding kanan kiri biar isi agak ke tengah
    paddingBottom: 20,
    alignItems: "center",  // ✅ penting untuk center item ketika tidak full width
  },

  row: {
    justifyContent: "space-between", // ✅ jaga jarak antara dua card
    width: "100%",
    marginBottom: 16,
  },

  card: {
    backgroundColor: "#f9f9f9",
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
    transform: [{ scale: 1.02 }],
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
});
