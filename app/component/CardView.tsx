import { pokeFilter, useSvgText } from "@/api/controller";
import { PokeballIcon, typeColors, typeIcons } from "@/utils/util";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SvgXml } from "react-native-svg";

const capitalizeFirst = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

type Props = { pokemon: pokeFilter };

const CardView = React.memo(function CardView({ pokemon }: Props) {
  const bg = typeColors[pokemon.types?.[0]?.type?.name] || "#fff";
  const uri =
    pokemon.sprites?.other?.dream_world?.front_default ||
    pokemon.sprites?.front_default;

  const { data: xml } = useSvgText(uri);

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>{capitalizeFirst(pokemon.name)}</Text>
        <Text
          style={styles.headerText}
        >{`#${String(pokemon.order).padStart(3, "0")}`}</Text>
      </View>

      <View style={styles.bottomRow}>
        <View>
          {pokemon.types.map((t) => (
            <View key={t.slot} style={styles.typePill}>
              <View
                style={[
                  styles.typeIconWrap,
                  { backgroundColor: typeColors[t.type.name] || "#000" },
                ]}
              >
                {typeIcons[t.type.name] || null}
              </View>
              <Text style={styles.typeText}>
                {capitalizeFirst(t.type.name)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.imageWrapOuter}>
          <View style={styles.imageWrapInner}>
            <View style={styles.pokeballBg}>
              <PokeballIcon />
            </View>
            <View style={styles.svgTop}>
              {!!xml && <SvgXml xml={xml} width={70} height={70} />}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
});

export default CardView;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
    width: "49%",
  },
  headerRow: {
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerText: { fontWeight: "500", color: "#ffffffd3" },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  typePill: {
    backgroundColor: "#00000030",
    paddingHorizontal: 5,
    paddingVertical: 4,
    borderRadius: 45,
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  typeIconWrap: { borderRadius: 50, padding: 4 },
  typeText: { fontSize: 12, color: "white", fontWeight: "400" },
  imageWrapOuter: { alignSelf: "center", flexDirection: "row", gap: 5 },
  imageWrapInner: { position: "relative" },
  pokeballBg: {
    position: "absolute",
    right: -12,
    bottom: -30,
    opacity: 0.3,
    transform: [{ rotate: "-20deg" }],
    zIndex: 0,
  },
  svgTop: { zIndex: 1 },
});
