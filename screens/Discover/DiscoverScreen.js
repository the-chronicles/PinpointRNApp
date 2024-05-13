import React, { useEffect, useMemo, useRef, useCallback } from "react";
import { EvilIcons, MaterialIcons } from "@expo/vector-icons";
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors, Sizes, Fonts } from "../../constants/styles";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { markers, mapDarkStyle, mapStandardStyle } from "../../model/mapData";
import { useTheme } from "@react-navigation/native";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Slider from "@react-native-community/slider";

const { width } = Dimensions.get("window");
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;

function DiscoverScreen({ navigation }) {
  const nearByRestaurantsList = [
    {
      id: "1",
      restaurantName: "Marine Rise Restaurant",
      ratedPeopleCount: 198,
      restaurantAddress: "1124, Old Chruch Street, New york, USA",
      rating: 4.3,
    },
    {
      id: "2",
      restaurantName: "Sliver Leaf Restaurant",
      ratedPeopleCount: 170,
      restaurantAddress: "1124, Old Chruch Street, New york, USA",
      rating: 4.0,
    },
    {
      id: "3",
      restaurantName: "Johson Foods",
      ratedPeopleCount: 130,
      restaurantAddress: "1124, Old Chruch Street, New york, USA",
      rating: 3.5,
    },
    {
      id: "4",
      restaurantName: "Lepord Cafe",
      ratedPeopleCount: 100,
      restaurantAddress: "1124, Old Chruch Street, New york, USA",
      rating: 3.0,
    },
    {
      id: "5",
      restaurantName: "King Of Foods",
      ratedPeopleCount: 80,
      restaurantAddress: "1124, Old Chruch Street, New york, USA",
      rating: 2.0,
    },
  ];

  const theme = useTheme();
  const sheetRef = useRef(null);

  const snapPoints = useMemo(() => ["25%", "70%"], []);

  const handleSheetChange = useCallback((index) => {
    setState((state) => ({ ...state, sheetindex: index }));
  }, []);

  const handleSnapPress = useCallback((index) => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  const renderItem = useCallback(
    ({ item }) => (
      <View style={styles.itemContainer}>
        <Text>{item}</Text>
      </View>
    ),
    []
  );

  const renderItemPartners = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigation.push("RestaurantDetail", { id: item.id })}
      style={styles.nearByRestaurantsWrapStyle}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <View style={styles.nearByRestaurantsIconWrapStyle}>
            <Image
              source={require("../../assets/images/icons/restaurant_icon.png")}
              style={{
                width: "100%",
                height: "100%",
                flex: 1,
                resizeMode: "contain",
              }}
            />
          </View>
          <View style={{ flex: 1, marginLeft: Sizes.fixPadding }}>
            <Text style={{ ...Fonts.blackColor12SemiBold }}>
              {item.restaurantName}
            </Text>
            <Text style={{ ...Fonts.grayColor12Medium }}>
              {item.ratedPeopleCount} People Rated
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={{
              marginRight: Sizes.fixPadding - 5.0,
              ...Fonts.primaryColor12SemiBold,
            }}
          >
            {item.rating.toFixed(1)}
          </Text>
          <MaterialIcons name="star" color={Colors.primaryColor} size={14} />
        </View>
      </View>
      <View
        style={{
          marginTop: Sizes.fixPadding - 5.0,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <MaterialIcons
          name="location-on"
          color={Colors.primaryColor}
          size={16}
        />
        <Text
          style={{
            marginLeft: Sizes.fixPadding - 5.0,
            ...Fonts.grayColor12Medium,
          }}
        >
          {item.restaurantAddress}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const initialMapState = {
    markers,
    categories: [
      {
        id: "open_now",
        name: "Open now",
        // icon: <MaterialCommunityIcons style={styles.chipsIcon} name="truck-delivery" size={18} />,
      },
      {
        id: "radius",
        name: "Radius",
        // icon: <MaterialCommunityIcons style={styles.chipsIcon} name="radius" size={18} />,
      },
      {
        id: "address",
        name: "Address",
        // icon: <MaterialCommunityIcons style={styles.chipsIcon} name="city" size={18} />,
      },
      {
        id: "category",
        name: "category",
        // icon: <MaterialIcons name="category" style={styles.chipsIcon} size={18} />,
      },
      {
        id: "booking",
        name: "Accept Booking",
        // icon: <MaterialIcons name="book-online" style={styles.chipsIcon} size={18} />,
      },
      {
        id: "catering",
        name: "Catering",
        // icon: <MaterialIcons name="fastfood" style={styles.chipsIcon} size={18} />,
      },
    ],
    region: {
      latitude: 22.62938671242907,
      longitude: 88.4354486029795,
      latitudeDelta: 0.04864195044303443,
      longitudeDelta: 0.040142817690068,
    },
    search: null,
    showCustomDialog: false,
    selectedCustomProductName: null,
    selectedCustomProductAmount: 0,
    sheetindex: 0,
  };

  const [state, setState] = React.useState(initialMapState);
  const [filterState, setFilterState] = React.useState("open_now");
  const [value, setValue] = React.useState(0);
  const { search } = state;

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  let mapIndex = 0;
  let mapAnimation = new Animated.Value(0);

  useEffect(() => {
    mapAnimation.addListener(({ value }) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
      if (index >= state.markers.length) {
        index = state.markers.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }

      clearTimeout(regionTimeout);

      const regionTimeout = setTimeout(() => {
        if (mapIndex !== index) {
          mapIndex = index;
          const { coordinate } = state.markers[index];
          _map.current.animateToRegion(
            {
              ...coordinate,
              latitudeDelta: state.region.latitudeDelta,
              longitudeDelta: state.region.longitudeDelta,
            },
            350
          );
        }
      }, 10);
    });
  });

  const interpolations = state.markers.map((marker, index) => {
    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      (index + 1) * CARD_WIDTH,
    ];

    const scale = mapAnimation.interpolate({
      inputRange,
      outputRange: [1, 1.5, 1],
      extrapolate: "clamp",
    });

    return { scale };
  });

  const onMarkerPress = (mapEventData) => {
    const markerID = mapEventData._targetInst.return.key;

    let x = markerID * CARD_WIDTH + markerID * 20;
    if (Platform.OS === "ios") {
      x = x - SPACING_FOR_CARD_INSET;
    }
    _scrollView.current.scrollTo({ x: x, y: 0, animated: true });
  };

  const _map = React.useRef(null);
  const _scrollView = React.useRef(null);

  return (
    <View style={styles.container}>
      <MapView
        ref={_map}
        initialRegion={state.region}
        style={styles.container}
        provider={PROVIDER_GOOGLE}
        customMapStyle={theme.dark ? mapDarkStyle : mapStandardStyle}
      >
        {state.markers.map((marker, index) => {
          const scaleStyle = {
            transform: [
              {
                scale: interpolations[index].scale,
              },
            ],
          };
          return (
            <Marker
              key={index}
              coordinate={marker.coordinate}
              onPress={(e) => onMarkerPress(e)}
            >
              <Animated.View style={[styles.markerWrap]}>
                <Animated.Image
                  source={require("../../assets/images/truckMarker.png")}
                  style={[styles.marker, scaleStyle]}
                  resizeMode="cover"
                />
              </Animated.View>
            </Marker>
          );
        })}
      </MapView>
      <View style={styles.headerWrapStyle}>
        {/* <MaterialIcons
          name="arrow-back-ios"
          color="#000000"
          size={22}
          onPress={() => navigation.pop()}
        /> */}

        <View style={styles.searchContainer}>
          <View style={styles.search}>
            <EvilIcons
              name="search"
              size={24}
              color="black"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Search"
              // value={search}
              // onTouchStart={() => handleSnapPress(1)}
              // onChangeText={(text) => updateState({ search: text })}
              // selectionColor={Colors.primaryColor}
              // inputStyle={{ marginLeft: Sizes.fixPadding }}
              // inputContainerStyle={{ borderBottomWidth: 0.0, height: 30.0 }}
              // containerStyle={styles.searchFieldStyle}
            />
          </View>
        </View>
      </View>

      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheet
          ref={sheetRef}
          snapPoints={snapPoints}
          onChange={(index) => {
            updateState({ sheetindex: index });
          }}
          detached={true}
        >
          <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
            {/* <Input
            value={search}
            onTouchStart={() => handleSnapPress(1)}
            onChangeText={(text) => updateState({ search: text })}
            placeholder='Fast food...'
            placeholderTextColor={Colors.grayColor}
            selectionColor={Colors.primaryColor}
            leftIcon={
              <Icon
                name='search'
                size={18}
                color={Colors.grayColor}
              />
            }
            style={{ ...Fonts.blackColor13Medium }}
            inputStyle={{ marginLeft: Sizes.fixPadding, }}
            inputContainerStyle={{ borderBottomWidth: 0.0, height: 30.0, }}
            containerStyle={styles.searchFieldStyle}
          /> */}
          </View>
          {/* } */}

          <View style={{ height: 40 }}>
            <BottomSheetScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.contentContainer}
              style={{ marginLeft: 15 }}
            >
              {state.categories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={
                    filterState === category.id
                      ? styles.ActivechipsItem
                      : styles.chipsItem
                  }
                  onPress={() => {
                    setFilterState(category.id);
                  }}
                >
                  {category.icon}
                  <Text
                    style={
                      filterState === category.id
                        ? { color: Colors.whiteColor }
                        : { color: Colors.blackColor }
                    }
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </BottomSheetScrollView>
          </View>
          <View>
            {filterState === "radius" ? (
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                minimumTrackTintColor="#175594"
                maximumTrackTintColor="#000000"
                onValueChange={setValue}
                step={1}
              />
            ) : (
              ""
            )}
          </View>
          <View
            style={{
              marginVertical: Sizes.fixPadding * 0.5,
              backgroundColor: Colors.grayColor,
              height: 1.0,
            }}
          />
          <BottomSheetFlatList
            listKey="nearByRestaurants"
            data={nearByRestaurantsList}
            keyExtractor={(item) => `${item.id}`}
            renderItem={renderItemPartners}
            contentContainerStyle={styles.contentContainer}
          />
        </BottomSheet>
      </GestureHandlerRootView>
    </View>
  );
}

export default DiscoverScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 30,
  },
  headerWrapStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  searchContainer: {
    height: 85,
  },
  search: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderRadius: 8,
    margin: 20,
    alignItems: "center",
    borderColor: "#808080",
  },
  searchIcon: {
    marginHorizontal: 10,
  },
  textInput: {
    flex: 1,
  },
});
