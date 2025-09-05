import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { auth, db } from "../config/firebase";
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

export default function RatingsScreen() {
  const [users, setUsers] = useState([]); // all users except me
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");

  // fetch all users from Firestore (excluding me)
  useEffect(() => {
    const fetchUsers = async () => {
      const snap = await getDocs(collection(db, "users"));
      const list = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((u) => u.id !== auth.currentUser.uid); // 🚫 remove me
      setUsers(list);
      setFilteredUsers(list);
    };
    fetchUsers();
  }, []);

  // search filter
  useEffect(() => {
    if (!search.trim()) {
      setFilteredUsers(users);
    } else {
      const lower = search.toLowerCase();
      setFilteredUsers(
        users.filter(
          (u) =>
            u.displayName?.toLowerCase().includes(lower) ||
            u.email?.toLowerCase().includes(lower)
        )
      );
    }
  }, [search, users]);

  const submit = async () => {
    if (!selectedUser) return alert("⚠️ Select a user first!");
    if (!stars) return alert("⚠️ Select stars");

    await addDoc(collection(db, "ratings"), {
      fromUserId: auth.currentUser.uid,
      toUserId: selectedUser.id,
      stars,
      comment,
      createdAt: serverTimestamp(),
    });

    setSelectedUser(null);
    setStars(5);
    setComment("");
    setSearch("");
    alert("✅ Rating submitted!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Give a Rating</Text>

      {/* Search User */}
      <TextInput
        style={styles.input}
        placeholder="Search user by name or email..."
        value={search}
        onChangeText={setSearch}
      />

      {search.length > 0 && !selectedUser && (
        <FlatList
          data={filteredUsers}
          keyExtractor={(i) => i.id}
          style={styles.searchList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.userRow}
              onPress={() => setSelectedUser(item)}
            >
              <Text style={styles.userName}>
                {item.displayName || "Unnamed User"}
              </Text>
              <Text style={styles.userEmail}>{item.email}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={{ opacity: 0.6, padding: 8 }}>No users found</Text>
          }
        />
      )}

      {selectedUser && (
        <View style={styles.selectedBox}>
          <Text style={{ fontWeight: "700" }}>Selected User:</Text>
          <Text>{selectedUser.displayName || selectedUser.email}</Text>
          <TouchableOpacity
            onPress={() => setSelectedUser(null)}
            style={styles.removeBtn}
          >
            <Text style={{ color: "#fff", textAlign: "center" }}>Change</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Stars */}
      <Text style={styles.label}>Select Stars</Text>
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((n) => (
          <TouchableOpacity key={n} onPress={() => setStars(n)}>
            <Text style={[styles.star, stars >= n && styles.starActive]}>
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Comment */}
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: "top" }]}
        placeholder="Write your comment..."
        value={comment}
        onChangeText={setComment}
        multiline
      />

      {/* Submit */}
      <TouchableOpacity style={styles.btn} onPress={submit}>
        <Text style={styles.btnText}>Submit Rating</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    fontSize: 15,
  },
  searchList: {
    maxHeight: 150,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    marginBottom: 10,
  },
  userRow: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  userName: { fontWeight: "600" },
  userEmail: { fontSize: 13, opacity: 0.7 },
  selectedBox: {
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  removeBtn: {
    backgroundColor: "#ef4444",
    padding: 6,
    borderRadius: 6,
    marginTop: 8,
  },
  label: { fontSize: 16, fontWeight: "600", marginTop: 12 },
  starsRow: { flexDirection: "row", marginVertical: 8 },
  star: { fontSize: 32, color: "#d1d5db", marginRight: 8 },
  starActive: { color: "#facc15" }, // yellow
  btn: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
});
