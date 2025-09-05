import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

import HomeScreen from "../screens/HomeScreen";
import SkillPostScreen from "../screens/SkillPostScreen";
import RequestsScreen from "../screens/RequestsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RatingsScreen from "../screens/RatingsScreen";
import ChatsScreen from "../screens/ChatsScreen";
import ChatRoomScreen from "../screens/ChatRoomScreen";
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function Tabs() {
  return (
   

    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
         tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === "Post") {
            iconName = focused ? "add-circle" : "add-circle-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === "Requests") {
            iconName = focused ? "people" : "people-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === "Chats") {
            iconName = focused ? "chatbubble" : "chatbubble-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: "#6000ce",
        tabBarInactiveTintColor: "#0188ffff",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Post" component={SkillPostScreen} />
      <Tab.Screen name="Requests" component={RequestsScreen} />
      <Tab.Screen name="Chats" component={ChatsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
    

  );
}

export default function AppNavigator() {
  const [user, setUser] = useState(undefined); // undefined = loading, null = signed out

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        // ensure user doc exists
        const ref = doc(db, "users", u.uid);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          await setDoc(ref, {
            uid: u.uid,
            email: u.email || "",
            displayName: u.displayName || "",
            photoURL: u.photoURL || "",
            skills: [],
            expoPushToken: "",
            createdAt: serverTimestamp()
          });
        }
        setUser(u);
      } else setUser(null);
    });
    return () => unsub();
  }, []);

  if (user === undefined) return null; // splash could be added

  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen name="Main" component={Tabs} options={{ headerShown: false }} />
          <Stack.Screen name="ChatRoom" component={ChatRoomScreen} options={{ title: "Chat" }} />
          <Stack.Screen name="Ratings" component={RatingsScreen} options={{ title: "Ratings" }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
    
  );
}
