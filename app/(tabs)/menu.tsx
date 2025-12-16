import { router, useFocusEffect } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import {
  MenuItem,
  deleteMenuItem,
  getMenuItems,
  initDB,
} from "../_db/database";
import { useCart } from "../_store/cart";


export default function Menu() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const { cart, addItem, decreaseQty, removeItem } = useCart();
  const swipeableRefs = useRef<Record<number, Swipeable | null>>({});

  useEffect(() => {
    initDB();
    loadMenu();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadMenu();
    }, [])
  );

  const loadMenu = () => {
    // Close all open swipeables
    Object.values(swipeableRefs.current).forEach((ref) => ref?.close());
    getMenuItems(setMenu);
  };

  const getItemQty = (itemId: number) => {
    const cartItem = cart.find((i) => i.id === itemId);
    return cartItem ? cartItem.qty : 0;
  };

  const handleAdd = (item: MenuItem) => {
    addItem({ ...item, qty: 1 });
  };

  const handleIncrease = (item: MenuItem) => {
    addItem({ ...item, qty: 1 });
  };

  const handleDecrease = (itemId: number) => {
    const qty = getItemQty(itemId);
    if (qty === 1) removeItem(itemId);
    else decreaseQty(itemId);
  };

  const navigateToAddMenu = () => {
    router.push("/add-menu");
  };

  const navigateToCart = () => {
    router.push("/cart");
  };

  const getTotalItems = () => {
    return cart.length; // Returns number of unique items
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  };

  const renderRightActions = (item: MenuItem) => (
    <View style={{ flexDirection: "row" }}>
      {/* DELETE */}
      <TouchableOpacity
        style={[styles.swipeBtn, { backgroundColor: "red" }]}
        onPress={() => {
          Alert.alert(
            "Delete Item",
            `Are you sure you want to delete ${item.name}?`,
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Delete",
                style: "destructive",
                onPress: () => {
                  deleteMenuItem(item.id, () => loadMenu());
                },
              },
            ]
          );
        }}
      >
        <Text style={styles.swipeText}>Delete</Text>
      </TouchableOpacity>

      {/* EDIT */}
      <TouchableOpacity
        style={[styles.swipeBtn, { backgroundColor: "#530079ff" }]}
        onPress={() => {
          router.push({
            pathname: "/add-menu",
            params: {
              id: item.id.toString(),
              name: item.name,
              price: item.price.toString(),
              image: item.image ?? "",
            },
          });
        }}
      >
        <Text style={styles.swipeText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }: { item: MenuItem }) => {
    const qty = getItemQty(item.id);

    return (
      <Swipeable
        ref={(ref) => {
          swipeableRefs.current[item.id] = ref;
        }}
        renderRightActions={() => renderRightActions(item)}
      >
        <View style={styles.card}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.itemImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderEmoji}>🍽️</Text>
            </View>
          )}

          <View style={styles.details}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>₹{item.price}</Text>
          </View>

          <View style={styles.actions}>
            {qty === 0 ? (
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => handleAdd(item)}
              >
                <Text style={styles.addText}>ADD</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.counterContainer}>
                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() => handleDecrease(item.id)}
                >
                  <Text style={styles.counterText}>−</Text>
                </TouchableOpacity>

                <Text style={styles.qtyText}>{qty}</Text>

                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() => handleIncrease(item)}
                >
                  <Text style={styles.counterText}>+</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Swipeable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.header}>Menu</Text>
        <TouchableOpacity style={styles.addMenuBtn} onPress={navigateToAddMenu}>
          <Text style={styles.addMenuText}>+ Add Item</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={menu}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{ 
          paddingBottom: cart.length > 0 ? 100 : 20, 
          paddingTop: 12 
        }}
        showsVerticalScrollIndicator={false}
      />

      {/* Go to Cart Button */}
      {cart.length > 0 && (
        <View style={styles.cartButtonContainer}>
          <TouchableOpacity 
            style={styles.cartButton} 
            onPress={navigateToCart}
          >
            <View style={styles.cartButtonContent}>
              <View style={styles.cartInfo}>
                <Text style={styles.cartItemCount}>
                  {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
                </Text>
                <Text style={styles.cartDivider}>|</Text>
                <Text style={styles.cartTotal}>₹{getTotalPrice()}</Text>
              </View>
              <Text style={styles.cartButtonText}>Go to Cart</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  topBar: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: "#530079ff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 4,
  },

  header: { fontSize: 24, fontWeight: "bold", color: "#fff" },

  addMenuBtn: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  addMenuText: { color: "#530079ff", fontWeight: "600", fontSize: 14 },

  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    elevation: 2,
  },

  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
  },

  imagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },

  placeholderEmoji: { fontSize: 32 },

  details: { flex: 1, marginLeft: 12 },

  name: { fontSize: 18, fontWeight: "600", color: "#222" },

  price: { fontSize: 15, color: "#555", marginTop: 4 },

  actions: { marginLeft: 8 },

  addBtn: {
    backgroundColor: "#530079ff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  addText: { color: "#fff", fontWeight: "600" },

  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#530079ff",
    borderRadius: 8,
  },

  counterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#530079ff",
    borderRadius: 8,
  },

  counterText: { color: "#fff", fontSize: 20, fontWeight: "600" },

  qtyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    paddingHorizontal: 16,
    minWidth: 40,
    textAlign: "center",
  },

  separator: { height: 12 },

  swipeBtn: {
    justifyContent: "center",
    alignItems: "center",
    width: 90,
    borderRadius: 12,
    marginVertical: 6,
    marginRight: 2,
  },

  swipeText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  // Cart Button Styles
  cartButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  cartButton: {
    backgroundColor: "#530079ff",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },

  cartButtonContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cartInfo: {
    flexDirection: "row",
    alignItems: "center",
  },

  cartItemCount: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  cartDivider: {
    color: "#fff",
    fontSize: 16,
    marginHorizontal: 12,
    opacity: 0.6,
  },

  cartTotal: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  cartButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});