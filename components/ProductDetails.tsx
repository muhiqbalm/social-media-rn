import {
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import axios from "axios";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useCart } from "@/contexts/CartContext";

const { width } = Dimensions.get("window");

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  images: string[];
  category: string;
  rating: number;
  discountPercentage: number;
  brand: string;
  stock: number;
  tags: string[];
  warrantyInformation?: string;
  shippingInformation?: string;
  returnPolicy?: string;
}

interface ProductDetailsProps {
  productId: number;
  onBack?: () => void;
}

export default function ProductDetails({
  productId,
  onBack,
}: ProductDetailsProps) {
  // State for product details
  const [product, setProduct] = useState<Product | null>(null);
  // Loading state
  const [loading, setLoading] = useState(true);
  // Error state
  const [error, setError] = useState("");
  // Current image index for carousel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Adding to cart state
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Cart context
  const { addItem, state } = useCart();

  // Check if item is already in cart
  const isInCart = product
    ? state.items.some((item) => item.id === product.id)
    : false;
  const cartItem = product
    ? state.items.find((item) => item.id === product.id)
    : null;

  // Fetch product details from API using axios
  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://dummyjson.com/products/${productId}`
      );

      setProduct(response.data);
      setError("");
      setCurrentImageIndex(0);
    } catch (e: any) {
      console.error("Error fetching product details:", e.message);
      setError("Failed to load product details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch product details when component mounts or productId changes
  useEffect(() => {
    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  // Handle back navigation
  const handleBackPress = () => {
    if (onBack) {
      onBack();
    }
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!product) return;

    setIsAddingToCart(true);

    // Simulate adding to cart delay
    setTimeout(() => {
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        discountPercentage: product.discountPercentage,
        brand: product.brand,
        stock: product.stock,
      });

      setIsAddingToCart(false);

      Alert.alert(
        "Added to Cart!",
        `${product.title} has been added to your cart.`,
        [{ text: "OK" }]
      );
    }, 500);
  };

  // Handle buy now (add to cart and show checkout option)
  const handleBuyNow = async () => {
    if (!product) return;

    setIsAddingToCart(true);

    // Add to cart first if not already there
    if (!isInCart) {
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        discountPercentage: product.discountPercentage,
        brand: product.brand,
        stock: product.stock,
      });
    }

    setTimeout(() => {
      setIsAddingToCart(false);

      Alert.alert(
        "Buy Now",
        `${product.title} has been added to your cart. Would you like to proceed to checkout?`,
        [
          { text: "Continue Shopping", style: "cancel" },
          {
            text: "Go to Cart",
            onPress: () => {
              // Here you would navigate to cart
              // For now, just show an alert
              Alert.alert("Navigation", "Navigate to cart screen");
            },
          },
        ]
      );
    }, 500);
  };

  // Format price with discount
  const formatPrice = (price: number, discount?: number) => {
    if (discount && discount > 0) {
      const discountedPrice = price * (1 - discount / 100);
      return {
        original: `$${price.toFixed(2)}`,
        discounted: `$${discountedPrice.toFixed(2)}`,
      };
    }
    return { original: `$${price.toFixed(2)}` };
  };

  // Render image pagination dots
  const renderImagePagination = (images: string[]) => {
    return (
      <ThemedView
        style={styles.paginationContainer}
        lightColor="rgba(0,0,0,0.1)"
        darkColor="rgba(255,255,255,0.1)"
      >
        {images.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.paginationDot,
              index === currentImageIndex && styles.paginationDotActive,
            ]}
            onPress={() => setCurrentImageIndex(index)}
          />
        ))}
      </ThemedView>
    );
  };

  // Show loading spinner while fetching
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.container}>
          <ActivityIndicator
            size="large"
            color="#1877F2"
            style={styles.loader}
          />
          <ThemedText style={styles.loadingText}>
            Loading product details...
          </ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  // Show error if something went wrong
  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.container}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchProductDetails}
          >
            <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </SafeAreaView>
    );
  }

  // Show message if no product found
  if (!product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.container}>
          <ThemedText style={styles.errorText}>Product not found</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  const priceInfo = formatPrice(product.price, product.discountPercentage);
  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.thumbnail];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ThemedView style={styles.container}>
        {/* Header with back button */}
        <ThemedView style={styles.header} lightColor="#fff" darkColor="#1c1c1e">
          {onBack && (
            <TouchableOpacity
              onPress={handleBackPress}
              style={styles.backButton}
            >
              <ThemedText type="link" style={styles.backButtonText}>
                ←
              </ThemedText>
            </TouchableOpacity>
          )}
          <ThemedText type="defaultSemiBold" style={styles.headerTitle}>
            Product Details
          </ThemedText>
        </ThemedView>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Product Images */}
          <ThemedView style={styles.imageContainer}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(
                  event.nativeEvent.contentOffset.x / width
                );
                setCurrentImageIndex(index);
              }}
            >
              {images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={styles.productImage}
                />
              ))}
            </ScrollView>
            {images.length > 1 && renderImagePagination(images)}
          </ThemedView>

          {/* Product Information */}
          <ThemedView
            style={styles.productInfo}
            lightColor="#fff"
            darkColor="#1c1c1e"
          >
            <ThemedText type="title" style={styles.productTitle}>
              {product.title}
            </ThemedText>

            {/* Price */}
            <ThemedView style={styles.priceContainer}>
              {priceInfo.discounted ? (
                <ThemedView style={styles.discountPriceRow}>
                  <ThemedText style={styles.discountedPrice}>
                    {priceInfo.discounted}
                  </ThemedText>
                  <ThemedText style={styles.originalPrice}>
                    {priceInfo.original}
                  </ThemedText>
                  <ThemedView style={styles.discountBadge}>
                    <ThemedText style={styles.discountText}>
                      {Math.round(product.discountPercentage)}% OFF
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
              ) : (
                <ThemedText style={styles.price}>
                  {priceInfo.original}
                </ThemedText>
              )}
            </ThemedView>

            {/* Rating and Brand */}
            <ThemedView style={styles.metaInfo}>
              <ThemedText style={styles.rating}>
                ⭐ {product.rating.toFixed(1)}/5
              </ThemedText>
              {product.brand && (
                <ThemedText style={styles.brand}>
                  Brand: {product.brand}
                </ThemedText>
              )}
            </ThemedView>

            {/* Stock Status */}
            <ThemedView style={styles.stockContainer}>
              <ThemedText
                style={[
                  styles.stockText,
                  product.stock > 0 ? styles.inStock : styles.outOfStock,
                ]}
              >
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </ThemedText>
            </ThemedView>

            {/* Cart Status */}
            {isInCart && cartItem && (
              <ThemedView style={styles.cartStatusContainer}>
                <ThemedText style={styles.cartStatusText}>
                  ✓ {cartItem.quantity} in cart
                </ThemedText>
              </ThemedView>
            )}

            {/* Category */}
            <ThemedText style={styles.categoryText}>
              Category: {product.category}
            </ThemedText>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <ThemedView style={styles.tagsContainer}>
                <ThemedText type="defaultSemiBold" style={styles.tagsLabel}>
                  Tags:
                </ThemedText>
                <ThemedView style={styles.tagsRow}>
                  {product.tags.map((tag, index) => (
                    <ThemedView
                      key={index}
                      style={styles.tag}
                      lightColor="#e5e7eb"
                      darkColor="#374151"
                    >
                      <ThemedText style={styles.tagText}>{tag}</ThemedText>
                    </ThemedView>
                  ))}
                </ThemedView>
              </ThemedView>
            )}

            {/* Description */}
            <ThemedView style={styles.descriptionContainer}>
              <ThemedText type="subtitle" style={styles.descriptionLabel}>
                Description
              </ThemedText>
              <ThemedText style={styles.description}>
                {product.description}
              </ThemedText>
            </ThemedView>

            {/* Additional Information */}
            {product.warrantyInformation && (
              <ThemedView style={styles.infoSection}>
                <ThemedText type="defaultSemiBold" style={styles.infoLabel}>
                  Warranty
                </ThemedText>
                <ThemedText style={styles.infoText}>
                  {product.warrantyInformation}
                </ThemedText>
              </ThemedView>
            )}

            {product.shippingInformation && (
              <ThemedView style={styles.infoSection}>
                <ThemedText type="defaultSemiBold" style={styles.infoLabel}>
                  Shipping
                </ThemedText>
                <ThemedText style={styles.infoText}>
                  {product.shippingInformation}
                </ThemedText>
              </ThemedView>
            )}

            {product.returnPolicy && (
              <ThemedView style={styles.infoSection}>
                <ThemedText type="defaultSemiBold" style={styles.infoLabel}>
                  Return Policy
                </ThemedText>
                <ThemedText style={styles.infoText}>
                  {product.returnPolicy}
                </ThemedText>
              </ThemedView>
            )}
          </ThemedView>
        </ScrollView>

        {/* Action Buttons */}
        <ThemedView
          style={styles.actionButtons}
          lightColor="#fff"
          darkColor="#1c1c1e"
        >
          <TouchableOpacity
            style={[
              styles.addToCartButton,
              (product.stock <= 0 || isAddingToCart) && styles.buttonDisabled,
              isInCart && styles.addToCartButtonInCart,
            ]}
            onPress={handleAddToCart}
            disabled={product.stock <= 0 || isAddingToCart}
          >
            <ThemedText
              style={[
                styles.addToCartButtonText,
                isInCart && styles.addToCartButtonTextInCart,
              ]}
              lightColor={isInCart ? "#059669" : "#6b7280"}
              darkColor={isInCart ? "#059669" : "#6b7280"}
            >
              {isAddingToCart
                ? "Adding..."
                : isInCart
                ? "✓ In Cart"
                : "Add to Cart"}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.buyButton,
              (product.stock <= 0 || isAddingToCart) && styles.buttonDisabled,
            ]}
            onPress={handleBuyNow}
            disabled={product.stock <= 0 || isAddingToCart}
          >
            <ThemedText style={styles.buyButtonText}>
              {isAddingToCart ? "Processing..." : "Buy Now"}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  loader: {
    marginTop: 100,
    alignSelf: "center",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    color: "#dc2626",
    textAlign: "center",
    marginTop: 100,
    fontSize: 16,
    fontWeight: "500",
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: "#1877F2",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 20,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e7eb",
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 30,
    fontWeight: "800",
  },
  headerTitle: {
    fontSize: 18,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    position: "relative",
  },
  productImage: {
    width: width,
    height: 300,
    resizeMode: "cover",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.5)",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#fff",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  productInfo: {
    margin: 16,
    borderRadius: 12,
    padding: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e5e7eb",
  },
  productTitle: {
    marginBottom: 12,
    lineHeight: 28,
  },
  priceContainer: {
    marginBottom: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1877F2",
  },
  discountPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  discountedPrice: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1877F2",
    marginRight: 12,
  },
  originalPrice: {
    fontSize: 16,
    color: "#6b7280",
    textDecorationLine: "line-through",
    marginRight: 12,
  },
  discountBadge: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  metaInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  rating: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "600",
  },
  brand: {
    fontSize: 14,
    color: "#6b7280",
    fontStyle: "italic",
  },
  stockContainer: {
    marginBottom: 16,
  },
  stockText: {
    fontSize: 14,
    fontWeight: "600",
  },
  inStock: {
    color: "#059669",
  },
  outOfStock: {
    color: "#dc2626",
  },
  cartStatusContainer: {
    backgroundColor: "#f0fdf4",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  cartStatusText: {
    color: "#059669",
    fontSize: 14,
    fontWeight: "600",
  },
  categoryText: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
    textTransform: "capitalize",
  },
  tagsContainer: {
    marginBottom: 20,
  },
  tagsLabel: {
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionLabel: {
    marginBottom: 8,
  },
  description: {
    lineHeight: 20,
  },
  infoSection: {
    marginBottom: 16,
  },
  infoLabel: {
    marginBottom: 4,
  },
  infoText: {
    lineHeight: 18,
  },
  actionButtons: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#e5e7eb",
    gap: 12,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  addToCartButtonInCart: {
    backgroundColor: "#f0fdf4",
    borderColor: "#bbf7d0",
  },
  addToCartButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  addToCartButtonTextInCart: {
    color: "#059669",
  },
  buyButton: {
    flex: 1,
    backgroundColor: "#1877F2",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  buttonDisabled: {
    backgroundColor: "#e5e7eb",
    opacity: 0.6,
  },
});
