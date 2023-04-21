import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../shared/constants/Colors";
import Touchable from "../../shared/components/Touchable";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
  ImageBackground,
  TextInput,
} from "react-native";

export default RegisterScreen = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  _register = async () => {
    setIsLoading(true);
    setIsDisabled(true);

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(username) === false) {
      alert("Email Not Valid");
      setIsLoading(false);
      setIsDisabled(false);
      return;
    }

    if (password !== confirmPassword) {
      alert("Password and Confirm Password Not Same!");
      setIsLoading(false);
      setIsDisabled(false);
      return;
    }

    if (
      username == "" ||
      password == "" ||
      confirmPassword == "" ||
      firstName == "" ||
      lastName == "" ||
      phoneNumber == ""
    ) {
      alert("All fields are required");
      setIsLoading(false);
      setIsDisabled(false);
      return;
    }

    fetch("https://books.timotech.com.ng/api/auth/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Email: username,
        Password: password,
        ConfirmPassword: confirmPassword,
        FirstName: firstName,
        LastName: lastName,
        Phone: phoneNumber,
      }),
    })
      .then((res) => res.json())
      .then(
        (responseJson) => {
          if (responseJson.isSuccess == true) {
            setIsLoading(false);
            setIsDisabled(false);
            props.navigation.navigate("Login");
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
          alert(
            "A server error has occured, error details: " +
              error +
              ". Please try again later"
          );
        }
      );
  };

  return (
    <ImageBackground
      source={require("../../assets/login_bg.jpeg")}
      style={styles.container}
    >
      <View
        style={[styles.container, { marginBottom: 50 }]}
        behavior="padding"
        enabled
      >
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

              <Text style={styles.header}>Sign Up</Text>
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
                >
                  <FontAwesome name="google" size={30} color="red" />
                  <Text style={styles.socialText}>Google</Text>
                </Button> */}
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <FontAwesome name="facebook" size={30} color="blue" />
                <Text style={styles.socialText}>Facebook</Text>
              </TouchableOpacity>
            </View>
            {/** Social Area */}

            {/** Form Area */}
            <View style={{ marginBottom: 20 }}>
              <View style={styles.inputItem}>
                <TextInput
                  style={styles.textInput}
                  onChangeText={(txt) => setUsername(txt)}
                  value={firstName}
                  placeholder="First Name"
                  placeholderTextColor={Colors.titanWhite}
                />
              </View>
              <View style={styles.inputItem}>
                <TextInput
                  style={styles.textInput}
                  onChangeText={(lst) => setPassword(lst)}
                  value={lastName}
                  placeholder="Last Name"
                  placeholderTextColor={Colors.titanWhite}
                />
              </View>
              <View style={styles.inputItem}>
                <TextInput
                  style={styles.textInput}
                  onChangeText={(user) => setUsername(user)}
                  value={username}
                  keyboardType="email-address"
                  placeholder="Email Address"
                  placeholderTextColor={Colors.titanWhite}
                />
              </View>
              <View style={styles.inputItem}>
                <TextInput
                  style={styles.textInput}
                  onChangeText={(phone) => setPhoneNumber(phone)}
                  value={phoneNumber}
                  placeholder="Phone Number"
                  keyboardType="phone-pad"
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
              <View style={styles.inputItem}>
                <TextInput
                  style={styles.textInput}
                  onChangeText={(confirm) => setConfirmPassword(confirm)}
                  value={confirmPassword}
                  placeholder="Confirm Password"
                  placeholderTextColor={Colors.titanWhite}
                  secureTextEntry
                />
              </View>
            </View>
            {/** Form Area */}

            {/** Form after */}
            <View style={styles.formAfter}>
              <Text style={styles.formAfterText}>Already registered?</Text>
              <TouchableOpacity
                onPress={() => props.navigation.navigate("Login")}
              >
                <Text
                  style={[
                    styles.formAfterText,
                    {
                      color: Colors.blueViolet,
                      textDecorationLine: "underline",
                      textDecorationColor: Colors.congoBrown,
                      fontWeight: "bold",
                    },
                  ]}
                >
                  Login here
                </Text>
              </TouchableOpacity>
            </View>
            {/** Form after */}
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.formAfterText}>
                Note: Password must have at least one uppercase letter, one
                lower case letter, and one special character, and must at least
                be six characters
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
      <Touchable
        background={Touchable.Ripple(Colors.snow, false)}
        style={styles.button}
        onPress={_register}
      >
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#00ff00"
            animating={isLoading}
          />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </Touchable>
    </ImageBackground>
  );
};

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
