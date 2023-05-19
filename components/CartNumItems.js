import { useContext } from "react";
import { Text } from "react-native";
import CartContext from "../store/cart-context";

const CartNumItems = () => {
  const cartCtx = useContext(CartContext);

  const numberOfCartItems = cartCtx.items.reduce((curNumber, item) => {
    return curNumber + item.quantity;
  }, 0);

  return <Text>{numberOfCartItems}</Text>;
};

export default CartNumItems;
