import React from "react";
import { View, Text, StyleSheet } from "react-native";

// This component is shown when there is no data available
export default function EmptyState({ 
  title = "No data found",   // main heading
  subtitle = "Add something new to get started!" // optional sub text
}) {
  return (
    <View style={styles.container}>
      {/* Card container */}
      <View style={styles.card}>
        {/* Emoji icon */}
        <Text style={styles.emoji}>✨</Text>

        {/* Main title */}
        <Text style={styles.title}>{title}</Text>

        {/* Subtitle (only if available) */}
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Whole screen center
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f3f4f6", // soft gray background
  },
  // Card box design
  card: {
    backgroundColor: "#ffffff", // white card
    padding: 24,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
    width: "85%",
  },
  // Big emoji on top
  emoji: {
    fontSize: 42,
    marginBottom: 12,
  },
  // Bold main heading
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937", // dark gray
    textAlign: "center",
  },
  // Light sub text
  subtitle: {
    fontSize: 15,
    color: "#6b7280", // soft gray
    marginTop: 6,
    textAlign: "center",
  },
});
