import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Colors } from "../shared";
import Pick from "./Pick";
import { useNavigation } from "@react-navigation/native";

const TabItem = (props) => {
  //const { Data } = props.Data;
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(props.Selected);
  const navigation = useNavigation();

  useEffect(() => {
    setData(props.Data);
    setSelectedCategory(props.Selected);
  }, [props]);

  var books = [];

  let selectedCategoryBook = data.filter((a) => a.id == selectedCategory);

  if (selectedCategoryBook.length > 0) {
    books = selectedCategoryBook[0].books;
  }

  _keyExtractor = (item, index) => `${index}`;

  _renderItem = ({ item }) => (
    <Pick
      key={item.id}
      pick={item}
      handleOnPress={() => navigation.navigate("Detail", item)}
    />
  );

  return (
    <View style={styles.tabContent}>
      {/** Tab Content */}
      {/* data={PICKS} */}
      <FlatList
        data={books}
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
  tabContent: {
    paddingVertical: 20,
    backgroundColor: Colors.snow,
  },
});

export default TabItem;
