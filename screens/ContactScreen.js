import React, { Component } from "react";
import { Colors } from "../shared";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
  Text,
  TextInput,
  Button,
} from "react-native";
import Card from "../components/Card";
import { Ionicons } from "@expo/vector-icons";

export default class ContactScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      mobile: null,
      email: null,
      msg: null,
      isSubmited: false,
    };
  }

  postContact = (
    name,
    mobile,
    email,
    msg,
    nameClear,
    mobileClear,
    emailClear,
    msgClear
  ) => {
    if (this.state.msg != null) {
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
            this.refs[nameClear].setNativeProps({ text: "" });
            this.refs[mobileClear].setNativeProps({ text: "" });
            this.refs[emailClear].setNativeProps({ text: "" });
            this.refs[msgClear].setNativeProps({ text: "" });
            this.setState({
              name: null,
              mobile: null,
              email: null,
              msg: null,
              isSubmited: true,
            });
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

  _togglePostCard() {
    this.setState({
      isSubmited: false,
    });
  }

  render() {
    return (
      <View>
        <View style={{ backgroundColor: Colors.blueViolet }}>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>CONTACT</Text>
          </View>
        </View>
        <View>
          <Card style={styles.postCard}>
            {this.state.isSubmited ? (
              <View>
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
                  <TouchableOpacity onPress={() => this._togglePostCard()}>
                    <Ionicons
                      name="refresh"
                      size={50}
                      color="#64DD17"
                      style={{ marginLeft: 10 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View>
                <View>
                  <TextInput
                    placeholder="Name"
                    onChangeText={(name) => this.setState({ name })}
                    ref={"nameClear"}
                  />
                </View>
                <View>
                  <TextInput
                    placeholder="Mobile"
                    onChangeText={(mobile) => this.setState({ mobile })}
                    ref={"mobileClear"}
                    keyboardType={"phone-pad"}
                  />
                </View>
                <View>
                  <TextInput
                    placeholder="Email"
                    onChangeText={(email) => this.setState({ email })}
                    ref={"emailClear"}
                    keyboardType={"email-address"}
                  />
                </View>
                <Form style={{ marginLeft: 20, marginRight: 20 }}>
                  <TextInput
                    multiline
                    numberOfLines={5}
                    onChangeText={(msg) => this.setState({ msg })}
                    ref={"msgClear"}
                    placeholder="Type your message here"
                  />
                </Form>
                <View>
                  <Button
                    title="SUBMIT"
                    onPress={() =>
                      this.postContact(
                        this.state.name,
                        this.state.mobile,
                        this.state.email,
                        this.state.msg,
                        "nameClear",
                        "mobileClear",
                        "emailClear",
                        "msgClear"
                      )
                    }
                  />
                </View>
              </View>
            )}
          </Card>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  postCard: {
    marginLeft: 25,
    marginRight: 25,
    marginTop: 20,
    marginBottom: 20,
  },
});
