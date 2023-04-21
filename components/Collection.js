import Colors from "../shared/constants/Colors";
import Layout from "../shared/constants/Layout";
import React from "react";
import { StyleSheet, TouchableOpacity, View, Image, Text } from "react-native";

//import ProductImage from './ProductImage'

const SCREEN_WIDTH = Layout.window.width;
const LARGE_BOOK_WIDTH = (SCREEN_WIDTH - 20) / 3 + 10;
const BOOK_WIDTH = (SCREEN_WIDTH - 50) * 0.4;

export default class Collection extends React.PureComponent {
  _onPress = () => {
    this.props.handleOnPress();
  };

  render() {
    const { pick } = this.props;

    return (
      <TouchableOpacity onPress={this._onPress}>
        <View style={styles.content}>
          <View style={styles.buyDetails}>
            <Image
              style={{ width: BOOK_WIDTH }}
              resizeMode="contain"
              source={{ uri: pick.picPath }}
            />
            <View style={styles.detailsInfo}>
              <View style={styles.titleRatings}>
                <Text
                  numberOfLines={4}
                  ellipsizeMode="tail"
                  style={[styles.title]}
                >
                  {pick.title}
                </Text>
              </View>
              <Text
                numberOfLines={3}
                ellipsizeMode="tail"
                style={styles.short_description}
              >
                {pick.description}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  largeBookItem: {
    width: LARGE_BOOK_WIDTH,
    height: 250,
    marginRight: 15,
  },
  content: {
    flex: 1,
    padding: 5,
  },
  buyDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailsInfo: {
    paddingLeft: 5,
    flexDirection: "column",
    justifyContent: "flex-start",
    width: SCREEN_WIDTH - 50 - BOOK_WIDTH,
  },
  titleRatings: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  title: {
    fontSize: 20,
    color: Colors.congoBrown,
    fontWeight: "500",
    //width: 140,
  },
  short_description: {
    fontSize: 12,
    color: Colors.congoBrown,
    marginVertical: 12,
    lineHeight: 20,
    fontWeight: "200",
  },
  genre: {
    fontSize: 10,
    color: Colors.congoBrown,
  },
});
