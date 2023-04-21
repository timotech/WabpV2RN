import * as React from "react";
import { StyleSheet, View, Text } from "react-native";
import { WebView } from "react-native-webview";
import Colors from "../shared/constants/Colors";
import Touchable from "../shared/components/Touchable";
import { Ionicons } from "@expo/vector-icons";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.navigation.getParam("id"),
      title: this.props.navigation.getParam("title"),
      bookpath: this.props.navigation.getParam("ebookPath"),
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: navigation.getParam("title"),
      headerLeft: () => (
        <Touchable
          background={Touchable.Ripple(Colors.blueViolet, true)}
          style={[styles.headerItem, styles.headerIcon]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="ios-arrow-back" size={25} color={Colors.congoBrown} />
        </Touchable>
      ),
    };
  };

  render() {
    const url =
      "http://shopping.timotechng.com/?file=" +
      this.state.bookpath +
      "&title=" +
      this.state.title;
    //console.log(url);
    //console.log(this.state.bookpath);

    return this.state.bookpath !== null ? (
      <WebView
        source={{
          uri: url,
        }}
        style={{ marginTop: 0 }}
      />
    ) : (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ textAlign: "center" }}>
          Book Render Error, Please contact administrator at info@wabp.com.ng
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.snow,
  },
  headerItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerIcon: {
    paddingVertical: 9,
    paddingHorizontal: 20,
  },
});
