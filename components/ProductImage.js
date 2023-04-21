import Colors from "../shared/constants/Colors";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

export default class ProductImage extends React.PureComponent {
  render() {
    return <View style={[styles.detailsImage, { ...this.props.style }]}></View>;
  }
}

const styles = StyleSheet.create({
  detailsImage: {
    height: 190,
    backgroundColor: Colors.congoBrown,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      ...Platform.select({
        ios: {
          height: 4,
        },
      }),
    },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
});
