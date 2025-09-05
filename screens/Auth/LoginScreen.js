import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView } from "react-native";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "../../config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { registerForPushNotificationsAsync } from "../../utils/notifications";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (!email || !password) {
      alert("Please enter email & password");
      return;
    }
    setLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email.trim(), password);
      const token = await registerForPushNotificationsAsync();
      if (token) {
        await updateDoc(doc(db, "users", user.uid), { expoPushToken: token });
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const onForgotPassword = async () => {
    if (!email) {
      alert("Enter your email first!");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      alert("Password reset email sent! Check your inbox.");
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <KeyboardAvoidingView style={{flex:1}}>

    <View style={styles.container}>
      <Text style={styles.title}>⚡ SkillSwap</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity onPress={onForgotPassword}>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={onLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace("Register")}>
        <Text style={styles.createAcc}>Don’t have an account? Create one</Text>
      </TouchableOpacity>
    </View>
    </KeyboardAvoidingView>

  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#f9fafb" },
  title: { fontSize: 30, fontWeight: "800", textAlign: "center", marginBottom: 30, color: "#111827" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 14,
    borderRadius: 10,
    marginVertical: 8,
    backgroundColor: "#fff",
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  btn: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: "#2563eb",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16
  },
  forgot: {
    textAlign: "right",
    marginTop: 4,
    marginBottom: 12,
    color: "#2563eb",
    fontWeight: "600"
  },
  createAcc: {
    textAlign: "center",
    marginTop: 20,
    color: "#0091ffff",
    fontSize: 14
  },
});
