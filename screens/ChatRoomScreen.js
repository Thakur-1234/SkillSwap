import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Animated,
} from "react-native";
import { auth, db } from "../config/firebase";
import {
  addDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";

export default function ChatRoomScreen({ route }) {
  const { chatId, otherId } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const paddingAnim = useRef(new Animated.Value(10)).current; // Initial padding bottom

  // 🔹 Ensure chat document exists
  useEffect(() => {
    const checkOrCreateChat = async () => {
      const chatRef = doc(db, "chats", chatId);
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        await setDoc(chatRef, {
          participants: [auth.currentUser.uid, otherId],
          lastMessage: "",
          updatedAt: serverTimestamp(),
        });
      }
    };

    checkOrCreateChat();
  }, [chatId, otherId]);

  // 🔹 Load messages in realtime
  useEffect(() => {
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const allMsgs = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setMessages(allMsgs);
    });

    return () => unsub();
  }, [chatId]);

  // 🔹 Send message
  const sendMessage = async () => {
    if (input.trim() === "") return;

    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: input,
      userId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
    });

    await setDoc(
      doc(db, "chats", chatId),
      {
        lastMessage: input,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    setInput("");
  };

  // 🔹 Keyboard listeners for dynamic padding
  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      Animated.timing(paddingAnim, {
        toValue: e.endCoordinates.height-170, // Add extra padding when keyboard shows
        duration: 250,
        useNativeDriver: false,
      }).start();
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      Animated.timing(paddingAnim, {
        toValue: 10, // Reset padding when keyboard hides
        duration: 250,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f0f4f8" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Messages List */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        inverted
        contentContainerStyle={{ paddingVertical: 10 }}
        renderItem={({ item }) => {
          const isMe = item.userId === auth.currentUser.uid;
          return (
            <View
              style={{
                alignSelf: isMe ? "flex-end" : "flex-start",
                backgroundColor: isMe ? "#0f55edff" : "#a9f6f9ff",
                padding: 12,
                borderRadius: 15,
                marginVertical: 4,
                maxWidth: "75%",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
                margin:10
              }}
            >
              <Text style={{ color: isMe ? "#fff" : "#111", fontSize: 16 }}>
                {item.text}
              </Text>
            </View>
          );
        }}
      />

      {/* Input Box */}
      <Animated.View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          borderTopWidth: 1,
          borderTopColor: "#ddd",
          backgroundColor: "#fff",
          paddingBottom: paddingAnim, // Dynamic padding based on keyboard
        }}
      >
        <TextInput
          style={{
            flex: 1,
            backgroundColor: "#f1f5f9",
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 25,
            fontSize: 16,
            borderWidth: 1,
            borderColor: "#ccc",
          }}
          placeholder="Type a message..."
          value={input}
          onChangeText={setInput}
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          onPress={sendMessage}
          style={{
            marginLeft: 10,
            backgroundColor: "#2563eb",
            paddingVertical: 12,
            paddingHorizontal: 18,
            borderRadius: 25,
            shadowColor: "#2563eb",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 3,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
            Send
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}
