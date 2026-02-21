import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";

import { StyleSheet, TextInput, View } from "react-native";
import { scale } from "react-native-size-matters";

export default function SearchBar(props: {
  value: string | undefined;
  onChangeText: (text: string) => void;
}) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="#888" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholderTextColor={"#b1b1b1"}
        placeholder="Search  a Pokemon"
        value={props.value ?? ""}
        onChangeText={props.onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "red",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    paddingHorizontal: 10,
    width: "100%",
    margin: 0,
    marginBottom: 10,
  },
  icon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: scale(18),
    fontWeight: "500",
  },
});
