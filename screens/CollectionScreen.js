import { Ionicons } from "@expo/vector-icons";
import Colors from "../shared/constants/Colors";
import Layout from "../shared/constants/Layout";
import Touchable from "../shared/components/Touchable";
import React, { Component } from "react";
import {
  RefreshControl,
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Collection from "../components/Collection";
import * as FileSystem from "expo-file-system";
//import base64 from "react-native-base64";

const SCREEN_WIDTH = Layout.window.width;

export default class CollectionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      dataBook: [],
      selectCatg: 0,
      isLoading: false,
      isUpdating: false,
      error: null,
      isConnected: false,
      base64Code: "",
      downloading: false,
      totalProgress: 0,
      writeProgress: 0,
      fileSize: 0,
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: `My Collections`,
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

  componentWillUnmount() {
    this._subscribe.remove();
    //console.log("I unmounted");
  }

  async componentDidMount() {
    this._subscribe = this.props.navigation.addListener("didFocus", () => {
      this.getData();
      //Put your Data loading function here instead of my this.LoadData()
    });

    // const allConnections = await AsyncStorage.getItem("collections");
    // if (allConnections == null) {
    //   //console.log('I got here');
    //   this.getOnlineCollection();
    // }
  }

  getData = async () => {
    this.setState({ isLoading: true });

    const allConnections = await AsyncStorage.getItem("collections");

    if (allConnections !== null) {
      //console.log("getting local collections");
      this.setState({
        isLoading: false,
        dataBook: JSON.parse(allConnections),
      });
    } else {
      this.getOnlineCollection();
    }
  };

  getOnlineCollection = async () => {
    let email = await AsyncStorage.getItem("email");

    let url = `https://books.timotech.com.ng/api/books/GetMyCollection?Email=${JSON.parse(
      email
    )}`;

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

        //store in storage here
        //this.saveFile(responseJson);
        AsyncStorage.setItem("collections", JSON.stringify(responseJson));
        //const allConnections = AsyncStorage.getItem("collections");
      })
      .catch((error) => {
        ToastAndroid.show(error.message, ToastAndroid.SHORT);
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  downloadEbook = async (ebookPath, title, id) => {
    let total = 0;
    let writeByte = 0;
    let filePath =
      "https://books.timotech.com.ng/images/compressed/" + ebookPath + ".txt";
    //let filePath = "https://books.timotech.com.ng/images/compressed/Book4.txt";

    console.log("downloading from: " + filePath);

    this.setState({ downloading: true });

    const callback = (downloadProgress) => {
      total = downloadProgress.totalBytesExpectedToWrite / 1000;
      writeByte = downloadProgress.totalBytesWritten / 1000;

      this.setState({
        totalProgress:
          total == -0.001
            ? this.state.fileSize / 1000
            : writeByte > this.state.fileSize / 1000
            ? writeByte
            : total,
        writeProgress: writeByte,
      });
    };

    const downloadResumable = FileSystem.createDownloadResumable(
      filePath,
      FileSystem.documentDirectory + ebookPath + ".txt",
      {},
      callback
    );

    try {
      const { uri } = await downloadResumable.downloadAsync();
      console.log("Finished downloading to ", uri);

      this.setState({ downloading: false });
      this.setState({ isLoading: true });
      //update database book downloaded to device
      var message = this._updateCollectionInfo(id);
      //console.log("Collection Update: ", message);

      let tmp = await FileSystem.getInfoAsync(
        FileSystem.documentDirectory + ebookPath + ".txt"
      );

      if (tmp.exists) {
        let file = await FileSystem.readAsStringAsync(tmp.uri);
        console.log(file.substring(100));
        this.viewFile(uri, title);
      }
      this.setState({ isLoading: false });
    } catch (e) {
      this.setState({ downloading: false });

      alert("Error Downloading Book. Please try again!");
      return;
      //this.getData();
    }
  };

  viewFile = async (fileUri, title) => {
    let file = await FileSystem.readAsStringAsync(fileUri);

    this.setState({
      base64Code: file,
      downloading: false,
    });
    this.props.navigation.navigate("Views", {
      base64Code: this.state.base64Code,
      title: title,
    });
  };

  downloadEbookNew = async (ebookPath, title, id) => {
    //console.log("downloading");
    this.setState({ downloading: true });
    const { uri } = await FileSystem.downloadAsync(
      "https://books.timotech.com.ng/images/compressed/" + ebookPath + ".txt",
      FileSystem.documentDirectory + ebookPath + ".txt"
    )
      .then(({ uri }) => {
        console.log("Finished downloading to ", uri);
        this.setState({ downloading: false });
        var message = this._updateCollectionInfo(id);
        console.log("Collection Update: ", message);
        this.viewFile(uri, title);
      })
      .catch((error) => {
        alert("Network Error or file Unreachable. Please try again!");
        //return;
        this.getData();
      });
  };

  readEbook = async (ebookPath, title, fileSize, id) => {
    try {
      this.setState({ isLoading: true });
      this.setState({ fileSize: fileSize });
      //ebookPath = ebookPath.split(".").slice(0, -1).join(".");

      let tmp = await FileSystem.getInfoAsync(
        FileSystem.documentDirectory + ebookPath + ".txt"
      );

      if (!tmp.exists) {
        //Check whether already downloaded before continuing
        var getStatus = await this._checkDownloaded(id);

        if (getStatus == 0) {
          this.downloadEbook(ebookPath, title, id);
        } else {
          alert("Ebook Already Downloaded!");
          this.getData();
          //return;
        }
      }

      //Check if file size is accurate
      if (tmp.exists && tmp.size !== fileSize) {
        await FileSystem.deleteAsync(
          FileSystem.documentDirectory + ebookPath + ".txt"
        );
        //download afresh
        this.downloadEbook(ebookPath, title, id);
      } else {
        this.viewFile(tmp.uri, title);
      }
    } catch (error) {
      ToastAndroid.show(
        "Error Reading Book: " + error.message,
        ToastAndroid.LONG
      );
      //console.log("Error reading Book: ", error.message);
    }
  };

  _updateCollectionInfo = async (id) => {
    this.setState({ isUpdating: true });

    let email = await AsyncStorage.getItem("email");

    let url = `https://books.timotech.com.ng/api/books/UpdateCollection?id=${id}&email=${JSON.parse(
      email
    )}`;
    //console.log("updating link: ", url);

    return fetch(url, {
      method: "PUT",
      headers: {
        Accept: "*/*",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          //console.log("Error occured: ", response.json());
          throw new Error(response.json());
        }
      })
      .then((responseJson) => {
        this.setState({
          isUpdating: false,
        });
        //console.log("Collection Update", responseJson.message);
        return JSON.stringify(responseJson.message);
      })
      .catch((error) => {
        ToastAndroid.show(
          "Error Updating User Setting: " + error.message,
          ToastAndroid.LONG
        );
        //console.log("error updating db: ", error.message);
      });
  };

  _checkDownloaded = async (id) => {
    let email = await AsyncStorage.getItem("email");

    let url = `https://books.timotech.com.ng/api/books/checkdownload?id=${id}&email=${JSON.parse(
      email
    )}`;

    return fetch(url, {
      method: "GET",
      headers: {
        Accept: "*/*",
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
        return JSON.parse(responseJson);
      })
      .catch((error) => {
        // Alert.alert("Something Went Wrong", error.message, [
        //   {
        //     text: "Try Again",
        //     onPress: this.getData,
        //   },
        // ]);
        //console.log(error.message);
      });
  };

  _onRefresh = () => {
    this.setState({ refreshing: true });
    setTimeout(() => {
      this.getOnlineCollection();
      this.setState({ refreshing: false });
    }, 10000);
  };

  _keyExtractor = (item, index) => `${index}`;

  _renderItem = ({ item }) => (
    <View>
      <Collection
        key={item.id}
        pick={item}
        handleOnPress={() =>
          this.readEbook(item.ebookPath, item.title, item.fileSize, item.id)
        }
      />
    </View>
  );

  render() {
    return (
      <View style={styles.container}>
        {this.state.downloading ? (
          <View style={{ marginTop: 20 }}>
            <ActivityIndicator
              size="large"
              color="#00ff00"
              animating={this.state.downloading}
            />
            <Text
              style={{
                marginTop: 30,
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                fontSize: 18,
              }}
            >
              Fetching Ebook for first time use at {this.state.writeProgress}kb
              of {this.state.totalProgress}kb
              {/* Fetching Ebook for first time download... Please wait!!! */}
            </Text>
          </View>
        ) : this.state.isLoading ? (
          <View style={{ marginTop: 20 }}>
            <ActivityIndicator
              size="large"
              color="#00ff00"
              animating={this.state.isLoading}
            />
          </View>
        ) : (
          <View style={styles.content}>
            <FlatList
              data={this.state.dataBook}
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
            <Text>Pull down to refresh</Text>
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
  author: {
    fontSize: 12,
    color: Colors.congoBrown,
  },
  genre: {
    fontSize: 10,
    color: Colors.congoBrown,
  },
});
