import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartReducer = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload;
    },
    addToCart: (state, action) => {
      let isProductExist = false;
      state.items.forEach((item) => {
        if (item._id === action.payload._id) {
          item.quantity += action.payload.quantity;
          isProductExist = true;
        }
      });
      if (!isProductExist) {
        state.items.push(action.payload);
      }
    },
    updateItemCart: (state, action) => {
      state.items.forEach((item) => {
        if (item._id === action.payload._id) {
          item.quantity = Number(action.payload.quantity);
        }
      });
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item._id !== action.payload._id
      );
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateItemCart, clearCart, setCart } =
  cartReducer.actions;

export default cartReducer.reducer;
