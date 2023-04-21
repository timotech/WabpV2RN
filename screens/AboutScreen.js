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
  Image,
  Text,
  AsyncStorage,
} from "react-native";
import { WebView } from "react-native-webview";

const SCREEN_WIDTH = Layout.window.width;

export default class AboutScreen extends Component {
  state = {
    refreshing: false,
    about: "",
  };

  async componentDidMount() {
    // const aboutus = await AsyncStorage.getItem("aboutus");
    // if (aboutus != null) {
    //   this.setState({
    //     about: JSON.parse(aboutus),
    //   });
    // } else {
    this.getData();
    //}
  }

  getData = async () => {
    let url = "https://books.timotech.com.ng/api/books/getaboutus";

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
          about: responseJson.description,
        });

        AsyncStorage.setItem(
          "aboutus",
          JSON.stringify(responseJson.description)
        );
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: `About`,
      headerLeft: (
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

  render() {
    const html = `
    <html>
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>About Us</title>
    </head>
    <body>
      ${this.state.about}
    </body>
    </html>
    `;

    return (
      <View style={styles.container}>
        {/* <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        > */}
        <View style={styles.content}>
          <Image
            source={require("../assets/banner.png")}
            style={{ height: 98, width: 290 }}
          />
          <WebView
            source={{ html: html }}
            style={{
              marginTop: 10,
              marginBottom: 10,
              textAlign: "center",
              fontSize: 18,
            }}
          />
          {/* <Text
              style={{
                marginTop: 10,
                marginBottom: 10,
                textAlign: "center",
                fontSize: 18,
              }}
            >
            {this.state.about.replace(/<\/?[^>]+(>|$)/g, "")}           
            </Text> */}
        </View>
        {/* </ScrollView> */}
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
    flexDirection: "column",
    padding: 20,
  },
});
