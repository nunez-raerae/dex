import { Link } from "expo-router";
import React from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useGetPokeFilter,
  useGetPokeList,
  useInfinitePokeList,
} from "../../api/controller";
import CardView from "../component/CardView";
import SearchBar from "../component/SearchBar";
import ModalView from "../ModalView";

export default function Index() {
  const [name, setName] = React.useState<string | undefined>(undefined);
  const [debouncedName, setDebouncedName] = React.useState<string | undefined>(
    undefined,
  );

  const { data: pokeFilterData } = useGetPokeFilter(debouncedName || "");
  const { data: pokeListData } = useGetPokeList();

  const {
    data: infinitePokeListData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePokeList();
  const flatData = React.useMemo(
    () => infinitePokeListData?.pages.flat() ?? [],
    [infinitePokeListData],
  );

  const renderItem = React.useCallback(
    ({ item }: { item: any }) => <CardView pokemon={item} />,
    [],
  );

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedName(name);
    }, 300);
    return () => clearTimeout(timer);
  }, [name]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          // backgroundColor: "red",
          alignItems: "center",
        }}
      >
        <Link href="/ViewInfo" style={{ marginTop: 20 }}>
          <Text style={{ color: "white", fontSize: 18 }}>Go to ViewInfo</Text>
        </Link>
        <ModalView />
        <View style={{ marginTop: 20, paddingHorizontal: 10 }}>
          <SearchBar value={name} onChangeText={setName} />
        </View>
        {/* <View style={{ flex: 1, width: "100%", margin: 0, padding: 0 }}> */}
        <FlatList
          style={{
            flex: 1,
            width: "100%",
            paddingHorizontal: 5,
            paddingVertical: 5,
          }}
          data={flatData}
          renderItem={renderItem}
          keyExtractor={(item) => item.name}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between", gap: 10 }}
          removeClippedSubviews
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          updateCellsBatchingPeriod={50}
          windowSize={7}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={{ padding: 10 }}>
                <Text style={{ color: "white" }}>Loading...</Text>
              </View>
            ) : null
          }
        />
        {/* </View> */}
        {/* <ScrollView style={{ width: "100%" }}> */}
        {/* <View
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              // width: "100%",
              gridAutoColumns: "1fr",
              justifyContent: "space-between",
              paddingHorizontal: 9,
            }}
          >
            {!(name && pokeListData) &&
              pokeListData?.map((poke) => (
                <CardView props={{ ...poke }} key={poke.name} />
              ))}
          </View> */}

        {/* {pokeFilterData === null && (
            <View
              style={{
                backgroundColor: "white",
                padding: 10,
                marginBottom: 10,
                borderRadius: 5,
                marginHorizontal: 10,
              }}
            >
              <Text>No pokemons found.</Text>
            </View>
          )} */}
        {/* {name && pokeFilterData && (
            <View
              style={{
                backgroundColor: "white",
                padding: 10,
                marginBottom: 10,
                borderRadius: 5,
                marginHorizontal: 10,
              }}
            >
              <Text>Name: {name}</Text>
              <Text>Base Experience: {pokeFilterData.base_experience}</Text>
              <Text>Abilities:</Text>
              {pokeFilterData.abilities.map((ability) => (
                <Text key={ability.ability.name}>
                  - {ability.ability.name} {ability.is_hidden ? "(Hidden)" : ""}
                </Text>
              ))}
            </View>
          )} */}
        {/* </ScrollView> */}
      </View>
    </SafeAreaView>
  );
}
