import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

// 🎯 Define the type for a Resume
export interface Resume {
  id: string;
  title: string;
  userId: string;
  updatedAt: string;
  createdAt: string;
  data?: any;
  template?: string;
  theme?: any;
  publicSlug?: string | null;
}

// 🎯 Define state structure
interface ResumeState {
  list: Resume[];
  loading: boolean;
}

// 🎯 Initial state
const initialState: ResumeState = {
  list: [],
  loading: false,
};

// 🎯 Thunks
export const fetchResumes = createAsyncThunk<Resume[], string>(
  "resumes/fetchResumes",
  async (userId) => {
    const res = await api.get(`/resumes?userId=${userId}`);
    return res.data;
  }
);

export const createResume = createAsyncThunk<Resume, { userId: string; title?: string }>(
  "resumes/createResume",
  async (payload) => {
    const res = await api.post("/resumes", payload);
    return res.data;
  }
);

// 🎯 Slice
const resumeSlice = createSlice({
  name: "resumes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchResumes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchResumes.fulfilled, (state, action: PayloadAction<Resume[]>) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchResumes.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createResume.fulfilled, (state, action: PayloadAction<Resume>) => {
        state.list.unshift(action.payload);
      });
  },
});

export default resumeSlice.reducer;
