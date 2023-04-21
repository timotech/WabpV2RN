import { Colors } from "../shared";
import React, { useState, useEffect } from "react";
import { View, ToastAndroid, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Tabs from "./Tabs";
import TabItem from "./TabItem";

const Showcase = () => {
  const [dataBook, setDataBook] = useState([]);
  const [dataBest, setDataBest] = useState([]);
  const [dataMost, setDataMost] = useState([]);
  const [dataKids, setDataKids] = useState([]);

  const categoriesData = [
    {
      id: 1,
      categoryName: "Top Picks",
      books: dataBook,
    },
    {
      id: 2,
      categoryName: "Best Selling",
      books: dataBest,
    },
    {
      id: 3,
      categoryName: "Most Viewed",
      books: dataMost,
    },
    {
      id: 4,
      categoryName: "Kids Special",
      books: dataKids,
    },
  ];

  const [categoryData, setCategoryData] = useState(categoriesData);
  const [selectCatg, setSelectCatg] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getSelectedCategory = (index) => {
    setSelectCatg(index);
  };

  const updateCategoryData = (index, book) => {
    setCategoryData((prevState) => {
      const newState = prevState.map((obj) => {
        if (obj.id === index) {
          return { ...obj, books: book };
        }

        return obj;
      });

      return newState;
    });
  };

  useEffect(() => {
    setIsLoading(true);
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    // Promise.all([
    //   fetch("https://books.timotech.com.ng/api/books"),
    //   fetch("https://books.timotech.com.ng/api/books/bestselling"),
    //   fetch("https://books.timotech.com.ng/api/books/mostviewed"),
    //   fetch("https://books.timotech.com.ng/api/books/bestbooks"),
    // ])
    //   .then(([resBooks, resBestSelling, resMostViewed, resBestBooks]) =>
    //     Promise.all([
    //       resBooks.json(),
    //       resBestSelling.json(),
    //       resMostViewed.json(),
    //       resBestBooks.json(),
    //     ])
    //   )
    //   .then(([dataBook, dataBest, dataMost, dataKids]) => {
    //     setDataBook(dataBook);
    //     updateCategoryData(1, dataBook);
    //     setDataBest(dataBest);
    //     updateCategoryData(2, dataBest);
    //     setDataMost(dataMost);
    //     updateCategoryData(3, dataMost);
    //     setDataKids(dataKids);
    //     updateCategoryData(4, dataKids);
    //     setIsLoading(false);
    //   });

    const getDatas = async (url, storageItem, errorText, options) => {
      const allConnections = await AsyncStorage.getItem(storageItem);

      if (allConnections !== null) {
        return JSON.parse(allConnections);
      } else {
        try {
          const response = await fetch(url, options);
          const json = await response.json();
          AsyncStorage.setItem(storageItem, JSON.stringify(json));
          return json;
        } catch (error) {
          ToastAndroid.show(errorText + error, ToastAndroid.LONG);
        }
      }
    };

    const fetchAll = async () => {
      const getBooks = await getDatas(
        "https://books.timotech.com.ng/api/books",
        "showcase",
        "Top Picks Error: ",
        options
      );
      const getBests = await getDatas(
        "https://books.timotech.com.ng/api/books/bestselling",
        "bestselling",
        "Best Selling Error: ",
        options
      );
      const getMosts = await getDatas(
        "https://books.timotech.com.ng/api/books/mostviewed",
        "mostviewed",
        "Most Visited Error: ",
        options
      );
      const getKids = await getDatas(
        "https://books.timotech.com.ng/api/books/bestbooks",
        "kidsSpecial",
        "Kids Special Error: ",
        options
      );
      setDataBook(getBooks);
      updateCategoryData(1, getBooks);
      setDataBest(getBests);
      updateCategoryData(2, getBests);
      setDataMost(getMosts);
      updateCategoryData(3, getMosts);
      setDataKids(getKids);
      updateCategoryData(4, getKids);
      setIsLoading(false);
    };

    fetchAll();
  }, []);

  return (
    <View>
      {/** Tabs */}
      <View
        style={{
          backgroundColor: Colors.snow,
        }}
      >
        {/** Tabs */}
        <Tabs Data={categoryData} onSelected={getSelectedCategory} />
        {/* Tab Items */}
        <TabItem Data={categoryData} Selected={selectCatg} />
        {isLoading && (
          <ActivityIndicator
            size="large"
            color="#00ff00"
            animating={isLoading}
            style={{ marginTop: 20 }}
          />
        )}
      </View>
    </View>
  );
};

// const styles = StyleSheet.create({
//   tabStyle: {
//     backgroundColor: "transparent",
//     justifyContent: "flex-start",
//     paddingLeft: 0,
//     marginRight: 20,
//   },
//   tabTextStyle: {
//     color: Colors.congoBrown,
//     fontSize: 12,
//     fontWeight: "normal",
//     marginLeft: -1,
//   },
//   tabContent: {
//     paddingVertical: 20,
//     backgroundColor: Colors.snow,
//   },
// });

export default Showcase;
