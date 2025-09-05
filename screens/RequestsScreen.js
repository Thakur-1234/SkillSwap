import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { auth, db } from "../config/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { sendLocalNotification } from "../utils/notifications";
import EmptyState from "../components/EmptyState";

export default function RequestsScreen({ route }) {
  const { prefill } = route.params || {};
  const [requests, setRequests] = useState([]);
  const [handledPrefill, setHandledPrefill] = useState(false);

  // 🔹 Prefill se ek hi baar request create
  useEffect(() => {
    const createPrefill = async () => {
      if (!prefill || handledPrefill) return;
      const uid = auth.currentUser.uid;

      if (prefill.userId === uid) {
        Alert.alert("Info", "❌ You cannot request your own post.");
        setHandledPrefill(true);
        return;
      }

      try {
        const q = query(
          collection(db, "requests"),
          where("participants", "array-contains", uid),
          where("toUserId", "==", prefill.userId),
          where("skillTitle", "==", prefill.title)
        );
        const snap = await getDocs(q);

        if (!snap.empty) {
          Alert.alert("Info", "⚠️ You already sent a request for this post.");
          setHandledPrefill(true);
          return;
        }

        await addDoc(collection(db, "requests"), {
          fromUserId: uid,
          fromName: auth.currentUser.displayName || "User",
          toUserId: prefill.userId,
          toName: prefill.userName || "User",
          skillTitle: prefill.title,
          message: `Interested in your ${prefill.type}: ${prefill.title}`,
          participants: [uid, prefill.userId],
          createdAt: serverTimestamp(),
          status: "pending",
        });

        sendLocalNotification("Request sent ✅", `To ${prefill.userName || "User"}`);
      } catch (err) {
        console.log("Error creating request:", err);
        Alert.alert("Error", "Failed to send request. Please try again.");
      } finally {
        setHandledPrefill(true);
      }
    };

    createPrefill();
  }, [prefill, handledPrefill]);

  // 🔹 Load requests in realtime
  useEffect(() => {
    const uid = auth.currentUser.uid;
    const q = query(
      collection(db, "requests"),
      where("participants", "array-contains", uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setRequests(data);
    });

    return () => unsub();
  }, []);

  return (
    <View style={{ flex: 1, padding: 12, backgroundColor: "#f0f9ff" }}>
      <FlatList
        data={requests}
        keyExtractor={(i) => i.id}
        ListEmptyComponent={<EmptyState title="No requests yet." />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 16,
              backgroundColor: "#e0f2fe", // soft blue card
              borderRadius: 12,
              marginVertical: 6,
              shadowColor: "#000",
              shadowOpacity: 0.03,
              shadowRadius: 4,
              elevation: 1, // minimal shadow
            }}
          >
            <Text style={{ fontWeight: "700", fontSize: 16, color: "#1e3a8a" }}>
              {item.skillTitle}
            </Text>
            <Text style={{ color: "#374151", marginTop: 4, fontSize: 14 }}>
              From: {item.fromName} → To: {item.toName}
            </Text>
            <Text
              style={{
                color: item.status === "pending" ? "#f59e0b" : "#10b981", // yellow for pending, green for accepted
                marginTop: 2,
                fontSize: 13,
                fontWeight: "600",
              }}
            >
              Status: {item.status}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
