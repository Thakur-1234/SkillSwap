import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { auth, db } from "../config/firebase";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { signOut } from "firebase/auth";

export default function ProfileScreen({ navigation }) {
  const [userDoc, setUserDoc] = useState(null);
  const [skillInput, setSkillInput] = useState("");
  const [myRatings, setMyRatings] = useState([]);

  useEffect(() => {
    const ref = doc(db, "users", auth.currentUser.uid);
    getDoc(ref).then((s) => setUserDoc(s.data()));

    const q = query(
      collection(db, "ratings"),
      where("toUserId", "==", auth.currentUser.uid)
    );
    const unsub = onSnapshot(q, (snap) => {
      setMyRatings(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const addSkill = async () => {
    if (!skillInput.trim()) return;
    const skills = Array.from(
      new Set([...(userDoc?.skills || []), skillInput.trim()])
    );
    await setDoc(doc(db, "users", auth.currentUser.uid), { skills }, { merge: true });
    setUserDoc({ ...(userDoc || {}), skills });
    setSkillInput("");
  };

  const changePhoto = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (res.canceled) return;

    const imageBase64 = res.assets[0].base64;
    await setDoc(
      doc(db, "users", auth.currentUser.uid),
      { photoBase64: imageBase64 },
      { merge: true }
    );
    setUserDoc({ ...(userDoc || {}), photoBase64: imageBase64 });
  };

  const logout = async () => {
    await signOut(auth);
  };

  if (!userDoc) return null;

  return (
    <FlatList
      data={myRatings}
      keyExtractor={(i) => i.id}
      renderItem={({ item }) => (
        <View style={styles.rate}>
          <Text style={styles.stars}>{item.stars}★</Text>
          <Text style={styles.comment}>{item.comment}</Text>
        </View>
      )}
      ListEmptyComponent={<Text style={{ opacity: 0.6 }}>No ratings yet.</Text>}
      ListHeaderComponent={
        <View style={{ padding: 16 }}>
          {/* Profile Image + Name */}
          <View style={{ alignItems: "center" }}>
            <Image
              source={{
                uri: userDoc.photoBase64
                  ? `data:image/png;base64,${userDoc.photoBase64}`
                  : "https://via.placeholder.com/120",
              }}
              style={styles.avatar}
            />
            <TouchableOpacity onPress={changePhoto}>
              <Text style={{ color: "#2563eb", marginTop: 6 }}>
                Change Photo
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>{userDoc.displayName || "User"}</Text>
          <Text style={{ textAlign: "center", opacity: 0.7 }}>
            {userDoc.email}
          </Text>

          {/* Skills */}
          <Text style={styles.section}>Your Skills</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Add a skill"
              value={skillInput}
              onChangeText={setSkillInput}
            />
            <TouchableOpacity style={styles.add} onPress={addSkill}>
              <Text style={{ color: "#fff" }}>Add</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={userDoc.skills || []}
            keyExtractor={(s, i) => s + i}
            horizontal
            style={{ marginTop: 8 }}
            renderItem={({ item }) => <Text style={styles.chip}>{item}</Text>}
          />

          {/* Ratings Heading */}
          <Text style={styles.section}>Ratings Received</Text>
        </View>
      }
      ListFooterComponent={
        <View style={{ padding: 16, }}>
          <TouchableOpacity style={styles.logout} onPress={logout}>
            <Text
              style={{ color: "#fff", textAlign: "center", fontWeight: "700" }}
            >
              Logout
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Ratings")}
          >
            <Text
              style={{
                textAlign: "center",
                marginTop: 10,
                color: "#2563eb",
              }}
            >
              Give a rating
            </Text>
          </TouchableOpacity>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#dab4b4ff"
  },
  name: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 8
  },
  input: {
    borderWidth: 1,
    borderColor: "#e6aeaeff",
    padding: 15,
    borderRadius: 8,
    marginVertical: 8
  },
  add: {
    backgroundColor: "#13ca56ff",
    padding:15,
    borderRadius: 8,
    justifyContent: "center"
  },
  chip: {
    backgroundColor: "#8ee9ecff",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginRight: 8,
  },
  section: {
    fontSize: 16,
    fontWeight: "800",
    marginTop: 16
  },
  rate: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000000ff",
    padding: 10,
    borderRadius: 8,
    marginVertical: 6,
    elevation: 1,
    paddingLeft: 20,
    alignSelf:'center',
    margin:20
    
  },
  stars: {
    fontWeight: "700",
    fontSize:15,
    color:"#ffea06ff"
  },
  comment: {
    marginLeft: 8,
    flex: 1,
    fontSize:16,
    color:"#0829ffff",
  },
  logout: {
    backgroundColor: "#f60606ff",
    padding: 14,
    borderRadius: 8,
    marginTop: 16
  },
});
