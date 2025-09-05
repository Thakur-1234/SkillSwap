import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigation/AppNavigator";
import { registerForPushNotificationsAsync } from "./utils/notifications";
import ChatRoomScreen from "./screens/ChatRoomScreen";
import {View,Text } from "react-native";
import LoginScreen from "./screens/Auth/LoginScreen";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  useEffect(() => {
    // ask permissions & get expo push token (saved in Register/Login flows)
    registerForPushNotificationsAsync().catch(() => {});
  }, []);

  return (
    <NavigationContainer>
      <SafeAreaView style={{flex:1}}>


    <AppNavigator/>
      </SafeAreaView>

    </NavigationContainer>
  );
}
