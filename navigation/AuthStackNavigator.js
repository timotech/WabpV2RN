import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "../auth/screens/LoginScreen";
import RegisterScreen from "../auth/screens/RegisterScreen";
import ForgotPasswordScreen from "../auth/screens/ForgotPasswordScreen";
import ResetScreen from "../auth/screens/ResetScreen";

const Stack = createStackNavigator();

const AuthStackNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerTitleStyle: {
          fontWeight: "normal",
        },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="Reset" component={ResetScreen} />
    </Stack.Navigator>
  );
};

export default AuthStackNavigation;
