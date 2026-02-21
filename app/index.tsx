import { useFocusEffect, useRouter } from "expo-router";
import React from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { scale } from "react-native-size-matters";
import { pokeFilter, useInfinitePokeList } from "../api/controller";
import CardView from "./component/CardView";
import SearchBar from "./component/SearchBar";

const MemoCardView = React.memo(CardView);

export default function Index() {
  const router = useRouter();
  const [name, setName] = React.useState<string | undefined>(undefined);
  const [debouncedName, setDebouncedName] = React.useState<string | undefined>(
    undefined,
  );

  const {
    data: infinitePokeListData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePokeList(debouncedName);

  const flatData = React.useMemo(
    () => infinitePokeListData?.pages.flat() ?? [],
    [infinitePokeListData],
  );
  const keyExtractor = React.useCallback((item: pokeFilter) => item.name, []);

  const onEndReached = React.useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const ListFooterComponent = React.useMemo(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={{ padding: 10 }}>
        <Text style={{ color: "red" }}>Loading...</Text>
      </View>
    );
  }, [isFetchingNextPage]);
  const navigatingRef = React.useRef(false);

  useFocusEffect(
    React.useCallback(() => {
      navigatingRef.current = false;
      return () => {};
    }, []),
  );

  const handlePressCard = React.useCallback(
    (pokemon: pokeFilter) => {
      if (navigatingRef.current) return;
      navigatingRef.current = true;
      router.push({
        pathname: "/[MoreDetail]",
        params: {
          MoreDetail: pokemon.name,
          order: pokemon.order,
          type: pokemon.types?.[0]?.type?.name,
        },
      });
    },
    [router],
  );

  const renderItem = React.useCallback(
    ({ item }: { item: pokeFilter }) => (
      <TouchableOpacity onPress={() => handlePressCard(item)}>
        <MemoCardView pokemon={item} />
      </TouchableOpacity>
    ),
    [handlePressCard],
  );

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedName(name);
    }, 300);
    return () => clearTimeout(timer);
  }, [name]);

  // --- hide header on scroll ---
  const [headerHeight, setHeaderHeight] = React.useState(0);

  const headerAnim = React.useRef(new Animated.Value(1)).current; // 1=shown, 0=hidden
  const lastYRef = React.useRef(0);
  const visibleRef = React.useRef(true);

  const setHeaderVisible = React.useCallback(
    (visible: boolean) => {
      if (visibleRef.current === visible) return;
      visibleRef.current = visible;

      Animated.timing(headerAnim, {
        toValue: visible ? 1 : 0,
        duration: 180,
        useNativeDriver: true,
      }).start();
    },
    [headerAnim],
  );

  const headerTranslateY = React.useMemo(
    () =>
      headerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-headerHeight, 0],
        extrapolate: "clamp",
      }),
    [headerAnim, headerHeight],
  );

  const headerOpacity = React.useMemo(
    () =>
      headerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolate: "clamp",
      }),
    [headerAnim],
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
          // backgroundColor: "white",
        }}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",

            borderRadius: 15,
          }}
        >
          <Animated.View
            onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
            style={{
              position: "absolute",
              top: -1,
              left: 0,
              right: 0,
              paddingHorizontal: 10,
              backgroundColor: "#f3f1f1",
              borderBottomLeftRadius: 25,
              borderBottomRightRadius: 25,
              transform: [{ translateY: headerTranslateY }],
              opacity: headerOpacity,
              zIndex: 10,
            }}
          >
            <View
              style={{
                paddingHorizontal: 10,
              }}
            >
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: scale(35),
                  marginBottom: 5,
                }}
              >
                Pokédex
              </Text>
              <Text
                style={{
                  color: "#888",
                  marginBottom: 10,
                  fontWeight: "500",
                  fontSize: scale(15),
                }}
              >
                Use the search bar to find your favorite Pokémon
              </Text>
              <SearchBar value={name} onChangeText={setName} />
            </View>
          </Animated.View>
          <Animated.FlatList
            style={{
              paddingHorizontal: 5,
              paddingVertical: 1,
              borderRadius: 10,
              width: "100%",
            }}
            contentContainerStyle={{
              paddingTop: headerHeight + 10, // space for the absolute header
              paddingHorizontal: 5,
              paddingVertical: 5,
            }}
            scrollEventThrottle={16}
            onScroll={(e) => {
              const y = e.nativeEvent.contentOffset.y;

              // ✅ keep header visible at top + during overscroll bounce
              if (y <= 0) {
                lastYRef.current = 0;
                setHeaderVisible(true);
                return;
              }

              const prevY = lastYRef.current;
              const delta = y - prevY;

              lastYRef.current = y;

              // ignore tiny jitter
              if (Math.abs(delta) < 4) return;

              const scrollingDownList = delta < 0;

              // hide when scroll up, show when scroll down
              setHeaderVisible(scrollingDownList);
            }}
            disableIntervalMomentum={true}
            data={flatData}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-evenly" }}
            removeClippedSubviews
            initialNumToRender={20}
            maxToRenderPerBatch={20}
            updateCellsBatchingPeriod={50}
            windowSize={21}
            onEndReachedThreshold={0.8}
            onEndReached={onEndReached}
            ListFooterComponent={ListFooterComponent}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
