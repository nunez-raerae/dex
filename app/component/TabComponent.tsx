import {
  pokeFilter,
  useGetDetails,
  useGetPokeEvolutionChain,
  useGetPokeSpecies,
} from "@/api/controller";
import { typeColors } from "@/utils/util";
import React from "react";
import {
  Animated,
  Easing,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { scale, vs } from "react-native-size-matters";

export default function TabComponent({
  props,
}: {
  props: pokeFilter | undefined;
}) {
  const [activeTab, setActiveTab] = React.useState<
    "About" | "Base Stats" | "Evolution" | "Moves"
  >("About");
  return (
    <View style={{ flex: 1, borderRadius: 15, overflow: "hidden" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          padding: 10,
        }}
      >
        {(["About", "Base Stats", "Evolution", "Moves"] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <Pressable key={tab} onPress={() => setActiveTab(tab)}>
              <View
                style={{
                  padding: 5,
                  borderBottomWidth: isActive ? 5 : 0,
                  borderRadius: 5,
                  borderBottomColor: isActive ? "#202020" : "transparent",
                }}
              >
                <Text
                  style={{
                    color: isActive ? "#202020" : "#888",
                    fontWeight: "500",
                  }}
                >
                  {tab}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
      <View style={{ padding: 10, flex: 1 }}>
        {activeTab === "About" && <AboutTab />}
        {activeTab === "Base Stats" && <BaseStatsTab props={props} />}
        {activeTab === "Evolution" && <EvolutionTab props={props} />}
        {activeTab === "Moves" && <Text>Moves Content</Text>}
      </View>
    </View>
  );
}

function AboutTab() {
  return (
    <View style={styles.TabContainer}>
      <Text>About Content</Text>
    </View>
  );
}

function EvolutionTab({ props }: { props: pokeFilter | undefined }) {
  const { data: pokeSpecies } = useGetPokeSpecies(props?.id || 0);

  const evoChainUrl = pokeSpecies?.evolution_chain?.url as string;

  const { data: evolutionChain } = useGetPokeEvolutionChain(
    evoChainUrl as string,
  );

  const names = React.useMemo(() => {
    if (!evolutionChain) return [];
    const chain = evolutionChain.chain;

    const evoNames = [
      `https://pokeapi.co/api/v2/pokemon/${chain.species.name}`,
    ];
    chain.evolves_to.forEach((evo) => {
      evoNames.push(`https://pokeapi.co/api/v2/pokemon/${evo.species.name}`);
      evo?.evolves_to.forEach((evo2) => {
        evoNames.push(`https://pokeapi.co/api/v2/pokemon/${evo2.species.name}`);
      });
    });
    return evoNames;
  }, [evolutionChain]);

  const evoDetails = useGetDetails(names);

  return (
    <View style={{ flex: 1, borderRadius: 15, overflow: "hidden" }}>
      <ScrollView
        style={{
          flex: 1,
          gap: 10,
        }}
        contentContainerStyle={{
          flexGrow: 1,
          padding: 10,
          // paddingBottom: vs(400),
        }}

        // alwaysBounceVertical
        // showsHorizontalScrollIndicator={true}
      >
        {evoDetails?.map((evo, index) => (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
            key={index}
          >
            <View
              style={{
                marginBottom: 15,
                width: scale(100),
                alignItems: "center",
                backgroundColor: "#f0f0f0",
                borderRadius: 20,
              }}
            >
              <Image
                source={{
                  uri: `${evo?.sprites?.other?.showdown?.front_default}`,
                }}
                style={{ width: 100, height: 100, resizeMode: "contain" }}
              />
            </View>
            <View>
              <Text>
                {evo?.name.charAt(0).toUpperCase() + evo?.name.slice(1)}
              </Text>
              <View>
                {evo?.types?.map((type, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: typeColors[type.type.name] || "#ccc",
                      padding: 4,
                      borderRadius: 5,
                      marginTop: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: scale(12),
                        fontWeight: "500",
                        textTransform: "capitalize",
                      }}
                    >
                      {type.type.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function BaseStatsTab({ props }: { props: pokeFilter | undefined }) {
  const bg = typeColors[props?.types[0].type.name || ""] || "#fff";

  return (
    <View style={styles.TabContainer}>
      {props?.stats.map((stat) => (
        <View
          key={stat.stat.name}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              marginBottom: 10,
              width: scale(90),
            }}
          >
            <Text
              style={{
                textTransform: "capitalize",
                fontWeight: "600",
                fontSize: scale(12),
                color: "#4e4e4e",
              }}
            >
              {stat.stat.name}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 5,
              alignItems: "center",
              padding: 5,
              borderRadius: 5,
              width: scale(50),
            }}
          >
            <Text style={{ fontWeight: "600", color: "#272727" }}>
              {stat.base_stat}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              padding: 5,
              borderRadius: 5,
              width: scale(175),
            }}
          >
            <StatSegments value={stat.base_stat} color={bg} />
          </View>
        </View>
      )) ?? <Text>No stats available</Text>}
    </View>
  );
}
const styles = StyleSheet.create({
  TabContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
    padding: 10,
  },
});

function StatSegments({
  value,
  color,
  maxSegments = 15,
}: {
  value: number;
  color: string;
  maxSegments?: number;
}) {
  const count = Math.max(0, Math.min(maxSegments, Math.round(value / 10)));
  const progress = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: count,
      duration: 550,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true, // we only animate opacity/transform
    }).start();
  }, [count, progress]);

  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const opacity = progress.interpolate({
          inputRange: [i, i + 0.8],
          outputRange: [0.15, 1],
          extrapolate: "clamp",
        });

        const translateY = progress.interpolate({
          inputRange: [i, i + 1],
          outputRange: [6, 0],
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            key={i}
            style={{
              width: scale(8),
              borderRadius: scale(10),
              height: vs(15),
              backgroundColor: color,
              opacity,
              transform: [{ translateY }],
            }}
          />
        );
      })}
    </>
  );
}
