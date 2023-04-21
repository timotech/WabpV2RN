import Layout from "../shared/constants/Layout";
import React from "react";
import { StyleSheet, TouchableOpacity, View, Image } from "react-native";

//import ProductImage from './ProductImage'

const SCREEN_WIDTH = Layout.window.width;
const LARGE_BOOK_WIDTH = (SCREEN_WIDTH - 20) / 3 + 10;

export default class Best extends React.PureComponent {
  _onPress = () => {
    this.props.handleOnPress();
  };

  render() {
    const { pick } = this.props;

    return (
      <TouchableOpacity onPress={this._onPress}>
        <View style={styles.largeBookItem}>
          {/* <ProductImage style={{
                        width: '100%',
                        height: '70%',
                    }} /> */}
          <Image
            style={{ width: "100%", height: "70%" }}
            resizeMode="contain"
            source={{ uri: pick.picPath }}
          />
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
});
