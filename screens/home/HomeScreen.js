import { StyleSheet, Text, View } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useMemo, useState } from "react";

function HomeScreen() {
  // const [showBottomSheet, setShowBottomSheet] = useState(true);
  const snapPoints = useMemo(() => ["25%", "50%", "70%"], []);
  return (
    <View style={styles.container}>
      <Text>Home Screen!</Text>
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
