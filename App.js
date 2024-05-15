// import { StatusBar } from "expo-status-bar";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import DiscoverScreen from "./screens/Discover/DiscoverScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./screens/home/HomeScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SettingsScreen from "./screens/settings/SettingsScreen";
import {
  AntDesign,
  Feather,
  Ionicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import SocialScreen from "./social/SocialScreen";
import Menu from "./screens/Menu";
// import { useFonts } from "expo-font";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  // const [fontsLoaded] = useFonts({
  //   Montserrat_Light: require("./assets/fonts/Montserrat-Light.ttf"),
  //   Montserrat_Regular: require("./assets/fonts/Montserrat-Regular.ttf"),
  //   Montserrat_Medium: require("./assets/fonts/Montserrat-Medium.ttf"),
  //   Montserrat_SemiBold: require("./assets/fonts/Montserrat-SemiBold.ttf"),
  //   Montserrat_Bold: require("./assets/fonts/Montserrat-Bold.ttf"),
  // });
  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: "Home",
              tabBarLabel: "Home",
              tabBarIcon: ({ color, size }) => (
                <Feather name="home" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Discover"
            component={DiscoverScreen}
            options={{
              title: "Discover",
              tabBarLabel: "Discover",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="compass-outline" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Social"
            component={SocialScreen}
            options={{
              title: "Social",
              tabBarLabel: "Social",
              tabBarIcon: ({ color, size }) => (
                <SimpleLineIcons
                  name="location-pin"
                  size={size}
                  color={color}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Menu"
            component={Menu}
            options={{
              title: "Menu",
              tabBarLabel: "Menu",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="menu" size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
