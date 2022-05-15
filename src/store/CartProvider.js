import React, { useReducer } from "react";
import CartContext from "./cart-context";

const defaultCartState = {
  items: [],
  totalAmount: 0,
};

// cartReducer is first parameter to useReducer()
// Outside of the component function because reducer function won't need anything from that component.
// It won't need any surrounding data to find in this component.
// And it shouldn't be recreated all the time when the component is reevaluated.
const cartReducer = (state, action) => {

  // add item 
  if (action.type === "ADD") {
    const updatedTotalAmount = state.totalAmount + action.item.price * action.item.amount;
    
    // before concat check if item is already added in cart
    // so that same item will not appear multiple times, if added
    const existingCartItemIndex = state.items.findIndex((item) => item.id === action.item.id);
    const existingCartItem = state.items[existingCartItemIndex];
    
    let updatedItems;

    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        amount: existingCartItem.amount + action.item.amount
      };

      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      // item is added for first time
      updatedItems = state.items.concat(action.item);
    }

    // return new state snapshot
    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }

  // remove item 
  if (action.type === "REMOVE") {
    const existingCartItemIndex = state.items.findIndex((item) => item.id === action.id);
    const existingItem = state.items[existingCartItemIndex];
    const updatedTotalAmount = state.totalAmount - existingItem.price;

    let updatedItems;

    if(existingItem.amount === 1) {
      // if item is last item of that category
      updatedItems = state.items.filter(item => item.id !== action.id);
    } else {
      // if amount > 1 , we just update amount
      const updatedItem = { ...existingItem, amount: existingItem.amount- 1 };

      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
    }

    // return new state snapshot
    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }

  return defaultCartState;
};

const CartProvider = (props) => {
  // calling reducer function to manage state
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );

  //   these function will get called from components via Context
  const addItemToCartHandler = (item) => {
    dispatchCartAction({ type: "ADD", item: item });
  };

  const removeItemFromCartHandler = (id) => {
    dispatchCartAction({ type: "REMOVE", id: id });
  };

  //   const cartContext = {
  //     items: [],
  //     totalAmount: 0,
  //     addItem: addItemToCartHandler,
  //     removeItem: removeItemFromCartHandler,
  //   };

  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemToCartHandler,
    removeItem: removeItemFromCartHandler,
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartProvider;
