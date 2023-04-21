import Colors from "../shared/constants/Colors";
import React, { useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import Best from "./Best";

const Books = () => {
  const [dataBook, setDataBook] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    getData = async () => {
      setIsLoading(true);

      try {
        const url = "https://books.timotech.com.ng/api/books/bestbooks";
        const response = await fetch(url, options);
        const json = await response.json();
        setDataBook(json);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        ToastAndroid.show("Books Error: " + error, ToastAndroid.SHORT);
      }
    };

    getData();
  }, []);

  _keyExtractor = (item, index) => `${index}`;

  _renderItem = ({ item }) => (
    <Best
      key={item.id}
      pick={item}
      handleOnPress={() => navigation.navigate("Detail", item)}
    />
  );

  return (
    <View>
      <Text style={styles.title}>Best of Prose</Text>
      {isLoading && (
        <ActivityIndicator
          size="large"
          color="#00ff00"
          animating={isLoading}
          style={{ marginTop: 20 }}
        />
      )}
      <FlatList
        data={dataBook}
        keyExtractor={_keyExtractor}
        renderItem={_renderItem}
        scrollEventThrottle={16}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    color: Colors.congoBrown,
    marginTop: 5,
    marginBottom: 20,
  },
});

export default Books;
