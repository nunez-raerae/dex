import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";

import { StyleSheet, TextInput, View } from "react-native";

export default function SearchBar(props: {
  value: string | undefined;
  onChangeText: (text: string) => void;
}) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="#888" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Search poke here..."
        value={props.value}
        onChangeText={props.onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,

    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 8,
    width: "100%",

    margin: 10,
  },
  icon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
  },
});
