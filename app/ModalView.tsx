import React, { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

export default function ModalView() {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Modal
        style={{ height: "10%" }}
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View
          style={{
            flex: 1,
            height: "10%",
            maxHeight: "10%",
            backgroundColor: "white",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Pressable onPress={() => setModalVisible(false)}>
            <Text>Close</Text>
          </Pressable>
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>Modal View</Text>
        </View>
      </Modal>
      <Pressable onPress={() => setModalVisible(true)}>
        <Text>Show Modal</Text>
      </Pressable>
    </View>
  );
}
