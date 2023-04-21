import { Feather, Ionicons } from "@expo/vector-icons";
import Colors from "../shared/constants/Colors";
import Layout from "../shared/constants/Layout";
import Touchable from "../shared/components/Touchable";
import React from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SCREEN_WIDTH = Layout.window.width;
const MENU_WIDTH = (SCREEN_WIDTH - 40) / 2 - 20;

class DrawerMenu extends React.Component {
  _navigate(route) {
    this.props.navigation.navigate(`${route}`);
  }

  constructor(props) {
    super(props);
    this.state = {
      firstname: null,
      lastname: null,
      logged: null,
    };
  }

  async componentDidMount() {
    const firstname = await AsyncStorage.getItem("firstname");
    const lastname = await AsyncStorage.getItem("lastname");
    const logged = await AsyncStorage.getItem("authtoken");

    this.setState({
      firstname: JSON.parse(firstname),
      lastname: JSON.parse(lastname),
      logged: JSON.parse(logged),
    });
  }

  async _logout() {
    // handle logout
    await AsyncStorage.removeItem("authtoken");
    await AsyncStorage.removeItem("email");
    await AsyncStorage.removeItem("firstname");
    await AsyncStorage.removeItem("lastname");
    this.props.navigation.navigate("Auth");
    //console.log("logout");
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.blueViolet}
        />
        <View style={styles.itemsContainer}>
          <View style={styles.menuTop}>
            <View style={styles.profile}>
              <View style={styles.profileImage}></View>
              <Text style={styles.profileName}>
                {this.state.logged &&
                  this.state.firstname + " " + this.state.lastname}
              </Text>
            </View>

            <Touchable
              background={Touchable.Ripple(Colors.snow, true)}
              style={styles.closeIcon}
              onPress={() => this.props.navigation.toggleDrawer()}
            >
              <Ionicons name="md-close" size={25} color={Colors.titanWhite} />
            </Touchable>
          </View>

          <View style={styles.menuContainer}>
            {/** First Row */}
            <View style={styles.menuRow}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => this._navigate("Collections")}
              >
                <View style={styles.menuItemInner}>
                  <Feather name="layers" size={28} color={Colors.titanWhite} />
                  <Text style={styles.menuItemText}>My Collections</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => this._navigate("Bookmarks")}
              >
                <View style={styles.menuItemInner}>
                  <Feather name="pocket" size={28} color={Colors.titanWhite} />
                  <Text style={styles.menuItemText}>History</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/** Second Row */}
            <View style={styles.menuRow}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => this._navigate("Categories")}
              >
                <View style={styles.menuItemInner}>
                  <Feather name="list" size={28} color={Colors.titanWhite} />
                  <Text style={styles.menuItemText}>Categories</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => this._navigate("About")}
              >
                <View style={styles.menuItemInner}>
                  <Feather name="award" size={28} color={Colors.titanWhite} />
                  <Text style={styles.menuItemText}>About</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/** Third Row */}
            <View style={styles.menuRow}>
              {this.state.logged !== null ? (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => this._logout()}
                >
                  <View style={styles.menuItemInner}>
                    <Feather
                      name="log-out"
                      size={28}
                      color={Colors.titanWhite}
                    />
                    <Text style={styles.menuItemText}>Sign Out</Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => this.props.navigation.navigate("Auth")}
                >
                  <View style={styles.menuItemInner}>
                    <Feather
                      name="log-in"
                      size={28}
                      color={Colors.titanWhite}
                    />
                    <Text style={styles.menuItemText}>Sign In</Text>
                  </View>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => this._navigate("Contact")}
              >
                <View style={styles.menuItemInner}>
                  <Feather name="mail" size={28} color={Colors.titanWhite} />
                  <Text style={styles.menuItemText}>Contact Us</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/** Version Info */}
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  marginLeft: 0,
                  fontSize: 12,
                  color: Colors.titanWhite,
                }}
              >
                Ver. 0.1
              </Text>
            </View>
          </View>
        </View>
        <View style={[styles.chevronTriangle, styles.chevronBottomLeft]} />
        <View style={[styles.chevronTriangle, styles.chevronBottomRight]} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  itemsContainer: {
    backgroundColor: Colors.blueViolet,
    height: 340,
    width: Layout.window.width,
    padding: 20,
    ...Platform.select({
      ios: {
        paddingTop: 30,
      },
    }),
  },
  menuTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profile: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 25,
  },
  profileImage: {
    backgroundColor: Colors.titanWhite,
    height: 50,
    width: 50,
    borderRadius: 100 / 2,
    marginRight: 10,
  },
  profileName: {
    color: Colors.titanWhite,
    fontSize: 14,
  },
  closeIcon: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  menuContainer: {
    flexDirection: "column",
  },
  menuRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  menuItem: {
    width: MENU_WIDTH,
    paddingVertical: 5,
  },
  menuItemInner: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 14,
    marginLeft: 10,
    color: Colors.titanWhite,
  },
  chevronTriangle: {
    backgroundColor: "transparent",
    borderTopWidth: 30,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: Layout.window.width / 2,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderRightColor: "transparent",
    borderLeftColor: Colors.blueViolet,
  },
  chevronBottomLeft: {
    position: "absolute",
    top: 340,
    left: 0,
    transform: [{ scale: -1 }],
  },
  chevronBottomRight: {
    position: "absolute",
    top: 340,
    right: 0,
    transform: [{ scaleY: -1 }],
  },
});

export default DrawerMenu;
