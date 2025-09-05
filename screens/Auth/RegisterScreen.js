import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../../config/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { registerForPushNotificationsAsync } from "../../utils/notifications";

export default function RegisterScreen({ navigation }) {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!res.canceled) setImage(res.assets[0].uri);
  };

  const onRegister = async () => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email.trim(), password);

      let photoURL = "";
      if (image) {
        const blob = await (await fetch(image)).blob();
        const r = ref(storage, `profilePics/${user.uid}.jpg`);
        await uploadBytes(r, blob);
        photoURL = await getDownloadURL(r);
      }

      await updateProfile(user, { displayName, photoURL });

      const expoPushToken = await registerForPushNotificationsAsync();

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName,
        photoURL,
        skills: [],
        expoPushToken: expoPushToken || "",
        createdAt: serverTimestamp(),
      });

      navigation.replace("Main");
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✨ Create Your Account</Text>

      {/* Profile Image */}
      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        <Image
          source={{ uri: image || "https://via.placeholder.com/150" }}
          style={styles.image}
        />
        <Text style={styles.imageText}>Tap to choose profile picture</Text>
      </TouchableOpacity>

      {/* Input Fields */}
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#888"
        value={displayName}
        onChangeText={setDisplayName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Signup Button */}
      <TouchableOpacity style={styles.btn} onPress={onRegister}>
        <Text style={styles.btnText}>🚀 Sign Up</Text>
      </TouchableOpacity>

      {/* Already account */}
      <TouchableOpacity onPress={() => navigation.replace("Login")}>
        <Text style={styles.switchText}>
          Already have an account? <Text style={{ color: "#2563eb", fontWeight: "700" }}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#f9fafb" },
  title: { fontSize: 28, fontWeight: "800", textAlign: "center", marginBottom: 24, color: "#111827" },
  imagePicker: { alignItems: "center", marginBottom: 16 },
  image: { width: 120, height: 120, borderRadius: 60, backgroundColor: "#eee" },
  imageText: { marginTop: 6, fontSize: 12, color: "#6b7280" },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    padding: 14,
    borderRadius: 10,
    marginVertical: 8,
    backgroundColor: "#fff",
    fontSize: 15,
  },
  btn: {
    backgroundColor: "#16a34a",
    padding: 15,
    borderRadius: 10,
    marginTop: 14,
    shadowColor: "#16a34a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "700", fontSize: 16 },
  switchText: { textAlign: "center", marginTop: 16, fontSize: 14, color: "#374151" },
});
