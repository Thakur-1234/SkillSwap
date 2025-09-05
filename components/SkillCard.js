import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

// 🟢 SkillCard shows one skill (offer/request) with details & button
export default function SkillCard({ item, onRespond }) {
  // ✅ Decide image source (Base64 or URI)
  let imageSource = null;
  if (item.imageBase64) {
    imageSource = { uri: "data:image/jpeg;base64," + item.imageBase64 };
  } else if (item.imageUri) {
    imageSource = { uri: item.imageUri };
  }

  return (
    <View style={styles.card}>
      {/* Header → User Name + Skill Type */}
      <View style={styles.header}>
        <Text style={styles.user}>{item.userName}</Text>
        <Text
          style={[
            styles.type,
            {
              backgroundColor: item.type === "offer" ? "#dcfce7" : "#fee2e2", // green for offer, red for request
              color: item.type === "offer" ? "#166534" : "#991b1b", // dark green / dark red text
            },
          ]}
        >
          {item.type.toUpperCase()}
        </Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>{item.title}</Text>

      {/* Description (optional) */}
      {item.description ? <Text style={styles.desc}>{item.description}</Text> : null}

      {/* Image (optional) */}
      {imageSource ? <Image source={imageSource} style={styles.image} /> : null}

      {/* Respond Button */}
      <TouchableOpacity style={styles.btn} onPress={() => onRespond(item)}>
        <Text style={styles.btnText}>🤝 Respond</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // Card container
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  // Header row (username + type tag)
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  user: {
    fontWeight: "600",
    fontSize: 15,
    color: "#111827", // dark gray
  },
  type: {
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    overflow: "hidden",
  },
  // Title text
  title: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 6,
    color: "#1f2937", // dark gray
  },
  // Description text
  desc: {
    fontSize: 14,
    color: "#4b5563", // medium gray
    marginBottom: 10,
  },
  // Skill image
  image: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    marginBottom: 12,
  },
  // Respond button
  btn: {
    backgroundColor: "#2563eb", // blue
    paddingVertical: 12,
    borderRadius: 12,
  },
  btnText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 15,
  },
});
