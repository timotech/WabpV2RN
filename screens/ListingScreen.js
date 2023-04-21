import { Ionicons } from "@expo/vector-icons";
import Colors from "../shared/constants/Colors";
import Layout from "../shared/constants/Layout";
import Touchable from "../shared/components/Touchable";
import React, { Component } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  FlatList,
} from "react-native";

import Pick from "../components/Pick";

const SCREEN_WIDTH = Layout.window.width;

export default class ListingScreen extends Component {
  // state = {
  //     refreshing: false,
  // }

  constructor(props) {
    super(props);
    this.state = {
      dataBook: [],
      selectCatg: 0,
      isLoading: false,
      error: null,
      refreshing: false,
    };
  }

  componentDidMount() {
    const id = this.props.navigation.getParam("id");
    this.getData(id);
  }

  getData = async (id) => {
    this.setState({ isLoading: true });

    const url = `https://books.timotech.com.ng/api/books/GetCategories?id=${id}`;
    return fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Network error, or Something went wrong ...");
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          dataBook: responseJson,
        });
      })
      .catch((error) => {
        Alert.alert("Something Went Wrong", error.message, [
          {
            text: "Try Again",
            onPress: this.getData,
          },
        ]);
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: navigation.getParam("name"),
      headerLeft: () => (
        <Touchable
          background={Touchable.Ripple(Colors.blueViolet, true)}
          style={[styles.headerItem, styles.headerIcon]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="ios-arrow-back" size={25} color={Colors.congoBrown} />
        </Touchable>
      ),
    };
  };

  _onRefresh = () => {
    this.setState({ refreshing: true });
    setTimeout(() => {
      this.setState({ refreshing: false });
    }, 1500);
  };

  _renderItem = ({ item }) => (
    <Pick
      key={item.id}
      pick={item}
      handleOnPress={() => this.props.navigation.navigate("Detail", item)}
    />
  );

  render() {
    return (
      <View style={styles.container}>
        {/** Content */}
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          <View style={styles.content}>
            <FlatList
              data={this.state.dataBook}
              extraData={this.state}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
              scrollEventThrottle={16}
              numColumns={3}
            />
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
    paddingVertical: 9,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
});
