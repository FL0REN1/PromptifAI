import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { IUserRead } from "../../../models/user/IUserRead";
import { IUserCreate } from "../../../models/user/IUserCreate";
import { IUserDelete } from "../../../models/user/IUserDelete";
import { IUserLogin } from "../../../models/user/IUserLogin";
import { IUserChange } from "../../../models/user/IUserChange";
import { IUserRegister } from "../../../models/user/IUserRegister";
import { IUserVerify } from "../../../models/user/IUserVerify";
import { IUserCheckLogin } from "../../../models/user/IUserCheckLogin";
import { IUserCheckPassword } from "../../../models/user/IUserCheckPassword";
import { IUserMsgAndRoomIsOnOff } from "../../../models/user/IUserMsgAndRoomIsOnOff";

export const getUser = createAsyncThunk(
    'user/getUser',
    async (id: number, { rejectWithValue }) => {
        try {
            return await axios.get<IUserRead>(`http://localhost:5010/api/User/id?id=${id}`).then(response => response.data);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
)

export const getAllUsers = createAsyncThunk(
    'user/getAllUsers',
    async (_, { rejectWithValue }) => {
        try {
            return await axios.get<IUserRead>('http://localhost:5010/api/User/all').then(response => response.data);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
)

export const createUser = createAsyncThunk(
    'user/createUser',
    async (user: IUserCreate, { rejectWithValue }) => {
        try {
            return await axios.post<IUserRead>('http://localhost:5010/api/User', user).then(response => response.data);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
)

export const deleteUser = createAsyncThunk(
    'user/deleteUser',
    async ({ Id }: IUserDelete, { rejectWithValue }) => {
        try {
            return await axios.delete<IUserRead>('http://localhost:5010/api/User', { data: { Id } }).then(response => response.data);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const checkLoginUser = createAsyncThunk(
    'user/checkLogin',
    async (user: IUserLogin, { rejectWithValue }) => {
        try {
            return await axios.post<IUserRead>('http://localhost:5010/api/User/login', user).then(response => response.data)
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
)

export const checkRegisterUser = createAsyncThunk(
    'user/checkRegister',
    async (user: IUserRegister, { rejectWithValue }) => {
        try {
            return await axios.post<IUserRead>('http://localhost:5010/api/User/register', user).then(response => response.data)
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
)

export const checkVerifyUser = createAsyncThunk(
    'user/checkVerify',
    async (user: IUserVerify, { rejectWithValue }) => {
        try {
            return await axios.post<IUserRead>('http://localhost:5010/api/User/register/verify', user).then(response => response.data)
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
)

export const checkLoginResetUser = createAsyncThunk(
    'user/checkLogin',
    async (user: IUserCheckLogin, { rejectWithValue }) => {
        try {
            return await axios.post<IUserRead>('http://localhost:5010/api/User/login/reset', user).then(response => response.data)
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
)

export const checkPassowrdResetUser = createAsyncThunk(
    'user/checkPassword',
    async (user: IUserCheckPassword, { rejectWithValue }) => {
        try {
            return await axios.post<IUserRead>('http://localhost:5010/api/User/password/reset', user).then(response => response.data)
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
)

export const CheckUserMsgAndRoomIsOnOff = createAsyncThunk(
    'user/checkUserMsgAndRoomIsOnOff',
    async (user: IUserMsgAndRoomIsOnOff, { rejectWithValue }) => {
        try {
            return await axios.post<IUserRead>('http://localhost:5010/api/User/chat/msgAndRoomIsOnOff', user).then(response => response.data)
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
)

export const changeUser = createAsyncThunk(
    'user/changeUser',
    async (user: IUserChange, { rejectWithValue }) => {
        try {
            return await axios.put<IUserRead>('http://localhost:5010/api/User/change', user).then(response => response.data)
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
)

export const changeUserPassword = createAsyncThunk(
    'user/changeUser',
    async (user: IUserLogin, { rejectWithValue }) => {
        try {
            return await axios.put<IUserRead>('http://localhost:5010/api/User/change/password', user).then(response => response.data)
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
)