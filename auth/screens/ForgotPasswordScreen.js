import Colors from "../../shared/constants/Colors";
import Touchable from "../../shared/components/Touchable";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Keyboard,
  Image,
  ImageBackground,
  TextInput,
} from "react-native";

const ForgotPasswordScreen = (props) => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  _signin = async () => {
    setIsLoading(true);
    setIsDisabled(true);
    Keyboard.dismiss();

    const url = `https://books.timotech.com.ng/api/auth/forgotpassword?Email=${this.state.username}`;

    fetch(url, {
      method: "POST",
      headers: {
        Accept: "*/*",
      },
    })
      .then((res) => res.json())
      .then(
        (responseJson) => {
          if (responseJson.isSuccess == true) {
            setIsLoading(false);
            setIsDisabled(false);
            props.navigation.navigate("Reset", responseJson);
          } else {
            var json = JSON.stringify(responseJson.errors);
            var obj = JSON.parse(json);
            var values = Object.keys(obj).map(function (key) {
              return obj[key];
            });
            //console.log(values);
            alert(values);
            setIsLoading(false);
            setIsDisabled(false);
          }
        },
        (error) => {
          setIsLoading(false);
          setIsDisabled(false);
          alert(error.message);
        }
      );
  };

  return (
    <ImageBackground
      source={require("../../assets/login_bg.jpeg")}
      style={styles.container}
    >
      {/* {isLoading && <Loader />} */}

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
              <Text style={styles.header}>Forgot Password</Text>
            </View>
            {/** Logo Area */}

            {/** Form Area */}
            <View>
              <View style={styles.inputItem}>
                <TextInput
                  style={styles.textInput}
                  onChangeText={(user) => setUsername(user)}
                  value={username}
                  placeholder="Email"
                  placeholderTextColor={Colors.titanWhite}
                />
              </View>
            </View>
            {/** Form Area */}

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
        <Text style={styles.buttonText}>Submit</Text>
      </Touchable>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,20,0,0.6)", //rgba(0,30,0,0.5)
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

export default ForgotPasswordScreen;
