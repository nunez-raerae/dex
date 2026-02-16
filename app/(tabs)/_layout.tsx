import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons style={style.tabStyle} name="home" />
          ),
        }}
      />
    </Tabs>
  );
}

const style = StyleSheet.create({
  tabStyle: {
    color: "red",
  },
});
