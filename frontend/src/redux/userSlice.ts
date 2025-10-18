import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

export interface User {
  id: string;
  email: string;
  name?: string;
}

interface UserState {
  user: User | null;
  loading: boolean;
}

const initialState: UserState = {
  user: null,
  loading: false,
};

export const ensureUser = createAsyncThunk<User, { email: string; name?: string }>(
  "user/ensureUser",
  async (userData) => {
    const res = await api.post("/users/ensure", userData);
    return res.data;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(ensureUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(ensureUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(ensureUser.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default userSlice.reducer;
