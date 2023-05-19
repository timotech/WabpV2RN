import {
  Entypo,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Colors from "../shared/constants/Colors";
import Layout from "../shared/constants/Layout";
import Touchable from "../shared/components/Touchable";
import React, { Component } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";

import { Category } from "../components";

const SCREEN_WIDTH = Layout.window.width;
const BEST_WIDTH = SCREEN_WIDTH - 65;

const CATEGORIES = [
  {
    _id: "1",
    name: "Pre-Primary Schools",
    icon: (
      <MaterialIcons name="child-care" size={70} color={Colors.blueViolet} />
    ),
  },
  {
    _id: "2",
    name: "Primary Schools",
    icon: (
      <FontAwesome name="address-book" size={60} color={Colors.blueViolet} />
    ),
  },
  {
    _id: "4",
    name: "Junior Secondary",
    icon: (
      <MaterialIcons
        name="account-balance"
        size={75}
        color={Colors.blueViolet}
      />
    ),
  },
  {
    _id: "6",
    name: `Senior Secondary Schools`,
    icon: <Ionicons name="ios-camera" size={85} color={Colors.blueViolet} />,
  },
  {
    _id: "7",
    name: "Tertiary Schools",
    icon: (
      <MaterialCommunityIcons
        name="school"
        size={80}
        color={Colors.blueViolet}
      />
    ),
  },
  {
    _id: "3",
    name: "Prose",
    icon: (
      <MaterialCommunityIcons
        name="sword-cross"
        size={70}
        color={Colors.blueViolet}
      />
    ),
  },
  {
    _id: "8",
    name: "Poetry",
    icon: <Entypo name="feather" size={70} color={Colors.blueViolet} />,
  },
  {
    _id: "9",
    name: "Drama",
    icon: (
      <MaterialCommunityIcons
        name="heart"
        size={80}
        color={Colors.blueViolet}
      />
    ),
  },
  {
    _id: "10",
    name: "Biographies & Autobiographies",
    icon: (
      <MaterialCommunityIcons
        name="incognito"
        size={70}
        color={Colors.blueViolet}
      />
    ),
  },
  {
    _id: "11",
    name: "General Readers",
    icon: (
      <MaterialCommunityIcons
        name="apple-keyboard-command"
        size={70}
        color={Colors.blueViolet}
      />
    ),
  },
];

const BEST = [
  { image: require("../assets/best/Book1.jpg") },
  { image: require("../assets/best/Book2.jpg") },
  { image: require("../assets/best/Book3.jpg") },
  { image: require("../assets/best/Book4.jpg") },
  { image: require("../assets/best/Book5.jpg") },
];

export default class CategoriesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setOptions({
      title: "Browse Categories",
      headerLeft: () => (
        <Touchable
          background={Touchable.Ripple(Colors.blueViolet, true)}
          style={[styles.headerItem, styles.headerIcon]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="ios-arrow-back" size={25} color={Colors.congoBrown} />
        </Touchable>
      ),
    });
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    setTimeout(() => {
      this.setState({ refreshing: false });
    }, 1500);
  };

  _renderFirstList = (category, index) => {
    if (index < 6) {
      return (
        <Category
          key={index}
          index={index}
          category={category}
          handleOnPress={() =>
            this.props.navigation.navigate("Listing", {
              id: category._id,
              name: category.name,
            })
          }
        />
      );
    }
  };

  _renderSecondList = (category, index) => {
    if (index > 5) {
      return (
        <Category
          key={index}
          index={index}
          category={category}
          handleOnPress={() =>
            this.props.navigation.navigate("Listing", {
              id: category._id,
              name: category.name,
            })
          }
        />
      );
    }
  };

  _renderBestList = (item, index) => {
    {
      /* <ProductImage
        key={index}
        style={{
          width: BEST_WIDTH,
          height: 140,
          marginRight: 15,
          shadowRadius: 2,
        }}
      /> */
    }
    return (
      <Image
        source={item.image}
        key={index}
        style={{
          width: BEST_WIDTH,
          height: "100%",
          marginRight: 15,
          shadowRadius: 2,
        }}
      />
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          <View style={styles.content}>
            {/** Top Listing */}
            <View style={styles.listContainer}>
              {CATEGORIES.map(this._renderFirstList)}
            </View>
            {/** Best of the Year */}
            <View>
              <View style={styles.bestContainer}>
                <Text style={styles.bestText}>
                  Best of {new Date().getFullYear()}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("Listing", {
                      id: "3",
                      name: "Best of " + new Date().getFullYear(),
                    })
                  }
                >
                  <Text style={styles.bestAll}>View all</Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                scrollEventThrottle={16}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.scrollView}
              >
                {BEST.map(this._renderBestList)}
              </ScrollView>
            </View>
            {/** Bottom Listing */}
            <View style={styles.listContainer}>
              {CATEGORIES.map(this._renderSecondList)}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.snow,
  },
  headerItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerIcon: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    padding: 20,
    paddingBottom: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  bestContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  bestText: {
    fontSize: 14,
    color: Colors.congoBrown,
    fontWeight: "700",
  },
  bestAll: {
    fontSize: 12,
    color: Colors.congoBrown,
  },
  scrollView: {
    flexDirection: "row",
    backgroundColor: Colors.snow,
    paddingLeft: 20,
    height: 170,
  },
});
