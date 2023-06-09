import { Feather } from "@expo/vector-icons";
import { Colors } from "../shared";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Tabs from "./Tabs";
import Review from "./Review";

const categoriesData = [
  {
    id: 1,
    categoryName: "Info",
  },
  {
    id: 2,
    categoryName: "Reviews",
  },
];

const AdditionalInfo = (props) => {
  const [selectCatg, setSelectCatg] = useState(1);
  _keyExtractor = (item, index) => `${index}`;

  _renderItem = ({ item }) => (
    <Review name={item.name} rating={item.rating} comment={item.comment} />
  );

  _showModal = () => {
    props.setModalVisible(true);
  };

  const { description, reviews } = props;

  const getSelectedCategory = (index) => {
    setSelectCatg(index);
  };

  return (
    <View style={styles.moreInfo}>
      <Tabs Data={categoriesData} onSelected={getSelectedCategory} />
      <View
        style={{
          justifyContent: "flex-start",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        {selectCatg == 1 && (
          <View style={styles.tabStyle}>
            <View style={styles.tabContent}>
              <Text
                numberOfLines={10}
                ellipsizeMode="tail"
                style={styles.description}
              >
                {description}
              </Text>
            </View>
          </View>
        )}
        {selectCatg == 2 && (
          <View style={styles.tabStyle}>
            <View style={[styles.tabContent, styles.reviewsContent]}>
              {/** Floating action button */}
              <TouchableOpacity style={styles.add} onPress={_showModal}>
                <Feather name="plus" size={30} color={Colors.titanWhite} />
              </TouchableOpacity>
              {/** Reviews goes here */}
              {reviews != null && reviews.length > 0 ? (
                <FlatList
                  data={reviews}
                  keyExtractor={_keyExtractor}
                  renderItem={_renderItem}
                  removeClippedSubviews={false}
                />
              ) : (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 20,
                  }}
                >
                  <Text>No reviews yet! Be the first to put one</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  moreInfo: {
    marginVertical: 20,
    backgroundColor: Colors.snow,
  },
  tabStyle: {
    backgroundColor: Colors.snow,
    justifyContent: "flex-start",
    // alignItems: 'flex-end',
    width: "100%",
    // borderWidth: 1,
  },
  tabTextStyle: {
    color: Colors.congoBrown,
    fontSize: 14,
    fontWeight: "normal",
    marginLeft: -20,
  },
  tabContent: {
    paddingVertical: 15,
    backgroundColor: Colors.snow,
  },
  reviewsContent: {
    ...Platform.select({
      ios: {
        height: 385,
      },
    }),
    height: 300,
  },
  add: {
    height: 50,
    width: 50,
    backgroundColor: Colors.blueViolet,
    borderRadius: 100 / 2,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 50, //90
    right: 20,
    zIndex: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      ...Platform.select({
        ios: {
          height: 3,
        },
      }),
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  description: {
    fontSize: 12,
    color: Colors.congoBrown,
    lineHeight: 20,
  },
});

export default AdditionalInfo;
