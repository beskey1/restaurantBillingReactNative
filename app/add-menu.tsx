// import * as ImagePicker from "expo-image-picker";
// import { router, Stack, useLocalSearchParams } from "expo-router";
// import React, { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { addMenuItem, updateMenuItem } from "./_db/database";

// export default function AddMenu() {
//   const params = useLocalSearchParams();
//   const editId = params.id ? Number(params.id) : null;

//   const [name, setName] = useState("");
//   const [price, setPrice] = useState("");
//   const [imageUri, setImageUri] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (editId) {
//       setName(String(params.name));
//       setPrice(String(params.price));
//       setImageUri(params.image ? String(params.image) : null);
//     } else {
//       setName("");
//       setPrice("");
//       setImageUri(null);
//     }
//   }, [editId]);

//   const pickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       quality: 0.8,
//     });
//     if (!result.canceled) setImageUri(result.assets[0].uri);
//   };

//   const handleSave = () => {
//     if (!name.trim()) return Alert.alert("Error", "Enter item name");
//     if (!price.trim() || isNaN(Number(price)))
//       return Alert.alert("Error", "Enter valid price");

//     setLoading(true);

//     const done = () => {
//       setLoading(false);
//       router.back();
//     };

//     if (editId) {
//       updateMenuItem(editId, name.trim(), Number(price), imageUri, done);
//     } else {
//       addMenuItem(name.trim(), Number(price), imageUri, done);
//     }
//   };

//   return (
//    <>
//   <Stack.Screen
//     options={{
//       title: editId ? "Edit Item" : "Add Item",
//       headerShown: true,
//       headerTitleAlign: "center",
//     }}
//   />

//   <KeyboardAvoidingView
//     style={{ flex: 1 }}
//     behavior={Platform.OS === "ios" ? "padding" : "height"}
//   >
//     <ScrollView
//       style={styles.container}
//       contentContainerStyle={styles.content}
//       keyboardShouldPersistTaps="handled"
//     >
//       <Text style={styles.header}>
//         {editId ? "Edit Menu Item" : "Add Menu Item"}
//       </Text>

//       {/* Image Picker */}
//       <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
//         {imageUri ? (
//           <Image source={{ uri: imageUri }} style={styles.image} />
//         ) : (
//           <Text style={styles.imagePlaceholderText}>Choose Image</Text>
//         )}
//       </TouchableOpacity>

//       {/* Name */}
//       <View style={styles.group}>
//         <Text style={styles.label}>Item Name</Text>
//         <TextInput
//           style={styles.input}
//           value={name}
//           onChangeText={setName}
//           placeholder="Eg. Chicken Biryani"
//         />
//       </View>

//       {/* Price */}
//       <View style={styles.group}>
//         <Text style={styles.label}>Price</Text>
//         <TextInput
//           style={styles.input}
//           value={price}
//           onChangeText={setPrice}
//           keyboardType="numeric"
//           placeholder="Eg. 180"
//         />
//       </View>

//       {/* Save */}
//       <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
//         {loading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.saveBtnText}>
//             {editId ? "Update Item" : "Save Item"}
//           </Text>
//         )}
//       </TouchableOpacity>
//     </ScrollView>
//   </KeyboardAvoidingView>
// </>
//   );
// }

// // ==========================
// // Styles
// // ==========================
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f6f7fb",
//   },
//   content: {
//     padding: 20,
//   },
//   header: {
//     fontSize: 22,
//     fontWeight: "700",
//     marginBottom: 25,
//     color: "#000",
//   },
//   imagePicker: {
//     width: "100%",
//     height: 200,
//     borderRadius: 12,
//     backgroundColor: "#fff",
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 1.5,
//     borderColor: "#ddd",
//     borderStyle: "dashed",
//     marginBottom: 30,
//     overflow: "hidden",
//   },
//   image: {
//     width: "100%",
//     height: "100%",
//   },
//   imagePlaceholderText: {
//     color: "#999",
//     fontSize: 16,
//   },
//   group: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: "600",
//     marginBottom: 8,
//     color: "#444",
//   },
//   input: {
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     padding: 14,
//     fontSize: 16,
//     borderWidth: 1,
//     borderColor: "#ddd",
//   },
//   saveBtn: {
//     backgroundColor: "#007aff",
//     padding: 16,
//     borderRadius: 10,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   saveBtnText: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#fff",
//   },
// });



import * as ImagePicker from "expo-image-picker";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { addMenuItem, updateMenuItem } from "./_db/database";

export default function AddMenu() {
  const params = useLocalSearchParams();
  const editId = params.id ? Number(params.id) : null;

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editId) {
      setName(String(params.name));
      setPrice(String(params.price));
      setImageUri(params.image ? String(params.image) : null);
    } else {
      setName("");
      setPrice("");
      setImageUri(null);
    }
  }, [editId]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.8,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const handleSave = () => {
    if (!name.trim()) return Alert.alert("Error", "Enter item name");
    if (!price.trim() || isNaN(Number(price)))
      return Alert.alert("Error", "Enter valid price");

    setLoading(true);

    const done = () => {
      setLoading(false);
      router.back();
    };

    if (editId) {
      updateMenuItem(editId, name.trim(), Number(price), imageUri, done);
    } else {
      addMenuItem(name.trim(), Number(price), imageUri, done);
    }
  };

  return (
    <>
      {/* Top Bar */}
      <Stack.Screen
        options={{
          title: editId ? "Edit Item" : "Add Item",
          headerShown: true,
          headerTitleAlign: "center",
        }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            style={styles.container}
            contentContainerStyle={{ ...styles.content, flexGrow: 1, justifyContent: "space-between" }}
            keyboardShouldPersistTaps="handled"
          >
            <View>
              <Text style={styles.header}>
                {editId ? "Edit Menu Item" : "Add Menu Item"}
              </Text>

              {/* Image Picker */}
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={styles.image} />
                ) : (
                  <Text style={styles.imagePlaceholderText}>Choose Image</Text>
                )}
              </TouchableOpacity>

              {/* Name */}
              <View style={styles.group}>
                <Text style={styles.label}>Item Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Eg. Chicken Biryani"
                />
              </View>

              {/* Price */}
              <View style={styles.group}>
                <Text style={styles.label}>Price</Text>
                <TextInput
                  style={styles.input}
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                  placeholder="Eg. 180"
                />
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveBtnText}>
                  {editId ? "Update Item" : "Save Item"}
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
}

// ==========================
// Styles
// ==========================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7fb",
  },
  content: {
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 25,
    color: "#000",
  },
  imagePicker: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#ddd",
    borderStyle: "dashed",
    marginBottom: 30,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholderText: {
    color: "#999",
    fontSize: 16,
  },
  group: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#444",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  saveBtn: {
    backgroundColor: "#007aff",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,

  },
  saveBtnText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
});
