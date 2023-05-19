import { StyleSheet, View } from "react-native";

const Card = (props) => {
  return <View style={styles.container}>{props.children}</View>;
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderColor: "#D3D3D3",
    borderWidth: 1,
    padding: 10,
  },
});
export default Card;
