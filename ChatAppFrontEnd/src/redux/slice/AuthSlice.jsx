import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../../helpers/axioseInstance";
import { useSelector } from "react-redux";

// Define initial state
const initialState = {
    isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
    token: localStorage.getItem("token") ?? "",
    userId: localStorage.getItem("userId") ?? "",
    ErrorMessage: "",
    SuccessMessage: "",
    isError: false,
    isLoading: false,
    success: false,
};

export const login = createAsyncThunk(
    'auth/login',
    async (data,thunkAPI) => {
      try {
        const response = await axiosInstance.post('/Auth/Login', data);
        if (response.data.isSuccess) {
          return response.data;
        } else {
          return thunkAPI.rejectWithValue(await response.data);
        }
      } catch (error) {
        if (error.response) {
          return thunkAPI.rejectWithValue(error.response.data);
        } else {
          return thunkAPI.rejectWithValue({ message: error.message });
        }
      }
    }
  );

export const signup = createAsyncThunk(
    "auth/register",
    async (data,thunkAPI) => {
        try {
            const response = await axiosInstance.post(`/Auth/Register`, data);
            if (response.data.isSuccess) {
              return response.data;
            } else {
              return thunkAPI.rejectWithValue(await response.data);
            }
          } catch (error) {
            if (error.response) {
              return thunkAPI.rejectWithValue(error.response.data);
            } else {
              return thunkAPI.rejectWithValue({ message: error.message });
            }
          }
    }
);

export const UserDataById = createAsyncThunk(
    '/User/GetUserById',
    async (data,thunkAPI) => {
      try {
        const response = await axiosInstance.get(`/User/GetUserById?userId=${data.userId}`);
        if (response.data.isSuccess) {
          return response.data;
        } else {
          return thunkAPI.rejectWithValue(await response.data);
        }
      } catch (error) {
        if (error.response) {
          return thunkAPI.rejectWithValue(error.response.data);
        } else {
          return thunkAPI.rejectWithValue({ message: error.message });
        }
      }
    }
  );
// Define slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            state.isLoggedIn = false;
            state.token = "";
        },
        resetError(state) {
            state.SuccessMessage = '';
            state.isError = false;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.ErrorMessage = "";
                state.token = action.payload.data.token;
                state.isLoggedIn = true;
                localStorage.setItem("token", action.payload.data.token);
                localStorage.setItem("isLoggedIn", "true");
                try {
                    const decodedToken = jwtDecode(state.token);
                    if (decodedToken) {
                        localStorage.setItem("userId", decodedToken.UserId);
                    }
                } catch (error) {
                    console.error("Error decoding token:", error.message);
                    localStorage.removeItem("userId");
                }
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isLoggedIn = false;
                state.isError = true;
                state.ErrorMessage = action.payload.message;
                
                state.success = false;
            })
            .addCase(signup.fulfilled, (state) => {
                state.isLoading = false;
                state.isError = false;
                state.success = true;
            })
            .addCase(signup.rejected, (state, action) => {
                state.isLoading = false;
                state.isLoggedIn = false;
                state.ErrorMessage = action.payload.data[0]?.message ?? "Unknown error";
                state.isError = true;
                state.success = false;
            })
            .addCase(UserDataById.pending, (state) => {
              state.isLoading = true;
            })
            .addCase(UserDataById.fulfilled, (state, action) => {
              state.isLoading = false;
              state.isError = false;
              state.ErrorMessage = "";
              state.success = true;
            })
            .addCase(UserDataById.rejected, (state, action) => {
              state.isLoading = false;
              state.ErrorMessage = action.payload?.message;
              state.isError = true;
              state.success = false;
            })
    },
});


export const { logout, resetError } = authSlice.actions;

export const useSelectorUserState = () => {
    return useSelector((state) => state.auth);
  };

export default authSlice.reducer;
