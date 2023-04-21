import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  Text,
  Dimensions,
  StyleSheet,
  Platform,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";

const { width: screenWidth } = Dimensions.get("window");

const HomeCarousel = (props) => {
  const [entries, setEntries] = useState([]);
  // const carouselRef = useRef(null);

  // const goForward = () => {
  //   carouselRef.current.snapToNext();
  // };

  useEffect(() => {
    fetch("https://books.timotech.com.ng/api/books/GetBanners")
      .then((response) => response.json())
      .then((json) => {
        setEntries(json);
      })
      .catch((error) => {
        ToastAndroid.show(
          "Carousel Fetch Error: " + error.message,
          ToastAndroid.SHORT
        );
      });
  }, []);

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.item}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.picPath }} //to use local path use source={item.picPath}
            style={styles.image}
          />
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Carousel
        loop
        width={screenWidth}
        height={screenWidth}
        autoPlay={true}
        data={entries}
        scrollAnimationDuration={1000}
        renderItem={renderItem}
      />
    </View>
  );

  // return (
  //   <View style={styles.container}>
  //     <Carousel
  //       ref={carouselRef}
  //       sliderWidth={screenWidth}
  //       sliderHeight={screenWidth}
  //       itemWidth={screenWidth - 60}
  //       data={entries}
  //       renderItem={renderItem}
  //       hasParallaxImages={true}
  //     />
  //   </View>
  // );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    width: screenWidth - 60,
    height: screenWidth - 60,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: "white",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "contain",
  },
  title: {
    marginTop: 10,
    fontSize: 14,
  },
});

export default HomeCarousel;
