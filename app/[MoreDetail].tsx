import { useGetPokePage } from "@/api/controller";
import { PokeballIcon, typeColors, TypeIcon } from "@/utils/util";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { scale, vs } from "react-native-size-matters";
import TabComponent from "./component/TabComponent";

const PokeName = (name: string) => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

type MoreDetailParams = {
  MoreDetail: string;
  order: string;
  type: string;
};

export default function MoreDetail() {
  const { MoreDetail, order, type } = useLocalSearchParams<MoreDetailParams>();
  const router = useRouter();

  const { data: pokeData, isLoading } = useGetPokePage(MoreDetail);

  const handleGoBack = React.useCallback(() => {
    router.back();
  }, [router]);

  const bg = typeColors[type || ""] || "#fff";

  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={[bg, bg, bg, "#ffffff"]}
        style={{ flex: 1 }}
        locations={[0.1, 0.2, 0.2, 0.5]}
      >
        <SafeAreaView style={{ flex: 1, padding: scale(1) }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={handleGoBack}>
              <Ionicons name="chevron-back" size={scale(30)} color="black" />
            </TouchableOpacity>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
                marginRight: scale(35),
              }}
            >
              <Text style={{ fontSize: scale(18), fontWeight: "500" }}>
                {`#${String(order).padStart(3, "0")}`}
              </Text>
            </View>
          </View>
          <View
            style={{
              marginTop: scale(20),
              borderRadius: 15,
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {isLoading ? (
              <View
                style={{
                  opacity: 0.5,
                }}
              >
                <PokeballIcon width={vs(200)} height={vs(200)} />
              </View>
            ) : (
              <Image
                style={{
                  width: "100%",
                  height: vs(200),
                  alignSelf: "center",
                  resizeMode: "contain",
                }}
                source={{
                  uri: pokeData
                    ? pokeData[0]?.sprites?.other?.showdown?.front_default ||
                      "../assets/images/android-icon-background.png"
                    : "../assets/images/android-icon-background.png",
                }}
              />
            )}

            <Text
              style={{ fontSize: scale(20), fontWeight: "400", color: "#333" }}
            >
              {PokeName(MoreDetail)}
            </Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              {pokeData?.[0]?.types?.map((item, index) => (
                <View
                  key={index}
                  style={{
                    marginTop: scale(10),
                    backgroundColor: typeColors[item.type.name || ""],

                    padding: 6,
                    borderRadius: 100,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <TypeIcon
                    type={item.type.name}
                    width={scale(18)}
                    height={scale(18)}
                  />
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: scale(14),
                      fontWeight: "400",
                      textTransform: "capitalize",
                    }}
                  >
                    {item.type.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          <View>
            <TabComponent props={pokeData?.[0]} />
          </View>
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}
