// The shared reducer map. Both apps build their store from this, so state
// shape and typing are identical across web and React Native.
import { combineReducers } from "@reduxjs/toolkit";
import auth from "./authSlice";
import chat from "./chatSlice";
import closet from "./closetSlice";
import clothingTypes from "./clothingTypesSlice";
import notifications from "./notificationsSlice";
import outfits from "./outfitsSlice";
import recommend from "./recommendSlice";

export const reducers = {
  auth,
  chat,
  closet,
  clothingTypes,
  notifications,
  outfits,
  recommend,
};

export const rootReducer = combineReducers(reducers);

export type RootState = ReturnType<typeof rootReducer>;
