// import React from "react";
// import { View, Text, TouchableOpacity, StyleSheet, Pressable, Animated } from "react-native";

// export default function RequestCard({ req, onAccept, onOpenChat }) {
//   return (
//     <Pressable
//       style={({ pressed }) => [
//         styles.card,
//         { transform: [{ scale: pressed ? 0.98 : 1 }] },
//       ]}
//     >
//       {/* Title */}
//       <Text style={styles.title}>{req.skillTitle}</Text>

//       {/* Meta Info */}
//       <Text style={styles.meta}>From: {req.fromName || req.fromUserId}</Text>
//       <Text style={styles.meta}>To: {req.toName || req.toUserId}</Text>

//       {/* Message */}
//       <Text style={styles.message}>{req.message}</Text>

//       {/* Action Buttons */}
//       <View style={styles.actions}>
//         {onAccept ? (
//           <TouchableOpacity
//             style={styles.accept}
//             activeOpacity={0.8}
//             onPress={() => onAccept(req)}
//           >
//             <Text style={styles.btnText}>✅ Accept & Chat</Text>
//           </TouchableOpacity>
//         ) : null}

//         {onOpenChat ? (
//           <TouchableOpacity
//             style={styles.chat}
//             activeOpacity={0.8}
//             onPress={() => onOpenChat(req)}
//           >
//             <Text style={styles.btnText}>💬 Open Chat</Text>
//           </TouchableOpacity>
//         ) : null}
//       </View>
//     </Pressable>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 14,
//     marginVertical: 10,
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 6,
//     elevation: 3,
//     borderWidth: 1,
//     borderColor: "#f0f0f0",
//   },
//   title: { fontSize: 18, fontWeight: "700", color: "#111" },
//   meta: { fontSize: 13, color: "#666", marginTop: 3 },
//   message: { marginTop: 8, fontSize: 14, color: "#333", lineHeight: 20 },
//   actions: {
//     flexDirection: "row",
//     gap: 10,
//     marginTop: 14,
//     justifyContent: "flex-end",
//   },
//   accept: {
//     backgroundColor: "#16a34a",
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     borderRadius: 10,
//   },
//   chat: {
//     backgroundColor: "#2563eb",
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     borderRadius: 10,
//   },
//   btnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
// });
