import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, RefreshControl, StyleSheet } from "react-native";
import { db } from "../config/firebase";
import { collection, onSnapshot, orderBy, query, getDocs } from "firebase/firestore";
import SkillCard from "../components/SkillCard";
import EmptyState from "../components/EmptyState";

export default function HomeScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch latest data (for pull-to-refresh)
  const fetchSkills = useCallback(async () => {
    setRefreshing(true);
    try {
      const q = query(collection(db, "skills"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.log("Error refreshing skills:", err);
    }
    setRefreshing(false);
  }, []);

  // Real-time updates
  useEffect(() => {
    const q = query(collection(db, "skills"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        ListEmptyComponent={<EmptyState title="No skills yet. Be the first to post!" />}
        renderItem={({ item }) => (
          <SkillCard
            item={item}
            onRespond={(it) => navigation.navigate("Requests", { prefill: it })}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchSkills} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "#f9fafb", // Light clean bg
  },
});
