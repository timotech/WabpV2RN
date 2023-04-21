import { Foundation, Ionicons } from "@expo/vector-icons";
import Colors from "../shared/constants/Colors";
import Touchable from "../shared/components/Touchable";
import React, { Component } from "react";
import PaystackWebView from "react-native-paystack-webview";
import {
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartItem, CartTotal } from "../components";

export default class CartScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataCart: [],
      isLoading: false,
      isDisabled: false,
      refreshing: false,
      total: 0,
    };
  }

  async componentDidMount() {
    try {
      const logged = await AsyncStorage.getItem("authtoken");
      if (!logged) {
        return this.props.navigation.navigate("Auth");
      }

      const response = await AsyncStorage.getItem("cart");
      if (response !== null) {
        // We have data!!
        const cart = await JSON.parse(response);
        this.setState({ dataCart: cart });
        //console.log(this.state.dataCart);
        this._getTotal(cart);
      }
    } catch (err) {
      alert(err);
    }
  }

  _getTotal = (cart) => {
    let total = 0;

    for (var i = 0; i < cart.length; i++) {
      total = total + cart[i].price * cart[i].quantity;
    }

    this.setState({ total: total });
  };

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "Checkout Cart",
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
            {/* N{this.state.total} */}
          </Text>
        </View>
      ),
    };
  };

  _onRefresh = () => {
    this.setState({ refreshing: true });
    setTimeout(() => {
      this.setState({ refreshing: false });
    }, 1500);
  };

  _increaseQty = (index) => {
    this.setState((state) => {
      const cartItems = state.dataCart;
      const cartItem = cartItems[index];

      cartItem.quantity = `${+cartItem.quantity + 1}`;
      cartItems[index] = cartItem;
      this._getTotal(cartItems);
      return { cartItems };
    });
  };

  _decreaseQty = (index) => {
    this.setState((state) => {
      const cartItems = state.dataCart;
      const cartItem = cartItems[index];

      const prevQty = +cartItem.quantity;

      if (prevQty > 1) {
        cartItem.quantity = `${prevQty - 1}`;
        cartItems[index] = cartItem;
        this._getTotal(cartItems);
        return { cartItems };
      }
    });
  };

  _removeItem = (index) => {
    this.setState((state) => {
      const cartItems = state.dataCart.filter((dataCart, i) => i !== index);
      this.setState({ dataCart: cartItems });
      //console.log(JSON.stringify(cartItems));
      AsyncStorage.setItem("cart", JSON.stringify(cartItems));
      this._getTotal(cartItems);

      return cartItems;
    });
  };

  _keyExtractor = (item, index) => `${index}`;

  _renderItem = ({ item, index }) => (
    <CartItem
      key={item.id}
      item={item}
      index={index}
      increaseQty={this._increaseQty}
      decreaseQty={this._decreaseQty}
      removeItem={this._removeItem}
    />
  );

  _getCart = async () => {
    //get cart from asyncstorage
    this.setState({ isLoading: true });
    this.setState({ isDisabled: true });

    const fromCart = await AsyncStorage.getItem("cart");
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
              this.setState({ isLoading: false });
              this.setState({ isDisabled: false });
              AsyncStorage.removeItem("cart");
              //If successfull then go to complete,
              //else go back to cart and display error
              this.props.navigation.navigate("Home");
            } else {
              alert(responseJson.message);
            }
          },
          (error) => {
            this.setState({ isLoading: false });
            this.setState({ isDisabled: false });
            alert(error);
          }
        );
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.dataCart.length > 0 ? (
          <View style={{ flex: 1 }}>
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
                />
              }
            >
              <View style={styles.content}>
                {/** Cart Items */}
                <View style={{ padding: 20 }}>
                  <FlatList
                    data={this.state.dataCart}
                    extraData={this.state}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    scrollEventThrottle={16}
                  />
                </View>

                {/** Cart Total */}
                <CartTotal totalCost={this.state.total} />
              </View>
            </ScrollView>

            <View style={styles.cartFooter}>
              <PaystackWebView
                buttonText="Pay Now"
                showPayButton={true}
                paystackKey="pk_xxxxxxxxxxxxxxxxxxxxxxxxxxx"
                amount={this.state.total}
                billingEmail="info@wabp.com.ng"
                billingMobile="08156934858"
                billingName="West African Book Publishers ltd"
                ActivityIndicatorColor="green"
                SafeAreaViewContainer={{ marginTop: 15 }}
                SafeAreaViewContainerModal={{ marginTop: 15 }}
                onCancel={(e) => {
                  // handle response here
                }}
                onSuccess={(e) => {
                  // post storage to database and redirect
                  this._getCart();
                }}
                autoStart={false}
                refNumber={
                  "wabpLtd" + Math.floor(Math.random() * 1000000000 + 1)
                }
              />
            </View>
          </View>
        ) : (
          <View style={[styles.content, styles.emptyCart]}>
            <Foundation
              name="book-bookmark"
              size={250}
              color={Colors.blueViolet}
            />
            <Text style={styles.emptyCartText}>
              Your cart is currently empty
            </Text>
            <Text style={styles.emptyCartAdd}>
              Add a few items to your cart to checkout
            </Text>
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
