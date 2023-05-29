import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import UserSlice from "./reducers/user/userSlice";
import OrderSlice from "./reducers/order/orderSlice";

const rootReducer = combineReducers({
    UserSlice,
    OrderSlice
});

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
    });
}

export type typeStore = ReturnType<typeof setupStore>;
export type typeRoot = ReturnType<typeof rootReducer>;
export type typeDispatch = typeStore["dispatch"];