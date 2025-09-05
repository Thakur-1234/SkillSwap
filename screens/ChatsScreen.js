import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import { auth, db } from "../config/firebase";
import { collection, onSnapshot, query, where, orderBy, doc, getDoc } from "firebase/firestore";
import EmptyState from "../components/EmptyState";

// 🔹 Cache to prevent unnecessary re-fetch
const userCache = {};

// 🔹 Single chat item without image
const ListItem = React.memo(function ListItem({ item, navigation }) {
  const otherId = item.participants.find((p) => p !== auth.currentUser.uid);

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        backgroundColor: "#e0f2fe", // soft blue card
        borderRadius: 12,
        marginVertical: 6,
      }}
      onPress={() => navigation.navigate("ChatRoom", { chatId: item.id, otherId })}
    >
      {/* Chat details */}
      <View style={{ flex: 1, marginRight: 10 }}>
        <Text
          style={{ fontWeight: "700", fontSize: 16, color: "#1e3a8a" }}
          numberOfLines={1}
        >
          {item.otherUserName}
        </Text>
        <Text
          style={{ fontSize: 14, color: "#374151", marginTop: 2 }}
          numberOfLines={1}
        >
          {item.lastMessage || "Say hi 👋"}
        </Text>
      </View>

      {/* Last message time */}
      <Text style={{ fontSize: 12, color: "#6b7280" }}>
        {item.updatedAt?.toDate
          ? item.updatedAt.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : ""}
      </Text>
    </TouchableOpacity>
  );
});

export default function ChatsScreen({ navigation }) {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", auth.currentUser.uid),
      orderBy("updatedAt", "desc")
    );

    const unsub = onSnapshot(q, async (snap) => {
      const chatData = await Promise.all(
        snap.docs.map(async (d) => {
          const data = d.data();
          const otherId = data.participants.find((p) => p !== auth.currentUser.uid);

          let otherUserName = "Unknown User";

          if (otherId) {
            if (userCache[otherId]) {
              otherUserName = userCache[otherId].name;
            } else {
              try {
                const userRef = doc(db, "users", otherId);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                  const userData = userSnap.data();
                  otherUserName =
                    userData.displayName || userData.email || "Unknown User";

                  userCache[otherId] = { name: otherUserName };
                }
              } catch (err) {
                console.log("Error fetching user:", err);
              }
            }
          }

          return {
            id: d.id,
            ...data,
            otherUserName,
          };
        })
      );
      setChats(chatData);
    });

    return () => unsub();
  }, []);

  const renderItem = useCallback(
    ({ item }) => <ListItem item={item} navigation={navigation} />,
    [navigation]
  );

  return (
    <View style={{ flex: 1, padding: 12, backgroundColor: "#f0f9ff" }}>
      <FlatList
        data={chats}
        keyExtractor={(i) => i.id}
        ListEmptyComponent={<EmptyState title="No chats yet." />}
        renderItem={renderItem}
        extraData={chats}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
