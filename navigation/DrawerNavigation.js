import { createDrawerNavigator } from "@react-navigation/drawer";

import {
  AboutScreen,
  DetailScreen,
  HomeScreen,
  BookmarksScreen,
  CartScreen,
  CategoriesScreen,
  CheckoutScreen,
  CollectionScreen,
  ContactScreen,
  ListingScreen,
  SearchScreen,
  ViewScreen,
} from "../screens/Index";

import { Platform } from "react-native";
import { Colors, Layout } from "../shared";
import DrawerMenu from "./DrawerMenu";
import CartProvider from "../store/CartProvider";

const {
  window: { width },
} = Layout;

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  return (
    <CartProvider>
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={(props) => <DrawerMenu {...props} />}
        screenOptions={{
          headerStyle: {
            ...Platform.select({
              ios: {
                height: 50,
              },
            }),
            backgroundColor: Colors.snow,
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              ...Platform.select({
                ios: {
                  height: 10,
                },
              }),
            },
            shadowOpacity: 0.2,
            shadowRadius: 4,
          },
          headerTitleStyle: {
            fontWeight: "400",
            color: Colors.congoBrown,
          },
          drawerStyle: {
            backgroundColor: "transparent",
            width: width,
          },
        }}
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Categories" component={CategoriesScreen} />
        <Drawer.Screen name="Listing" component={ListingScreen} />
        <Drawer.Screen name="Detail" component={DetailScreen} />
        <Drawer.Screen name="About" component={AboutScreen} />
        <Drawer.Screen name="Contact" component={ContactScreen} />
        <Drawer.Screen name="Bookmarks" component={BookmarksScreen} />
        <Drawer.Screen name="Collections" component={CollectionScreen} />
        <Drawer.Screen name="Cart" component={CartScreen} />
        <Drawer.Screen name="Checkout" component={CheckoutScreen} />
        <Drawer.Screen name="Search" component={SearchScreen} />
        <Drawer.Screen name="Views" component={ViewScreen} />
      </Drawer.Navigator>
    </CartProvider>
  );
};

export default DrawerNavigation;
