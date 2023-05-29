import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IUserRead } from "../../../models/user/IUserRead";
import { checkLoginResetUser, checkVerifyUser, checkLoginUser, checkRegisterUser, createUser, deleteUser, getUser, checkPassowrdResetUser, changeUserPassword, getAllUsers, CheckUserMsgAndRoomIsOnOff } from "./userActionCreator";
import { changeUser } from "./userActionCreator";

interface IUserState {
    Users: IUserRead[];
    IsLoading: boolean;
    Error: string | null;
}

const initialState: IUserState = {
    Users: [],
    IsLoading: false,
    Error: null
}

export const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: {
        //#region [Get_User_By_Id]

        [getUser.pending.type]: (state) => {
            state.Users = [];
            state.IsLoading = true;
            state.Error = null;
        },
        [getUser.fulfilled.type]: (state, action: PayloadAction<IUserRead[]>) => {
            state.Users = action.payload;
            state.IsLoading = false;
            state.Error = null;
        },
        [getUser.rejected.type]: (state, action: PayloadAction<string>) => {
            state.Users = [];
            state.IsLoading = false;
            state.Error = action.payload;
        },

        //#endregion

        //#region [Get_All_Users]

        [getAllUsers.pending.type]: (state) => {
            state.Users = [];
            state.IsLoading = true;
            state.Error = null;
        },
        [getAllUsers.fulfilled.type]: (state, action: PayloadAction<IUserRead[]>) => {
            state.Users = action.payload;
            state.IsLoading = false;
            state.Error = null;
        },
        [getAllUsers.rejected.type]: (state, action: PayloadAction<string>) => {
            state.Users = [];
            state.IsLoading = false;
            state.Error = action.payload;
        },

        //#endregion

        //#region [Create_User]

        [createUser.pending.type]: (state) => {
            state.IsLoading = true;
            state.Error = null;
        },
        [createUser.fulfilled.type]: (state, action: PayloadAction<IUserRead>) => {
            state.Users.push(action.payload);
            state.IsLoading = false;
            state.Error = null;
        },
        [createUser.rejected.type]: (state, action: PayloadAction<string>) => {
            state.IsLoading = false;
            state.Error = action.payload;
        },

        //#endregion

        //#region [Delete_User]

        [deleteUser.pending.type]: (state) => {
            state.IsLoading = true;
            state.Error = null;
        },
        [deleteUser.fulfilled.type]: (state, action: PayloadAction<IUserRead>) => {
            state.Users.filter(user => user.id !== action.payload.id);
            state.IsLoading = false;
            state.Error = null;
        },
        [deleteUser.rejected.type]: (state, action: PayloadAction<string>) => {
            state.IsLoading = false;
            state.Error = action.payload;
        },

        //#endregion

        //#region [Check_Login_User]

        [checkLoginUser.pending.type]: (state) => {
            state.IsLoading = true;
            state.Error = null;
        },
        [checkLoginUser.fulfilled.type]: (state, action: PayloadAction<IUserRead[]>) => {
            state.Users = action.payload;
            state.IsLoading = false;
            state.Error = null;
        },
        [checkLoginUser.rejected.type]: (state, action: PayloadAction<string>) => {
            state.IsLoading = false;
            state.Error = action.payload;
        },

        //#endregion

        //#region [Check_Register_User]

        [checkRegisterUser.pending.type]: (state) => {
            state.IsLoading = true;
            state.Error = null;
        },
        [checkRegisterUser.fulfilled.type]: (state, action: PayloadAction<IUserRead[]>) => {
            state.Users = action.payload;
            state.IsLoading = false;
            state.Error = null;
        },
        [checkRegisterUser.rejected.type]: (state, action: PayloadAction<string>) => {
            state.IsLoading = false;
            state.Error = action.payload;
        },

        //#endregion

        //#region [Check_Verify_User]

        [checkVerifyUser.pending.type]: (state) => {
            state.IsLoading = true;
            state.Error = null;
        },
        [checkVerifyUser.fulfilled.type]: (state, action: PayloadAction<IUserRead[]>) => {
            state.Users = action.payload;
            state.IsLoading = false;
            state.Error = null;
        },
        [checkVerifyUser.rejected.type]: (state, action: PayloadAction<string>) => {
            state.IsLoading = false;
            state.Error = action.payload;
        },

        //#endregion

        //#region [Check_Login_User]

        [checkLoginResetUser.pending.type]: (state) => {
            state.IsLoading = true;
            state.Error = null;
        },
        [checkLoginResetUser.fulfilled.type]: (state, action: PayloadAction<IUserRead[]>) => {
            state.Users = action.payload;
            state.IsLoading = false;
            state.Error = null;
        },
        [checkLoginResetUser.rejected.type]: (state, action: PayloadAction<string>) => {
            state.IsLoading = false;
            state.Error = action.payload;
        },

        //#endregion

        //#region [Check_Password_User]

        [checkPassowrdResetUser.pending.type]: (state) => {
            state.IsLoading = true;
            state.Error = null;
        },
        [checkPassowrdResetUser.fulfilled.type]: (state, action: PayloadAction<IUserRead[]>) => {
            state.Users = action.payload;
            state.IsLoading = false;
            state.Error = null;
        },
        [checkPassowrdResetUser.rejected.type]: (state, action: PayloadAction<string>) => {
            state.IsLoading = false;
            state.Error = action.payload;
        },

        //#endregion

        //#region [Check_User_Msg_And_Room_Is_On_Off]

        [CheckUserMsgAndRoomIsOnOff.pending.type]: (state) => {
            state.IsLoading = true;
            state.Error = null;
        },
        [CheckUserMsgAndRoomIsOnOff.fulfilled.type]: (state, action: PayloadAction<IUserRead[]>) => {
            state.Users = action.payload;
            state.IsLoading = false;
            state.Error = null;
        },
        [CheckUserMsgAndRoomIsOnOff.rejected.type]: (state, action: PayloadAction<string>) => {
            state.IsLoading = false;
            state.Error = action.payload;
        },

        //#endregion

        //#region [Change_User]

        [changeUser.pending.type]: (state) => {
            state.IsLoading = true;
            state.Error = null;
        },
        [changeUser.fulfilled.type]: (state) => {
            state.IsLoading = false;
            state.Error = null;
        },
        [changeUser.rejected.type]: (state, action: PayloadAction<string>) => {
            state.IsLoading = true;
            state.Error = action.payload;
        },

        //#endregion

        //#region [Change_User_Password]

        [changeUserPassword.pending.type]: (state) => {
            state.IsLoading = true;
            state.Error = null;
        },
        [changeUserPassword.fulfilled.type]: (state) => {
            state.IsLoading = false;
            state.Error = null;
        },
        [changeUserPassword.rejected.type]: (state, action: PayloadAction<string>) => {
            state.IsLoading = true;
            state.Error = action.payload;
        },

        //#endregion
    }
})

export default UserSlice.reducer;