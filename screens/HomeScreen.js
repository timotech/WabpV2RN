import { useState } from "react";
import { View, StatusBar, StyleSheet } from "react-native";
import Colors from "../shared/constants/Colors";
import Layout from "../shared/constants/Layout";

const HomeScreen = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.blueViolet} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.snow,
  },
  headerItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  menuIcon: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  cartHasItems: {
    position: "absolute",
    top: 0,
    left: 18,
    width: 7,
    height: 7,
    backgroundColor: Colors.blueViolet,
    borderRadius: 50,
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
});
