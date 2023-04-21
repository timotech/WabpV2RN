import Colors from "../shared/constants/Colors";
import Layout from "../shared/constants/Layout";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const SCREEN_WIDTH = Layout.window.width;
const CATEGORY_WIDTH = (SCREEN_WIDTH - 60) / 3;

export default class Category extends React.PureComponent {
  _onPress = () => {
    this.props.handleOnPress();
  };

  render() {
    const { category, index } = this.props;

    return (
      <TouchableOpacity key={index} onPress={this._onPress}>
        <View
          style={[styles.category, (index + 2) % 3 === 0 ? styles.even : {}]}
        >
          <View style={styles.categoryIcon}>{category.icon}</View>
          <Text style={styles.categoryName}>{category.name}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  category: {
    width: CATEGORY_WIDTH,
    height: 140,
    borderWidth: 1,
    borderColor: Colors.congoBrown,
    padding: 10,
    marginVertical: 5,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  even: {
    marginHorizontal: 10,
  },
  categoryIcon: {
    height: "60%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryName: {
    fontSize: 12,
    color: Colors.congoBrown,
    marginTop: 10,
  },
});
