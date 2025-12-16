import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getOrderItemsByOrder, getOrders, Order } from "../_db/database";

import { backupAndResetOrders } from "../_backup/backupAndReset";


export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [orderItemsMap, setOrderItemsMap] = useState<{ [key: number]: any[] }>({});

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    getOrders(setOrders);
  };

  const toggleExpand = (orderId: number) => {
    if (expandedId === orderId) {
      setExpandedId(null);
      return;
    }

    setExpandedId(orderId);

    // Fetch items only if not already loaded
    if (!orderItemsMap[orderId]) {
      getOrderItemsByOrder(orderId, (items) => {
        setOrderItemsMap((prev) => ({ ...prev, [orderId]: items }));
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const renderOrder = ({ item }: { item: Order }) => {
    const isExpanded = expandedId === item.id;
    const items = orderItemsMap[item.id] || [];

    return (
      <View style={styles.card}>
        <TouchableOpacity style={styles.orderHeader} onPress={() => toggleExpand(item.id)}>
          <View>
            <Text style={styles.orderId}>Order #{item.id}</Text>
            <Text style={styles.orderDate}>{formatDate(item.created_at)}</Text>
          </View>
          <View style={styles.orderRight}>
            <Text style={styles.orderTotal}>₹{item.total}</Text>
            <Text style={styles.expandIcon}>{isExpanded ? "▲" : "▼"}</Text>
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.itemsContainer}>
            <View style={styles.divider} />
            {items.map((orderItem, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={styles.itemName}>{orderItem.name}</Text>
                <Text style={styles.itemQty}>x{orderItem.qty}</Text>
                <Text style={styles.itemPrice}>₹{orderItem.price * orderItem.qty}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No orders yet</Text>
      <Text style={styles.emptySubtext}>Your order history will appear here</Text>
    </View>
  );

//   return (
//   <View style={styles.container}>
//     <View style={styles.topBar}>
//       <Text style={styles.header}>Orders History</Text>
//     </View>

//     <FlatList
//       data={orders}
//       keyExtractor={(item) => item.id.toString()}
//       renderItem={renderOrder}
//       ListEmptyComponent={renderEmpty}
//       ItemSeparatorComponent={() => <View style={styles.separator} />}
//       contentContainerStyle={styles.listContent}
//     />
//   </View>

// );

return (
  <View style={styles.container}>
    {/* TOP BAR */}
    <View style={styles.topBar}>
      <Text style={styles.header}>Orders History</Text>

      <TouchableOpacity
        style={styles.resetBtn}
        onPress={() => {
          Alert.alert(
            "Backup & Reset",
            "This will email PDF + JSON backup and permanently clear all orders.",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Backup & Reset",
                style: "destructive",
               onPress: async () => {
                  try {
                    await backupAndResetOrders();
                    loadOrders();
                    Alert.alert("Success", "Backup completed and orders cleared");
                  } catch (err: any) {
                    Alert.alert("Backup Failed", err.message || "Something went wrong");
                  }
                },
              },
            ]
          );
        }}
      >
        <Text style={styles.resetText}>RESET</Text>
      </TouchableOpacity>
    </View>

    {/* ORDERS LIST */}
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderOrder}
      ListEmptyComponent={renderEmpty}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      contentContainerStyle={styles.listContent}
    />
  </View>
);


}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e0e0e0" },
  topBar: {
  paddingTop: 50,
  paddingBottom: 16,
  backgroundColor: "#530079ff",
  alignItems: "center",
  elevation: 4,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
},

header: {
  fontSize: 24,
  fontWeight: "bold",
  color: "#fff",
},


  listContent: { padding: 12, paddingBottom: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    overflow: "hidden",
  },
  orderHeader: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderId: { fontSize: 18, fontWeight: "700", color: "#222" },
  orderDate: { fontSize: 14, color: "#666", marginTop: 4 },
  orderRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  orderTotal: { fontSize: 20, fontWeight: "700", color: "#530079ff" },
  expandIcon: { fontSize: 12, color: "#666" },
  itemsContainer: { paddingHorizontal: 16, paddingBottom: 12 },
  divider: { height: 1, backgroundColor: "#eee", marginBottom: 12 },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 6,
    marginBottom: 8,
  },
  itemName: { flex: 2, fontSize: 15, color: "#333" },
  itemQty: { flex: 1, fontSize: 15, color: "#666", textAlign: "center" },
  itemPrice: { flex: 1, fontSize: 15, fontWeight: "600", color: "#530079ff", textAlign: "right" },
  separator: { height: 12 },
  emptyContainer: { alignItems: "center", justifyContent: "center", paddingVertical: 60 },
  emptyText: { fontSize: 20, fontWeight: "600", color: "#666" },
  emptySubtext: { fontSize: 16, color: "#999", marginTop: 8 },
  resetBtn: {
  position: "absolute",
  right: 16,
  bottom: 16,
  paddingHorizontal: 14,
  paddingVertical: 8,
  backgroundColor: "#ff3b30",
  borderRadius: 6,
},

resetText: {
  color: "#fff",
  fontWeight: "700",
  fontSize: 14,
},

});
