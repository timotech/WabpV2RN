import { Ionicons } from "@expo/vector-icons";
import Colors from "../shared/constants/Colors";
import Layout from "../shared/constants/Layout";
import Touchable from "../shared/components/Touchable";
import React, { useState, useEffect } from "react";
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

const CollectionScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [dataBook, setDataBook] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [base64Code, setBase64Code] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [totalProgress, setTotalProgress] = useState(0);
  const [writeProgress, setWriteProgress] = useState(0);
  const [fileSize, setFileSize] = useState(0);

  useEffect(() => {
    navigation.setOptions({
      title: "My Collections",
      headerLeft: () => (
        <Touchable
          background={Touchable.Ripple(Colors.blueViolet, true)}
          style={[styles.headerItem, styles.headerIcon]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="ios-arrow-back" size={25} color={Colors.congoBrown} />
        </Touchable>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (refreshing) {
      getOnlineCollection();
      setRefreshing(false);
    }
  }, [refreshing]);

  const getData = async () => {
    setIsLoading(true);

    const allConnections = await AsyncStorage.getItem("collections");

    if (allConnections !== null) {
      setIsLoading(false);
      setDataBook(JSON.parse(allConnections));
    } else {
      getOnlineCollection();
    }
  };

  const getOnlineCollection = async () => {
    setIsLoading(true);
    const email = await AsyncStorage.getItem("email");

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
        setIsLoading(false);
        setDataBook(responseJson);
        //store in storage here
        AsyncStorage.setItem("collections", JSON.stringify(responseJson));
      })
      .catch((error) => {
        ToastAndroid.show(error, ToastAndroid.LONG);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const downloadEbook = async (ebookPath, title, id) => {
    let total = 0;
    let writeByte = 0;
    let filePath =
      "https://books.timotech.com.ng/images/compressed/" + ebookPath + ".txt";
    //let filePath = "https://books.timotech.com.ng/images/compressed/Book4.txt";

    console.log("downloading from: " + filePath);

    setIsLoading(true);
    setDownloading(true);

    const callback = (downloadProgress) => {
      total = downloadProgress.totalBytesExpectedToWrite / 1000;
      writeByte = downloadProgress.totalBytesWritten / 1000;

      total == -0.001
        ? this.state.fileSize / 1000
        : writeByte > this.state.fileSize / 1000
        ? writeByte
        : total;

      setTotalProgress(total);
      setWriteProgress(writeByte);
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

      setDownloading(false);
      setIsLoading(true);
      //update database book downloaded to device
      //var message =
      _updateCollectionInfo(id);
      //console.log("Collection Update: ", message);

      let tmp = await FileSystem.getInfoAsync(
        FileSystem.documentDirectory + ebookPath + ".txt"
      );

      if (tmp.exists) {
        let file = await FileSystem.readAsStringAsync(tmp.uri);
        console.log(file.substring(100));
        viewFile(uri, title);
      }
      setIsLoading(false);
    } catch (e) {
      setDownloading(false);

      alert("Error Downloading Book. Please try again!");
      return;
      //this.getData();
    }
  };

  viewFile = async (fileUri, title) => {
    let file = await FileSystem.readAsStringAsync(fileUri);

    setDownloading(false);
    setBase64Code(file);

    navigation.navigate("Views", {
      base64Code: base64Code,
      title: title,
    });
  };

  downloadEbookNew = async (ebookPath, title, id) => {
    //console.log("downloading");
    setDownloading(true);
    const { uri } = await FileSystem.downloadAsync(
      "https://books.timotech.com.ng/images/compressed/" + ebookPath + ".txt",
      FileSystem.documentDirectory + ebookPath + ".txt"
    )
      .then(({ uri }) => {
        console.log("Finished downloading to ", uri);
        setDownloading(false);
        var message = _updateCollectionInfo(id);
        console.log("Collection Update: ", message);
        viewFile(uri, title);
      })
      .catch((error) => {
        alert("Network Error or file Unreachable. Please try again!");
        //return;
        //getData();
      });
  };

  readEbook = async (ebookPath, title, fileSize, id) => {
    try {
      setIsLoading(true);
      setFileSize(fileSize);
      //ebookPath = ebookPath.split(".").slice(0, -1).join(".");

      let tmp = await FileSystem.getInfoAsync(
        FileSystem.documentDirectory + ebookPath + ".txt"
      );

      if (!tmp.exists) {
        //Check whether already downloaded before continuing
        var getStatus = await _checkDownloaded(id);

        if (getStatus == 0) {
          downloadEbook(ebookPath, title, id);
        } else {
          alert("Ebook Already Downloaded!");
          //this.getData();
          //return;
        }
      }

      //Check if file size is accurate
      if (tmp.exists && tmp.size !== fileSize) {
        await FileSystem.deleteAsync(
          FileSystem.documentDirectory + ebookPath + ".txt"
        );
        //download afresh
        downloadEbook(ebookPath, title, id);
      } else {
        viewFile(tmp.uri, title);
      }
    } catch (error) {
      ToastAndroid.show("Error Reading Book: " + error, ToastAndroid.LONG);
    }
  };

  _updateCollectionInfo = async (id) => {
    setIsUpdating(true);

    let email = await AsyncStorage.getItem("email");

    let url = `https://books.timotech.com.ng/api/books/UpdateCollection?id=${id}&email=${JSON.parse(
      email
    )}`;

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
        setIsUpdating(false);
        //console.log("Collection Update", responseJson.message);
        return JSON.stringify(responseJson.message);
      })
      .catch((error) => {
        ToastAndroid.show(
          "Error Updating User Setting: " + error,
          ToastAndroid.LONG
        );
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
        ToastAndroid.show(
          "Error Checking Downloaded File: " + error,
          ToastAndroid.LONG
        );
      });
  };

  // _onRefresh = () => {
  //   setRefreshing(true);
  //   setTimeout(() => {
  //     getOnlineCollection();
  //     setRefreshing(false);
  //   }, 10000);
  // };

  _keyExtractor = (item, index) => `${index}`;

  _renderItem = ({ item }) => (
    <View>
      <Collection
        key={item.id}
        pick={item}
        handleOnPress={() =>
          readEbook(item.ebookPath, item.title, item.fileSize, item.id)
        }
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {downloading && (
        <View style={{ marginTop: 20 }}>
          <ActivityIndicator
            size="large"
            color="#00ff00"
            animating={downloading}
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
            Fetching Ebook for first time use at {writeProgress}kb of{" "}
            {totalProgress}kb
            {/* Fetching Ebook for first time download... Please wait!!! */}
          </Text>
        </View>
      )}
      {isLoading && (
        <View style={{ marginTop: 20 }}>
          <ActivityIndicator
            size="large"
            color="#00ff00"
            animating={isLoading}
          />
        </View>
      )}
      {!downloading && !isLoading && (
        <View style={styles.content}>
          <FlatList
            data={dataBook}
            keyExtractor={_keyExtractor}
            renderItem={_renderItem}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={() => setRefreshing(true)}
          />
          <Text>Pull down to refresh</Text>
        </View>
      )}
    </View>
  );
};

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
    paddingVertical: 15,
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

export default CollectionScreen;
