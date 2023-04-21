import { Ionicons } from "@expo/vector-icons";
import Colors from "../shared/constants/Colors";
import Layout from "../shared/constants/Layout";
import Touchable from "../shared/components/Touchable";
import React, { Component } from "react";
import {
  RefreshControl,
  FlatList,
  StyleSheet,
  View,
  Text,
  AsyncStorage,
  ActivityIndicator,
} from "react-native";
import History from "../components/History";

const SCREEN_WIDTH = Layout.window.width;

export default class BookmarksScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      isLoading: false,
      data: [],
    };
  }

  async componentDidMount() {
    const email = await AsyncStorage.getItem("email");
    this.getData(email);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: `History`,
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

  getData = (email) => {
    this.setState({ isLoading: true });

    const url =
      "https://books.timotech.com.ng/api/books/getorders/?username=" +
      JSON.parse(email);

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
          data: responseJson,
        });
      })
      .catch((error) => {
        console.log(error.message);
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  _keyExtractor = (item, index) => `${index}`;

  _renderItem = ({ item }) => (
    <View>
      <History key={item.bookId} pick={item} />
    </View>
  );

  render() {
    return (
      <View style={styles.container}>
        {this.state.isLoading ? (
          <View style={{ marginTop: 20 }}>
            <ActivityIndicator
              size="large"
              color="#00ff00"
              animating={this.state.isLoading}
            />
          </View>
        ) : this.state.data.length > 0 ? (
          <View style={styles.content}>
            <FlatList
              data={this.state.data}
              extraData={this.state}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
              scrollEventThrottle={16}
              showsHorizontalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
                />
              }
            />
          </View>
        ) : (
          <View style={(styles.content, styles.emptyCart)}>
            <Text style={styles.emptyCartText}>You are yet to buy a book</Text>
          </View>
        )}
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
  emptyCart: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 0,
  },
  emptyCartText: {
    fontSize: 16,
    color: Colors.congoBrown,
    marginVertical: 5,
  },
});
