import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axioseInstance";
import { useSelector } from "react-redux";

// Define initial state
const initialState = {
  ErrorMessage: "",
  isError: false,
  isLoading: false,
  success: false,
  user: {}
};

export const UserData = createAsyncThunk(
  '/User/GetLoginUser',
  async () => {
    try {
      const response = await axiosInstance.get(`/User/GetLoginUser`);
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

export const GetUserByUserName = createAsyncThunk("/User/GetUserListByUserName", async (data) => {
  try {
    const response = await axiosInstance.post("/User/GetUserListByUserName", data);
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
});

export const UpdateUserProfile = createAsyncThunk(
  "/User/UpdateProfile",
  async (data) => {
    try {
      console.log(data);
      
      const response = await axiosInstance.post(`/User/UpdateProfile`, data);
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

export const updateProfilePicture = createAsyncThunk(
  "/User/UploadProfilePhoto",
  async (data) => {
    try {
      const response = await axiosInstance.post(`/User/UploadProfilePhoto`, data);
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
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(UserData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(UserData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.ErrorMessage = "";
        state.user = action.payload.data;
        state.success = true;
      })
      .addCase(UserData.rejected, (state, action) => {
        state.isLoading = false;
        state.ErrorMessage = action.payload?.message;
        state.isError = true;
        state.success = false;
      })
      .addCase(UpdateUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(UpdateUserProfile.fulfilled, (state, action) => {
        state.success = true;
        state.isLoading = false;
        state.isError = false;
        state.ErrorMessage = "";
        state.user = action.payload.data;

      })
      .addCase(UpdateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.success = false;
        state.isError = true;
        state.ErrorMessage = action.payload.message;
      })
      .addCase(updateProfilePicture.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfilePicture.fulfilled, (state, action) => {
        state.success = true;
        state.isLoading = false;
        state.isError = false;
        state.ErrorMessage = "";
        state.user.profilePictureName = action.payload.data.profilePhotoBase64;
      })
      .addCase(updateProfilePicture.rejected, (state, action) => {
        state.success = false;
        state.isError = true;
        state.isLoading = false;
        state.ErrorMessage = action.payload.message;
      })
  },
});


export const { } = userSlice.actions;

export const useSelectorUserDataState = () => {
  return useSelector((state) => state.user);
};

export default userSlice.reducer;
