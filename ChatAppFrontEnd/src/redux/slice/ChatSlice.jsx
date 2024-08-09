import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import axiosInstance from "../../helpers/axioseInstance"; // Adjust path to your axios instance


// Initial state
const initialState= {
    userId: localStorage.getItem("userId") ?? "",
    ErrorMessage: "",
    SuccessMessage: "",
    isError: false,
    isLoading: false,
    success: false,
    chatlist: [],
    message: []
};

// Async thunks
export const GetChatList = createAsyncThunk(
    '/Chat/GetChatListAsync',
    async (data) => {
        try {
            const response = await axiosInstance.post('/Chat/GetChatListAsync', data);
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

export const GetMessagesList = createAsyncThunk(
    '/api/Chat/GetMessagesListAsync',
    async (data, thunkAPI) => {
        try{
        const response = await axiosInstance.post(`/Message/GetMessagesListAsync?chatId=${data.chatId}`);
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

// Slice
const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(GetChatList.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(GetChatList.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.ErrorMessage = "";
                state.success = true;
                state.chatlist = action.payload.data;
            })
            .addCase(GetChatList.rejected, (state, action) => {
                state.isLoading = false;
                state.ErrorMessage = action.payload?.message ?? "Unknown error";
                state.isError = true;
                state.success = false;
            })
            .addCase(GetMessagesList.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(GetMessagesList.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.ErrorMessage = "";
                state.success = true;
                state.message = action.payload.data;
            })
            .addCase(GetMessagesList.rejected, (state, action) => {
                state.isLoading = false;
                state.ErrorMessage = action.payload?.message ?? "Unknown error";
                state.isError = true;
                state.success = false;
            });
    },
});

export const { } = chatSlice.actions;

export const useSelectorChatState = () => {
    return useSelector((state) => state.chat);
};

export default chatSlice.reducer;
