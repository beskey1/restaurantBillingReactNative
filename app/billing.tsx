// Invoice.tsx
import * as Print from 'expo-print';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { saveOrder } from './_db/database';
import { useCart } from './_store/cart';

import { useSafeAreaInsets } from 'react-native-safe-area-context';




export default function Invoice() {
  const { cart, clear } = useCart();
  const router = useRouter();
  const total = cart.reduce((t, i) => t + i.price * i.qty, 0);
  const currentDate = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  const insets = useSafeAreaInsets();
  const handleSave = () => {
   saveOrder(cart, total, () => {
  clear();
  Alert.alert('Success', 'Order saved successfully!', [
    {
      text: 'OK',
      onPress: () => {
        router.replace('/(tabs)/orders'); // Navigate to Orders page
      },
    },
  ]);
});
  };

  const handlePrint = async () => {
  if (cart.length === 0) return;

  try {
    // 1️⃣ Save order
    await new Promise<void>((resolve) => saveOrder(cart, total, resolve));

    // 2️⃣ Generate HTML for PDF (using current cart)
    const itemsHTML = cart.map(item => `
      <tr>
        <td>${item.name}</td>
        <td style="text-align:center;">${item.qty}</td>
        <td style="text-align:right;">₹${item.price}</td>
        <td style="text-align:right;">₹${item.price * item.qty}</td>
      </tr>
    `).join('');

        const html = `
        <div style="font-family: sans-serif; padding:20px;">
          <h1 style="text-align:center; color:#222; margin-bottom:4px;">Muniyandi Vilas</h1>
          <p style="text-align:center; color:#666; margin:0;">121, Shivam Complex, No.1 Tollgate</p>
          <p style="text-align:center; color:#666; margin:0;">Tiruchirapally, Tamilnadu - 621216</p>
          <p style="text-align:center; color:#666; margin-bottom:10px;">Phone: +91 9025756431</p>
          <hr style="margin:12px 0;" />
          <h2 style="text-align:center; color:#333;">INVOICE</h2>
          <p style="text-align:center; color:#666;">${currentDate}</p>

          <table style="width:100%; border-collapse: collapse; margin-top:16px;" border="1">
            <thead>
              <tr style="background-color:#f5f5f5;">
                <th style="padding:4px 8px;">Item</th>
                <th style="padding:4px 8px;">Qty</th>
                <th style="padding:4px 8px;">Price</th>
                <th style="padding:4px 8px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>

          <div style="display:flex; justify-content:flex-end; margin-top:12px; font-size:18px; font-weight:bold;">
            <span>Total: ₹${total}</span>
          </div>

          <p style="text-align:center; margin-top:20px; color:#666; font-style:italic;">Thank you for your visit!</p>
        </div>
      `;


    // 3️⃣ Print PDF
    const { uri: pdfUri } = await Print.printToFileAsync({ html });
    await Print.printAsync({ uri: pdfUri });

    // 4️⃣ Only now clear cart & navigate
    clear();
    Alert.alert('Success', 'Order saved & sent to printer!', [
      { text: 'OK', onPress: () => router.replace('/(tabs)/menu') },
    ]);

  } catch (err) {
    console.error(err);
    Alert.alert('Error', 'Failed to print invoice.');
  }
};


  const handleCancel = () => router.back();

  if (cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No items to invoice</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/(tabs)/menu')}>
          <Text style={styles.backBtnText}>Go to Menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (

    <View style={styles.container}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#e0e0e0' }}>
      <ScrollView style={styles.invoiceContainer}>
        {/* UI preview */}
        <View style={styles.header}>
          <Text style={styles.restaurantName}>Muniyandi Vilas</Text>
          <Text style={styles.headerSubtext}>121, Shivam Complex, No.1 Tollgate</Text>
          <Text style={styles.headerSubtext}>Tiruchirapally, Tamilnadu - 621216</Text>
          <Text style={styles.headerSubtext}>Phone: +91 9025756431</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoSection}>
          <Text style={styles.invoiceTitle}>INVOICE</Text>
          <Text style={styles.dateText}>{currentDate}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { flex: 2 }]}>Item</Text>
          <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'center' }]}>Qty</Text>
          <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Price</Text>
          <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Total</Text>
        </View>

        {cart.map((item: any) => (
          <View key={item.id} style={styles.tableRow}>
            <Text style={[styles.tableCellText, { flex: 2 }]}>{item.name}</Text>
            <Text style={[styles.tableCellText, { flex: 1, textAlign: 'center' }]}>{item.qty}</Text>
            <Text style={[styles.tableCellText, { flex: 1, textAlign: 'right' }]}>{`₹${item.price}`}</Text>
            <Text style={[styles.tableCellText, { flex: 1, textAlign: 'right' }]}>{`₹${item.price * item.qty}`}</Text>
          </View>
        ))}

        <View style={styles.divider} />

        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalAmount}>₹{total}</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.footerText}>Thank you for your visit!</Text>
      </ScrollView>


  <View style={styles.actionButtons}>
    <TouchableOpacity style={[styles.button, styles.cancelBtn]} onPress={handleCancel}>
      <Text style={styles.cancelBtnText}>Cancel</Text>
    </TouchableOpacity>

    <TouchableOpacity style={[styles.button, styles.saveBtn]} onPress={handleSave}>
      <Text style={styles.buttonText}>Save</Text>
    </TouchableOpacity>

    <TouchableOpacity style={[styles.button, styles.printBtn]} onPress={handlePrint}>
      <Text style={styles.buttonText}>Print & Save</Text>
    </TouchableOpacity>
  </View>
</SafeAreaView>

    </View>
  );
}



// --- Styles remain the same ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e0e0e0' },
  invoiceContainer: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 12,
    padding: 20,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  header: { alignItems: 'center', marginBottom: 16 },
  restaurantName: { fontSize: 24, fontWeight: 'bold', color: '#222', marginBottom: 8 },
  headerSubtext: { fontSize: 14, color: '#666', marginBottom: 2 },
  divider: { height: 1, backgroundColor: '#ddd', marginVertical: 12 },
  infoSection: { alignItems: 'center', marginBottom: 8 },
  invoiceTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  dateText: { fontSize: 14, color: '#666', marginTop: 4 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f5f5f5', padding: 10, borderRadius: 4 },
  tableHeaderText: { fontSize: 14, fontWeight: '700', color: '#333' },
  tableRow: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  tableCellText: { fontSize: 15, color: '#444' },
  totalSection: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 10 },
  totalLabel: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  totalAmount: { fontSize: 24, fontWeight: 'bold', color: '#0a84ff' },
  footerText: { textAlign: 'center', fontSize: 14, color: '#666', fontStyle: 'italic', marginTop: 8 },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  button: { flex: 1, paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  cancelBtn: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd' },
  cancelBtnText: { color: '#666', fontSize: 16, fontWeight: '600' },
  saveBtn: { backgroundColor: '#34c759' },
  printBtn: { backgroundColor: '#0a84ff' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { fontSize: 18, color: '#666', marginBottom: 20 },
  backBtn: { backgroundColor: '#0a84ff', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  backBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
