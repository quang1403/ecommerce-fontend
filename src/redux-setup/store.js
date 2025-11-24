import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import cartReducer from "./reducers/cart";
import authReducer from "./reducers/auth";

const rootReducer = combineReducers({
  cart: cartReducer,
  auth: authReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "cart"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
        ],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
