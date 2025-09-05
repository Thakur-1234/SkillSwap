import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { auth, db } from "../config/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function SkillPostScreen() {
  const [type, setType] = useState("offer");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageBase64, setImageBase64] = useState(null);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true, // Base64 string enable
      quality: 0.5   // Compress image (0–1 range)
    });
    if (!res.canceled) {
      setImageBase64(res.assets[0].base64);
    }
  };

  const submit = async () => {
    if (!title.trim()) return alert("Please add a title");

    await addDoc(collection(db, "skills"), {
      userId: auth.currentUser.uid,
      userName: auth.currentUser.displayName || "User",
      type,
      title,
      description,
      imageBase64: imageBase64 || "",
      createdAt: serverTimestamp()
    });

    setTitle("");
    setDescription("");
    setImageBase64(null);
    alert("✅ Posted Successfully!");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Create a Skill Post</Text>

      {/* Toggle */}
      <View style={styles.toggle}>
        <TouchableOpacity
          style={[styles.chip, type === "offer" && styles.activeChip]}
          onPress={() => setType("offer")}
        >
          <Text style={[styles.chipText, type === "offer" && styles.activeChipText]}>
            Offer
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.chip, type === "request" && styles.activeChip]}
          onPress={() => setType("request")}
        >
          <Text style={[styles.chipText, type === "request" && styles.activeChipText]}>
            Request
          </Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <TextInput
        style={styles.input}
        placeholder="🎯 Title (e.g., Teach Guitar / Need Python Help)"
        value={title}
        onChangeText={setTitle}
      />

      {/* Description */}
      <TextInput
        style={[styles.input, { height: 120, textAlignVertical: "top" }]}
        placeholder="📝 Description"
        multiline
        value={description}
        onChangeText={setDescription}
      />

      {/* Image Preview */}
      {imageBase64 ? (
        <Image
          source={{ uri: "data:image/jpeg;base64," + imageBase64 }}
          style={styles.preview}
        />
      ) : (
        <View style={styles.placeholder}>
          <Text style={{ color: "#9ca3af" }}>No image selected</Text>
        </View>
      )}

      {/* Pick Image */}
      <TouchableOpacity style={styles.outlineBtn} onPress={pickImage}>
        <Text style={styles.outlineText}>📸 Pick an Image</Text>
      </TouchableOpacity>

      {/* Post */}
      <TouchableOpacity style={styles.btn} onPress={submit}>
        <Text style={styles.btnText}>🚀 Post Skill</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 16
  },
  header: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 14,
    textAlign: "center",
    color: "#111827"
  },
  toggle: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
    gap: 12
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#fff",
    elevation: 2
  },
  chipText: {
    fontWeight: "600",
    color: "#374151"
  },
  activeChip: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb"
  },
  activeChipText: {
    color: "#fff"
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 14,
    borderRadius: 10,
    marginVertical: 8,
    fontSize: 15,
    elevation: 1
  },
  preview: {
    height: 180,
    borderRadius: 12,
    marginVertical: 10
  },
  placeholder: {
    height: 150,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6"
  },
  outlineBtn: {
    borderWidth: 1,
    borderColor: "#2563eb",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 8
  },
  outlineText: {
    color: "#2563eb",
    fontWeight: "700"
  },
  btn: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    alignItems: "center",
    elevation: 3
  },
  btnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16
  }
});
