import { useState } from "react";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Touchable } from "../../shared";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Keyboard,
  Image,
  ImageBackground,
  TextInput,
} from "react-native";

const LoginScreen = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  return (
    <ImageBackground
      source={require("../../assets/login_bg.jpeg")}
      style={styles.container}
    >
      {/* {isLoading && <Loader />} imageStyle={{ opacity: 0.1 }} */}

      <View style={styles.container} behavior="padding" enabled>
        <ScrollView style={styles.container}>
          <View style={styles.scrollInner}>
            {/** Logo Area */}
            <View>
              {/* <MaterialCommunityIcons
                  name="book"
                  size={60}
                  color={Colors.blueViolet}
                  style={{
                    marginLeft: -8,
                    marginBottom: 10,
                  }}
                /> */}
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingBottom: 10,
                }}
              >
                <Image
                  source={require("../../assets/icon.png")}
                  style={styles.icon}
                />
              </View>

              <Text style={styles.header}>Sign In</Text>
            </View>
            {/** Logo Area */}

            {/** Social Area */}
            <View style={styles.social}>
              {/* <Button
                  iconLeft
                  transparent
                  style={{
                    marginRight: 40,
                  }}
                  onPress={() => this.signInWithGoogleAsync()}
                >
                  <FontAwesome name="google" size={30} color="red" />
                  <Text style={styles.socialText}>Google</Text>
                </Button> */}
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={() => _facebookSignin}
              >
                <FontAwesome name="facebook" size={30} color="blue" />
                <Text style={styles.socialText}>Facebook</Text>
              </TouchableOpacity>
            </View>
            {/** Social Area */}

            {/** Form Area */}
            <View>
              <View style={styles.inputItem}>
                <TextInput
                  style={styles.textInput}
                  onChangeText={(user) => setUsername(user)}
                  value={username}
                  placeholder="Email"
                  keyboardType="default"
                  placeholderTextColor={Colors.titanWhite}
                />
              </View>
              <View style={styles.inputItem}>
                <TextInput
                  style={styles.textInput}
                  onChangeText={(pass) => setPassword(pass)}
                  value={password}
                  placeholder="Password"
                  placeholderTextColor={Colors.titanWhite}
                  secureTextEntry
                />
              </View>
            </View>
            {/** Form Area */}

            {/** Form after */}
            <View style={styles.formAfter}>
              <Text style={styles.formAfterText}>Don't have an account?</Text>
              <TouchableOpacity
                onPress={() => props.navigation.navigate("Register")}
              >
                <Text
                  style={[
                    styles.formAfterText,
                    {
                      color: Colors.blueViolet,
                      textDecorationLine: "underline",
                      textDecorationColor: Colors.congoBrown,
                    },
                  ]}
                >
                  Register here
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.formAfter}>
              <Text style={styles.formAfterText}>Forgot your password?</Text>
              <TouchableOpacity
                onPress={() => props.navigation.navigate("ForgotPassword")}
              >
                <Text
                  style={[
                    styles.formAfterText,
                    {
                      color: Colors.blueViolet,
                      textDecorationLine: "underline",
                      textDecorationColor: Colors.congoBrown,
                    },
                  ]}
                >
                  Click here
                </Text>
              </TouchableOpacity>
            </View>
            {/** Form after */}
            <View
              style={{
                marginTop: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => props.navigation.navigate("App")}
              >
                <Text style={{ color: Colors.titanWhite, fontSize: 14 }}>
                  I just want to{" "}
                  <Text
                    style={{
                      color: Colors.blueViolet,
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    PREVIEW
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 20 }}>
              <ActivityIndicator
                size="large"
                color="#00ff00"
                animating={isLoading}
              />
            </View>
          </View>
        </ScrollView>
      </View>
      <Touchable
        background={Touchable.Ripple(Colors.snow, false)}
        style={styles.button}
        onPress={() => _signin}
      >
        <Text style={styles.buttonText}>Login</Text>
      </Touchable>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,20,0,0.6)",
  },
  scrollInner: {
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  header: {
    color: Colors.blueViolet,
    fontSize: 18,
    fontWeight: "bold",
    justifyContent: "center",
  },
  headerExcerpt: {
    color: Colors.titanWhite,
    fontSize: 14,
    marginVertical: 10,
  },
  icon: {
    height: 50,
    width: 50,
  },
  social: {
    flexDirection: "row",
    marginVertical: 15,
  },
  socialText: {
    fontSize: 14,
    color: Colors.titanWhite,
    marginLeft: 5,
  },
  inputItem: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.titanWhite,
    marginTop: 15,
    padding: 10,
    color: Colors.titanWhite,
  },
  inputLabel: {
    fontSize: 14,
    color: Colors.titanWhite,
  },
  textInput: {
    letterSpacing: 1,
    fontSize: 14,
    color: Colors.titanWhite,
  },
  formAfter: {
    marginVertical: 20,
    flexDirection: "row",
  },
  formAfterText: {
    fontSize: 14,
    color: Colors.titanWhite,
    marginRight: 5,
  },
  button: {
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
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: Colors.titanWhite,
    fontSize: 16,
  },
});
