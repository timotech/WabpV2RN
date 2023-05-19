import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DrawerNavigation from "./DrawerNavigation";
import AuthStackNavigation from "./AuthStackNavigator";
import CartProvider from "../store/CartProvider";

const Stack = createStackNavigator();

const RootNavigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkLogin() {
      const customer = await AsyncStorage.getItem("authtoken");

      if (customer !== null && customer !== undefined) {
        setIsLoggedIn(true);
      }
    }

    checkLogin();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn && <Stack.Screen name="App" component={DrawerNavigation} />}
        {!isLoggedIn && (
          <Stack.Screen name="Auth" component={AuthStackNavigation} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigation;
