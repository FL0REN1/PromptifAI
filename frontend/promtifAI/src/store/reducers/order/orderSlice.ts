import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IOrderRead } from "../../../models/order/IOrderRead";
import { createOrder, getOrderByUserId } from "./orderActionCreator";

interface IOrderState {
    Orders: IOrderRead[];
    IsLoading: boolean;
    Error: string | null;
}

const initialState: IOrderState = {
    Orders: [],
    IsLoading: false,
    Error: null
}

export const OrderSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: {
        //#region [Get_Order_By_User_Id]

        [getOrderByUserId.pending.type]: (state) => {
            state.Orders = [];
            state.IsLoading = true;
            state.Error = null;
        },
        [getOrderByUserId.fulfilled.type]: (state, action: PayloadAction<IOrderRead[]>) => {
            state.Orders = action.payload;
            state.IsLoading = false;
            state.Error = null;
        },
        [getOrderByUserId.rejected.type]: (state, action: PayloadAction<string>) => {
            state.Orders = [];
            state.IsLoading = false;
            state.Error = action.payload;
        },

        //#endregion

        //#region [Create_Order]

        [createOrder.pending.type]: (state) => {
            state.IsLoading = true;
            state.Error = null;
        },
        [createOrder.fulfilled.type]: (state, action: PayloadAction<IOrderRead>) => {
            state.Orders.push(action.payload);
            state.IsLoading = false;
            state.Error = null;
        },
        [createOrder.rejected.type]: (state, action: PayloadAction<string>) => {
            state.IsLoading = false;
            state.Error = action.payload;
        },

        //#endregion
    }
})

export default OrderSlice.reducer;