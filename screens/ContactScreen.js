import React, { useState, useEffect } from "react";
import { Colors, Touchable } from "../shared";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
  Text,
  TextInput,
  Button,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Card from "../components/Card";
import { Ionicons } from "@expo/vector-icons";

const ContactScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: "Contact Us",
      headerLeft: () => (
        <Touchable
          background={Touchable.Ripple(Colors.blueViolet, true)}
          style={[styles.headerItem, styles.menuIcon]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="ios-arrow-back" size={25} color={Colors.congoBrown} />
        </Touchable>
      ),
    });
  }, [navigation]);

  postContact = () => {
    setIsLoading(true);

    if (msg != null) {
      fetch("https://books.timotech.com.ng/api/books/PostContact", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          mobile: mobile,
          email: email,
          msg: msg,
        }),
      })
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData.name != null) {
            setName("");
            setMobile("");
            setEmail("");
            setMsg("");
            setIsSubmitted(true);
            setIsLoading(false);
          } else {
            Alert.alert(
              "Oops !",
              "Something went wrong",
              [
                {
                  text: "OK",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
              ],
              { cancelable: false }
            );
          }
        })
        .done();
    } else {
      Alert.alert(
        "Oops !",
        "Press SUBMIT button after entering your message",
        [
          {
            text: "OK",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    }
  };

  _togglePostCard = () => {
    setIsSubmitted(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ ...styles.temp, marginTop: 50 }}>
        <Card>
          {isSubmitted && (
            <View style={styles.headerItem}>
              <View>
                <Ionicons
                  name="ios-checkmark-circle"
                  size={30}
                  color="#4CAF50"
                  style={{
                    marginLeft: 5,
                    marginRight: 10,
                  }}
                />
                <Text style={{ flex: 1 }}>
                  Thanks. We will get in touch with you as soon as possible
                </Text>
              </View>
              <View>
                <TouchableOpacity onPress={_togglePostCard}>
                  <Ionicons
                    name="refresh"
                    size={50}
                    color="#64DD17"
                    style={{ marginLeft: 10 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
          {!isSubmitted && (
            <View style={{ flex: 1 }}>
              <View style={[styles.temp, styles.inputItem]}>
                <TextInput
                  placeholder="Name"
                  style={styles.textInput}
                  onChangeText={(name) => setName(name)}
                />
              </View>
              <View style={[styles.temp, styles.inputItem]}>
                <TextInput
                  placeholder="Mobile"
                  onChangeText={(mobile) => setMobile(mobile)}
                  keyboardType={"phone-pad"}
                  style={styles.textInput}
                />
              </View>
              <View style={[styles.temp, styles.inputItem]}>
                <TextInput
                  placeholder="Email"
                  onChangeText={(email) => setEmail(email)}
                  keyboardType={"email-address"}
                  style={styles.textInput}
                />
              </View>
              <View style={[styles.temp, styles.inputItem]}>
                <TextInput
                  multiline
                  numberOfLines={8}
                  onChangeText={(msg) => setMsg(msg)}
                  placeholder="Type your message here"
                  style={styles.textInput}
                />
              </View>
              <View style={styles.temp}>
                {isLoading && (
                  <ActivityIndicator
                    size="large"
                    color="#00ff00"
                    animating={isLoading}
                  />
                )}
                {!isLoading && <Button title="SUBMIT" onPress={postContact} />}
              </View>
            </View>
          )}
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.snow,
    paddingRight: 20,
    paddingLeft: 20,
  },
  headerItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  menuIcon: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  postCard: {
    marginLeft: 25,
    marginRight: 25,
    marginTop: 20,
    marginBottom: 20,
  },
  temp: {
    marginTop: 10,
    marginBottom: 10,
  },
  inputItem: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.titanWhite,
    marginTop: 15,
    padding: 10,
    color: Colors.titanWhite,
  },
  textInput: {
    letterSpacing: 1,
    fontSize: 14,
    color: Colors.titanWhite,
  },
});

export default ContactScreen;
