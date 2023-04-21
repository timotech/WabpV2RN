import { Ionicons } from "@expo/vector-icons";
import Colors from "../shared/constants/Colors";
import Layout from "../shared/constants/Layout";
import React, { Component } from "react";
import {
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ProgressBar, Pick } from "../components";

const SCREEN_WIDTH = Layout.window.width;
const FORM_WIDTH = SCREEN_WIDTH - 40;

export default class SearchScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searching: false,
      searchTerm: "",
      searchResults: [],
    };

    this.arrayholder = [];
  }
  componentDidMount() {
    this.getData();
  }

  static navigationOptions = {
    header: null,
  };

  getData = () => {
    this.setState({ isLoading: true });

    const url = "https://books.timotech.com.ng/api/books/search";
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
          searchResults: responseJson,
        });
        this.arrayholder = responseJson;
      })
      .catch((error) => {
        alert(error.message);
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  _search = (searchTerm) => {
    this.searchFilterFunction(searchTerm);
    //this._toggleSearch(searchTerm);
    setTimeout(() => {
      this.setState({ searching: false });
    }, 1500);
  };

  //_toggleSearch = (searchTerm) => {
  // this.setState(() => {
  //   let searching = false;
  //   if (searchTerm.length > 3) {
  //     searching = true;
  //   }
  //   return { searchTerm, searching };
  // });
  //};

  searchFilterFunction = (searchTerm) => {
    this.setState(() => {
      let searching = false;
      if (searchTerm.length > 0) {
        searching = true;
      }
      return { searchTerm, searching };
    });

    const newData = this.arrayholder.filter((item) => {
      const itemData = `${item.title.toUpperCase()}`;
      const textData = searchTerm.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      searchResults: newData,
    });
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
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={Colors.blueViolet}
        />

        <View style={styles.header}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
            {this.state.searchTerm
              ? `Search results for '${this.state.searchTerm}'`
              : `Start typing to search...`}
          </Text>

          <TouchableOpacity
            style={styles.closeContainer}
            onPress={() => this.props.navigation.goBack()}
          >
            <Ionicons name="md-close" size={30} style={styles.closeIcon} />
          </TouchableOpacity>
        </View>

        <View style={[styles.formContainer]}>
          <TextInput
            value={this.state.searchTerm}
            autoFocus={true}
            onChangeText={(text) => this._search(text)}
            underlineColorAndroid="transparent"
            style={styles.textInput}
          />
          {
            /** Progress Bar */
            this.state.searching && this.state.searchResults.length < 1 && (
              <ProgressBar
                progressTintColor={Colors.congoBrown}
                initialProgress={0}
                style={styles.activityIndicatorWrapper}
              />
            )
            /** Progress Bar */
          }
        </View>
        <View style={styles.content}>
          <FlatList
            data={this.state.searchResults}
            extraData={this.state}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            scrollEventThrottle={16}
            numColumns={3}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    color: Colors.congoBrown,
    marginTop: 10,
  },
  closeContainer: {
    position: "absolute",
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  closeIcon: {
    color: Colors.congoBrown,
  },
  formContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    marginBottom: 20,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  textInput: {
    width: FORM_WIDTH,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.congoBrown,
    fontSize: 18,
    letterSpacing: 1,
    paddingVertical: 5,
    color: Colors.congoBrown,
  },
  activityIndicatorWrapper: {
    width: FORM_WIDTH,
    position: "absolute",
    ...Platform.select({
      ios: {
        bottom: -2,
      },
      android: {
        bottom: -7,
      },
    }),
  },
});
