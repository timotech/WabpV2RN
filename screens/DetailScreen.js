import { Feather, Ionicons } from "@expo/vector-icons";
import { Colors, Layout, Touchable } from "../shared";
import React, { useState, useEffect, useContext } from "react";
import {
  ToastAndroid,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AdditionalInfo, AddReview, CartNumItems } from "../components";
import CartContext from "../store/cart-context";

const SCREEN_WIDTH = Layout.window.width;
const BOOK_WIDTH = (SCREEN_WIDTH - 50) * 0.4;

const DetailScreen = (props) => {
  const [qtys, setQty] = useState(1);
  const [submittedRating, setSubmittedRating] = useState(0);
  const [submittedComment, setSubmittedComment] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [reviewModalVisible, setReviewModalVisibile] = useState(false);
  const [reviewData, setReviewData] = useState([]);
  const { navigation, route } = props;
  //const [title, setTitle] = React.useState(route.params.title)

  const cartCtx = useContext(CartContext);

  useEffect(() => {
    navigation.setOptions({
      title: route.params.title,
      headerLeft: () => (
        <Touchable
          background={Touchable.Ripple(Colors.blueViolet, true)}
          style={[styles.headerItem, styles.headerIcon]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="ios-arrow-back" size={25} color={Colors.congoBrown} />
        </Touchable>
      ),
      headerRight: () => (
        <Touchable
          background={Touchable.Ripple(Colors.blueViolet, true)}
          style={[
            styles.headerItem,
            styles.headerIcon,
            { paddingVertical: 15 },
          ]}
          onPress={() => navigation.navigate("Cart")}
        >
          <View
            style={{
              position: "relative",
            }}
          >
            <Feather name="shopping-cart" size={20} color={Colors.congoBrown} />
            <View style={styles.cartHasItems}>
              <CartNumItems />
            </View>
          </View>
        </Touchable>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    _getReviews();
  }, []);

  const _getReviews = () => {
    var id = route.params.id;

    const url = `https://books.timotech.com.ng/api/books/getreviews?BookId=${id}`;

    fetch(url, {
      method: "GET",
      headers: {
        Accept: "*/*",
      },
    })
      .then((res) => res.json())
      .then(
        (responseJson) => {
          setReviewData(responseJson);
        },
        (error) => {
          ToastAndroid.show("Details Error: " + error, ToastAndroid.LONG);
        }
      );
  };

  const _setReviewData = (value) => {
    setReviewData(value);
    _getReviews();
  };

  const _setReviewModalVisible = (visible) => {
    setReviewModalVisibile(visible);
  };

  _onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const _incrementQty = () => {
    setQty((qty) => qty + 1);
  };

  const _decreaseQty = () => {
    const prevQty = qtys;
    if (prevQty > 1) {
      setQty((prevQty) => prevQty - 1);
    }
  };

  const _handleQtyChanged = (value) => {
    let qty = +value;
    if (qty >= 0) {
      setQty(qty);
    }
  };

  const _addToCart = async (data) => {
    const logged = await AsyncStorage.getItem("authtoken");
    if (!logged) {
      return navigation.navigate("Auth");
    }

    const itemcart = {
      id: data.id,
      book: data,
      quantity: qtys,
      price: data.price,
    };

    //Get all items in collection and check if item already exists
    var allCollections = await AsyncStorage.getItem("collections");

    if (allCollections !== null) {
      var allColls = JSON.parse(allCollections);
      var itemExists = allColls.filter(
        (item) => item.title === itemcart.book.title
      );

      if (itemExists.length !== 0) {
        alert("Item already Purchased!!!");
        return;
      }
    }

    const qty = qtys;
    if (qty < 1) {
      alert(`You cannot add ${qty} quantity of this item`);
      return;
    }

    cartCtx.addItem(itemcart);
    alert("Book Added To Cart");
    // AsyncStorage.getItem("cart")
    //   .then((datacart) => {
    //     if (datacart !== null) {
    //       // We have data!!
    //       const cart = JSON.parse(datacart);
    //       cart.push(itemcart);
    //       AsyncStorage.setItem("cart", JSON.stringify(cart));
    //     } else {
    //       const cart = [];
    //       cart.push(itemcart);
    //       console.log(cart);
    //       AsyncStorage.setItem("cart", JSON.stringify(cart));
    //     }
    //     alert("Book Added To Cart");
    //   })
    //   .catch((err) => {
    //     alert(err);
    //   });
  };

  return (
    <View style={styles.container}>
      {/** Content */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={_onRefresh} />
        }
      >
        <View style={styles.content}>
          <View style={styles.buyDetails}>
            <Image
              style={{ width: BOOK_WIDTH }}
              resizeMode="contain"
              source={{ uri: route.params.picPath }}
            />
            <View style={styles.detailsInfo}>
              <View style={styles.titleRatings}>
                <Text
                  numberOfLines={4}
                  ellipsizeMode="tail"
                  style={[styles.title]}
                >
                  {route.params.title}
                </Text>
                <View style={styles.rating}>
                  <Text style={styles.ratingText}>{4.9}</Text>
                </View>
              </View>
              <Text
                numberOfLines={3}
                ellipsizeMode="tail"
                style={styles.short_description}
              >
                {route.params.description}
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.qtyLeft}
              >
                In stock
              </Text>

              <View style={styles.prices}>
                <Text
                  style={[
                    styles.price,
                    route.params.specialPrice ? styles.oldPrice : {},
                  ]}
                >
                  N{route.params.price}
                </Text>
                {route.params.specialPrice !== 0 && (
                  <Text style={[styles.price, styles.newPrice]}>
                    N{route.params.specialPrice}
                  </Text>
                )}
              </View>
              {/* <Text numberOfLines={1} ellipsizeMode='tail' style={styles.freeShipping}>FREE Shipping on eligible orders</Text> */}
            </View>
          </View>

          <AdditionalInfo
            description={route.params.fullInfo}
            reviews={reviewData}
            setModalVisible={_setReviewModalVisible}
          />
        </View>
      </ScrollView>

      {/** -- Floating action button */}
      <TouchableOpacity
        style={styles.add}
        onPress={() => _setReviewModalVisible(true)}
      >
        <Feather name="plus" size={30} color={Colors.titanWhite} />
      </TouchableOpacity>

      <View style={styles.buyActions}>
        <View style={styles.buyQty}>
          <TouchableOpacity
            style={styles.buyQtyPlusMinusBtn}
            onPress={_decreaseQty}
          >
            <Feather name="minus" size={20} color={Colors.titanWhite} />
          </TouchableOpacity>
          <View style={styles.buyQtyInputContainer}>
            {/* <TextInput
              value={qtys}
              keyboardType="numeric"
              onChangeText={(value) => _handleQtyChanged(value)}
              style={styles.buyQtyInput}
            /> */}
            <Text style={styles.buyQtyInput}>{qtys}</Text>
          </View>
          <TouchableOpacity
            style={styles.buyQtyPlusMinusBtn}
            onPress={_incrementQty}
          >
            <Feather name="plus" size={20} color={Colors.titanWhite} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.buyBtn}
          onPress={() => _addToCart(route.params)}
        >
          <Text style={styles.buyActionsText}>Buy Now</Text>
        </TouchableOpacity>
      </View>

      {/** Review Form */}
      <AddReview
        name={route.params.title}
        modalVisible={reviewModalVisible}
        setModalVisible={_setReviewModalVisible}
        rating={submittedRating}
        comment={submittedComment}
        setData={_setReviewData}
        bookId={route.params.id}
      />
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
    paddingVertical: 9,
    paddingHorizontal: 20,
  },
  cartHasItems: {
    position: "absolute",
    top: 0,
    left: 18,
    width: 7,
    height: 7,
    backgroundColor: Colors.blueViolet,
    borderRadius: 50,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  buyDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailsInfo: {
    flexDirection: "column",
    justifyContent: "flex-start",
    width: SCREEN_WIDTH - 50 - BOOK_WIDTH,
  },
  titleRatings: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  title: {
    fontSize: 15,
    color: Colors.congoBrown,
    fontWeight: "bold",
    width: "80%",
  },
  rating: {
    width: 30,
    height: 30,
    borderWidth: 2,
    borderRadius: 100 / 2,
    borderColor: "green",
    justifyContent: "center",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
  },
  short_description: {
    fontSize: 12,
    color: Colors.congoBrown,
    marginVertical: 12,
    lineHeight: 20,
    fontWeight: "200",
  },
  qtyLeft: {
    fontSize: 12,
    color: "green",
  },
  prices: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 10,
  },
  price: {
    fontSize: 16,
    color: Colors.congoBrown,
    fontWeight: "bold",
  },
  oldPrice: {
    fontSize: 14,
    textDecorationLine: "line-through",
    textDecorationColor: Colors.congoBrown,
    fontWeight: "normal",
  },
  newPrice: {
    marginLeft: 15,
  },
  freeShipping: {
    fontSize: 12,
    color: Colors.congoBrown,
    marginVertical: 12,
    fontWeight: "200",
  },
  buyActions: {
    ...Platform.select({
      ios: {
        height: 70,
      },
      android: {
        height: 60,
      },
    }),
    backgroundColor: Colors.blueViolet,
    paddingHorizontal: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buyActionsText: {
    color: Colors.titanWhite,
    fontSize: 14,
  },
  buyQty: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: 115,
  },
  buyQtyPlusMinusBtn: {
    width: 30,
    backgroundColor: "transparent",
  },
  buyQtyInputContainer: {
    borderWidth: 0,
    borderColor: "transparent",
    width: 50,
    height: 35,
    padding: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  buyQtyInput: {
    color: Colors.titanWhite,
    fontSize: 18,
  },
  buyBtn: {
    paddingHorizontal: 15,
    alignSelf: "center",
    backgroundColor: "transparent",
  },
});

export default DetailScreen;
