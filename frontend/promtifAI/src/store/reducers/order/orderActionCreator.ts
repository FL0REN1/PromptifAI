import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { IOrderCreate } from "../../../models/order/IOrderCreate";
import { IOrderRead } from "../../../models/order/IOrderRead";

export const getOrderByUserId = createAsyncThunk(
    'user/getOrderByUserId',
    async (id: number, { rejectWithValue }) => {
        try {
            return await axios.get<IOrderRead>(`http://localhost:5198/api/Order?userId=${id}`).then(response => response.data);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
)

export const createOrder = createAsyncThunk(
    'user/createOrder',
    async (user: IOrderCreate, { rejectWithValue }) => {
        try {
            return await axios.post<IOrderRead>('http://localhost:5198/api/Order', user).then(response => response.data);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
)