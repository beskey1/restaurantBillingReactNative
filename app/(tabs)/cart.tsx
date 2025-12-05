import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCart } from '../_store/cart';

export default function Cart() {
  const { cart, addItem, decreaseQty, removeItem } = useCart();
  const router = useRouter();
  const total = cart.reduce((t, i) => t + i.price * i.qty, 0);

  const goToInvoice = () => {
    router.push('/billing'); // Navigate to invoice screen
  };

  const handleDecrease = (itemId: number) => {
    const item = cart.find((i) => i.id === itemId);
    if (item && item.qty === 1) {
      removeItem(itemId);
    } else {
      decreaseQty(itemId);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>₹{item.price} </Text>
      </View>

      <View style={styles.rightSection}>
        <View style={styles.counterContainer}>
          <TouchableOpacity
            style={styles.counterBtn}
            onPress={() => handleDecrease(item.id)}
          >
            <Text style={styles.counterText}>−</Text>
          </TouchableOpacity>

          <Text style={styles.qtyText}>{item.qty}</Text>

          <TouchableOpacity
            style={styles.counterBtn}
            onPress={() => addItem({ ...item, qty: 1 })}
          >
            <Text style={styles.counterText}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.itemTotal}>₹{item.price * item.qty}</Text>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Your cart is empty</Text>
      <Text style={styles.emptySubtext}>Add items from the menu</Text>
    </View>
  );

return (
  <View style={styles.container}>
    {/* Top Bar */}
    <View style={styles.topBar}>
      <Text style={styles.header}>Cart</Text>
    </View>

    {/* ⭐ FIX: give FlatList scroll height */}
    <View style={{ flex: 1 }}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={true}
      />
    </View>

    {cart.length > 0 && (
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>₹{total}</Text>
        </View>

        <TouchableOpacity style={styles.checkoutBtn} onPress={goToInvoice}>
          <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    )}
  </View>
);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0e0e0",
  },
  topBar: {
    paddingTop: 50, // space for front camera / notch
    paddingBottom: 16,
    backgroundColor: "#0a84ff", // highlighted top bar
    alignItems: "center",
    elevation: 4, // shadow Android
    shadowColor: "#000", // shadow iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff", // white text on top bar
  },
  listContent: {
    padding: 12,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 2,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 18, fontWeight: "600", color: "#222" },
  itemPrice: { fontSize: 14, color: "#666", marginTop: 4 },
  rightSection: { alignItems: "flex-end", gap: 8 },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0a84ff",
    borderRadius: 8,
    overflow: "hidden",
  },
  counterBtn: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: "#0a84ff" },
  counterText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  qtyText: { color: "#fff", fontSize: 16, fontWeight: "600", paddingHorizontal: 12, minWidth: 35, textAlign: "center" },
  itemTotal: { fontSize: 16, fontWeight: "700", color: "#0a84ff" },
  separator: { height: 12 },
  footer: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  totalContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  totalLabel: { fontSize: 20, fontWeight: "600", color: "#333" },
  totalAmount: { fontSize: 24, fontWeight: "bold", color: "#0a84ff" },
checkoutBtn: {
  backgroundColor: "#0a84ff",
  paddingVertical: 12,
  borderRadius: 8,
  alignItems: "center",
  marginHorizontal: 4,        // ⭐ small side margin
},

checkoutBtnText: {
  color: "#fff",
  fontSize: 16,               // ↓ reduced from 18
  fontWeight: "600",          // ↓ reduced from 700
},

  emptyContainer: { alignItems: "center", justifyContent: "center", paddingVertical: 60 },
  emptyText: { fontSize: 20, fontWeight: "600", color: "#666" },
  emptySubtext: { fontSize: 16, color: "#999", marginTop: 8 },
});