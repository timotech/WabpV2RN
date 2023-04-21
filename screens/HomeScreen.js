import { useState, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import { Colors, Touchable } from "../shared";
import { HomeCarousel, Showcase, Books } from "../components";

const HomeScreen = ({ navigation }) => {
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: "Home",
      headerLeft: () => (
        <Touchable
          background={Touchable.Ripple(Colors.blueViolet, true)}
          style={[styles.headerItem, styles.menuIcon]}
          onPress={() => navigation.toggleDrawer()}
        >
          <Feather name="grid" size={20} color={Colors.congoBrown} />
        </Touchable>
      ),
      headerRight: () => (
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <Touchable
            background={Touchable.Ripple(Colors.blueViolet, true)}
            style={[styles.headerItem, styles.menuIcon]}
            onPress={() => navigation.navigate("Cart")}
          >
            <View
              style={{
                position: "relative",
              }}
            >
              <Feather
                name="shopping-cart"
                size={20}
                color={Colors.congoBrown}
              />
              <View style={styles.cartHasItems}></View>
            </View>
          </Touchable>
          <Touchable
            background={Touchable.Ripple(Colors.blueViolet, true)}
            style={[styles.headerItem, styles.menuIcon]}
            onPress={() => navigation.navigate("Search")}
          >
            <Feather name="search" size={20} color={Colors.congoBrown} />
          </Touchable>
        </View>
      ),
    });
  }, [navigation]);

  _onRefresh = () => {
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.blueViolet} />

      {/** Content */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={() => _onRefresh} />
        }
      >
        <View style={styles.content}>
          <View style={{ marginLeft: 30 }}>
            <HomeCarousel />
          </View>

          <View
            style={{
              paddingLeft: 10,
              paddingTop: 5,
            }}
          >
            {/** Showcase */}
            <Showcase />

            {/** Best of Autobiography */}
            <Books />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
