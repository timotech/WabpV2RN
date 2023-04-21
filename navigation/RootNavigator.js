import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DrawerNavigation from "./DrawerNavigation";
import AuthStackNavigation from "./AuthStackNavigator";

const Stack = createStackNavigator();

const RootNavigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    async function checkLogin() {
      let customer = await AsyncStorage.getItem("authtoken");

      if (customer) {
        setIsLoggedIn(true);
      }
    }

    checkLogin();
    //const token = JSON.parse(customer);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isLoggedIn ? "App" : "Auth"}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Auth" component={AuthStackNavigation} />
        <Stack.Screen name="App" component={DrawerNavigation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigation;
