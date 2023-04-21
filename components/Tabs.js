import React, { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../shared";

const Tabs = (props) => {
  const [categories, setCategories] = useState(props.Data);
  const [selectedCategory, setSelectedCategory] = useState(1);

  _keyExtractor = (item, index) => `${index}`;

  _renderItem = ({ item }) => (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={{ flex: 1, marginRight: 24 }}
        onPress={() => {
          setSelectedCategory(item.id);
          props.onSelected(item.id);
        }}
      >
        {selectedCategory == item.id && (
          <Text style={{ fontSize: 15, color: Colors.congoBrown }}>
            {item.categoryName}
          </Text>
        )}
        {selectedCategory != item.id && (
          <Text style={{ fontSize: 15, color: Colors.lightGray }}>
            {item.categoryName}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={categories}
        showsHorizontalScrollIndicator={false}
        renderItem={_renderItem}
        keyExtractor={_keyExtractor}
        horizontal
      />
    </View>
  );
};

export default Tabs;
