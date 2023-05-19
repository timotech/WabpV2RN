import { Ionicons } from "@expo/vector-icons";
import Colors from "../shared/constants/Colors";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Keyboard,
  Text,
  Pressable,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StarRating from "react-native-star-rating";

const AddReview = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [starCount, setStarCount] = useState(0);

  _hideModal = () => {
    props.setModalVisible(false);
  };

  _postReview = async () => {
    const logged = await AsyncStorage.getItem("authtoken");
    if (!logged) {
      return props.navigation.navigate("Auth");
    }

    const email = await AsyncStorage.getItem("email");
    Keyboard.dismiss();

    setIsLoading(true);

    fetch("https://books.timotech.com.ng/api/books/postreviews", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Username: JSON.parse(email),
        Comment: props.comment,
        Rating: props.rating.toString(),
        BookId: props.bookId.toString(),
        Name: "from db",
      }),
    })
      .then((res) => res.json())
      .then(
        (responseJson) => {
          if (responseJson.isSuccess == true) {
            setIsLoading(false);
            props.setModalVisible(false);
            alert("Review Submitted");
          } else {
            setIsLoading(false);
            alert("Network Error, Review Not Submitted!");
          }
        },
        (error) => {
          setIsLoading(false);
          alert(error);
        }
      )
      .finally(() => {
        setIsLoading(false);
      });
  };

  _setReviewStar = (number) => {
    props.setData(number);
    setStarCount(number);
  };

  _setReviewComment = (value) => {
    props.setData(value);
  };

  const { name, rating, comment, modalVisible } = props;

  return (
    <Modal
      animationType="fade"
      transparent={false}
      visible={modalVisible}
      onRequestClose={_hideModal}
    >
      <View style={styles.container}>
        <View>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
            Reviewing {name}
          </Text>

          <TouchableOpacity style={styles.closeContainer} onPress={_hideModal}>
            <Ionicons name="md-close" size={30} style={styles.closeIcon} />
          </TouchableOpacity>
        </View>

        <View style={[styles.formContainer]}>
          <View style={{ width: 140, marginBottom: 25 }}>
            <StarRating
              emptyStar={"ios-star-outline"}
              fullStar={"ios-star"}
              halfStar={"ios-star-half"}
              iconSet={"Ionicons"}
              maxStars={5}
              rating={starCount}
              fullStarColor={Colors.yellow50}
              starSize={25}
              selectedStar={(rating) => _setReviewStar(rating)}
            />
          </View>

          <TextInput
            multiline={true}
            numberOfLines={10}
            onChangeText={_setReviewComment}
            placeholder="Leave a comment"
            style={styles.textInput}
          />
          <Pressable style={styles.button} onPress={_postReview}>
            <Text style={styles.buttonText}>Submit Review</Text>
          </Pressable>
          <View style={{ marginTop: 5 }}>
            {isLoading && (
              <ActivityIndicator
                size="large"
                color="#00ff00"
                animating={isLoading}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    ...Platform.select({
      ios: {
        paddingTop: 70,
      },
      android: {
        paddingTop: 30,
      },
    }),
  },
  title: {
    fontSize: 16,
    color: Colors.congoBrown,
    marginTop: 20,
  },
  closeContainer: {
    position: "absolute",
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  closeIcon: {
    color: Colors.congoBrown,
  },
  formContainer: {
    marginTop: 50,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  // inputItem: {
  //     borderBottomColor: Colors.borderFaintColor,
  //     marginTop: 20,
  // },
  // inputLabel: {
  //     fontSize: 10
  // },
  textInput: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.congoBrown,
    color: Colors.congoBrown,
    fontSize: 14,
    width: "100%",
    marginBottom: 25,
    padding: 5,
  },
  button: {
    backgroundColor: Colors.blueViolet,
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: Colors.titanWhite,
  },
});

export default AddReview;
