import { Foundation, Ionicons } from "@expo/vector-icons";
import { Colors, Touchable } from "../shared";
import React, { useState, useEffect, useRef, useContext } from "react";
import { Paystack, paystackProps } from "react-native-paystack-webview";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartItem, CartTotal } from "../components";
import CartContext from "../store/cart-context";

const CartScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const paystackWebViewRef = useRef(paystackProps.PayStackRef);

  const cartCtx = useContext(CartContext);

  useEffect(() => {
    navigation.setOptions({
      title: "Checkout Cart",
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
        <View
          style={{
            marginRight: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: Colors.blueViolet,
            }}
          >
            {/* N{cartCtx.totalAmount.toFixed(2)} */}
          </Text>
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    async function fetchDatas() {
      try {
        const logged = await AsyncStorage.getItem("authtoken");
        if (!logged) {
          return navigation.navigate("Auth");
        }
        // const response = await AsyncStorage.getItem("cart");
        // if (response !== null) {
        //   // We have data!!
        //   const cart = await JSON.parse(response);
        //   console.log("current cart: ", cart);
        //   dispatchCart({ type: "ADD_CART", item: cart });
        //   console.log("current cart state", cartState.items);
        // }
      } catch (err) {
        alert(err);
      }
    }

    fetchDatas();
  }, []);

  _onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const _increaseQty = (item) => {
    //dispatchCart({ type: "ADD_CART", item: item });
    cartCtx.addItem({ ...item, quantity: 1 });
  };

  const _removeItem = (id) => {
    //dispatchCart({ type: "REMOVE", id: id });
    cartCtx.removeItem(id);
  };

  _keyExtractor = (item, index) => `${index}`;

  _renderItem = ({ item, index }) => (
    <CartItem
      key={item.id}
      item={item}
      addItem={_increaseQty.bind(null, item)}
      removeItem={_removeItem.bind(null, item.id)}
    />
  );

  const _postCartToDB = async () => {
    //get cart from asyncstorage
    setIsLoading(true);

    const fromCart = cartCtx.items; //await AsyncStorage.getItem("cart");
    const email = await AsyncStorage.getItem("email");

    if (fromCart !== null) {
      // We have data!!
      const cartItem = JSON.parse(fromCart);

      let url = `https://books.timotech.com.ng/api/books?Email=${email}`;

      url = url.replace(/"/g, "");

      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          //Authorization: "Bearer " + accessToken,
        },
        body: JSON.stringify(cartItem),
      })
        .then((res) => res.json())
        .then(
          (responseJson) => {
            if (responseJson.isSuccess == true) {
              setIsLoading(false);
              AsyncStorage.removeItem("cart");
              //If successfull then go to complete,
              //else go back to cart and display error
              navigation.navigate("Home");
            } else {
              alert(responseJson.message);
            }
          },
          (error) => {
            setIsLoading(false);
            alert(error);
          }
        );
    }
  };

  return (
    <View style={styles.container}>
      {cartCtx.items.length > 0 && (
        <View style={styles.content}>
          {/* <CartTotal totalCost={cartState.totalAmount} /> */}
          <View style={{ padding: 20 }}>
            <FlatList
              data={cartCtx.items}
              keyExtractor={_keyExtractor}
              renderItem={_renderItem}
              scrollEventThrottle={16}
            />
            <CartTotal totalCost={cartCtx.totalAmount} />
          </View>

          <View style={styles.cartFooter}>
            <Paystack
              paystackKey="pk_xxxxxxxxxxxxxxxxxxxxxxxxxxx"
              amount={cartCtx.totalAmount.toFixed(2)}
              billingEmail="xxxxxxxxxxxxx"
              billingMobile="xxxxxxxxxx"
              billingName="West African Book Publishers ltd"
              activityIndicatorColor="green"
              channels={JSON.stringify(["card", "bank", "ussd"])}
              onCancel={(e) => {
                // handle response here
              }}
              onSuccess={(res) => {
                // handle response here
                _postCartToDB();
              }}
              autoStart={false}
              ref={paystackWebViewRef}
              refNumber={"wabpLtd" + Math.floor(Math.random() * 1000000000 + 1)}
            />
            <TouchableOpacity
              onPress={() => paystackWebViewRef.current.startTransaction()}
            >
              <Text>Pay Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {!cartCtx.items.length > 0 && (
        <View style={[styles.content, styles.emptyCart]}>
          <Foundation
            name="book-bookmark"
            size={250}
            color={Colors.blueViolet}
          />
          <Text style={styles.emptyCartText}>Your cart is currently empty</Text>
          <Text style={styles.emptyCartAdd}>
            Add a few items to your cart to checkout
          </Text>
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
    paddingVertical: 9,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    paddingBottom: 70,
  },
  cartFooter: {
    ...Platform.select({
      ios: {
        height: 70,
      },
      android: {
        height: 60,
      },
    }),
    backgroundColor: Colors.blueViolet,
    position: "absolute",
    zIndex: 10,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 30,
    color: Colors.titanWhite,
  },
  checkoutText: {
    color: Colors.titanWhite,
    fontSize: 14,
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
  emptyCartAdd: {
    fontSize: 14,
    color: Colors.congoBrown,
  },
});

export default CartScreen;

{
  /* <View style={styles.cartFooter}>
                <PaystackWebView
                  buttonText="Pay Now"
                  showPayButton={true}
                  paystackKey="pk_xxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  amount={cartState.totalAmount}
                  billingEmail="xxxxxxxxxxxxx"
                  billingMobile="xxxxxxxxxx"
                  billingName="West African Book Publishers ltd"
                  ActivityIndicatorColor="green"
                  SafeAreaViewContainer={{ marginTop: 15 }}
                  SafeAreaViewContainerModal={{ marginTop: 15 }}
                  onCancel={(e) => {console.log('cancelled')}}
                  onSuccess={(e) => {
                    _postCartToDB();
                  }}
                  autoStart={false}
                  refNumber={
                    "wabpLtd" + Math.floor(Math.random() * 1000000000 + 1)
                  }
                />
              </View> */
}
