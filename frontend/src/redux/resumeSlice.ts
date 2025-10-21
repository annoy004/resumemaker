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
  currentResume: Resume | null;
  loading: boolean;
}

const initialState: ResumeState = {
  list: [],
  currentResume: null,
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

// 🎯 Publish resume (generate shareable link)
export const publishResume = createAsyncThunk<
  { publicUrl: string; resume: Resume },
  string
>("resumes/publishResume", async (resumeId) => {
  const res = await api.post(`/resumes/${resumeId}/publish`);
  return res.data;
});

// 🎯 Get a single public resume (for /r/:slug)
export const getPublicResume = createAsyncThunk<Resume, string>(
  "resumes/getPublicResume",
  async (slug) => {
    const res = await api.get(`/resumes/public/${slug}`);
    return res.data;
  }
);
export const saveResume = createAsyncThunk<
  Resume,
  { resumeId: string; data: any }
>("resumes/saveResume", async ({ resumeId, data }) => {
  const res = await api.put(`/resumes/${resumeId}`, { data });
  return res.data;
});



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
  reducers: {
    setCurrentResume: (state, action: PayloadAction<Resume>) => {
      state.currentResume = action.payload;
    },
    updateResumeData: (state, action: PayloadAction<any>) => {
      if (state.currentResume) {
        state.currentResume.data = {
          ...state.currentResume.data,
          ...action.payload,
        };
      }
    },
    updateResumeTheme: (state, action: PayloadAction<any>) => {
      if (state.currentResume) {
        state.currentResume.theme = {
          ...state.currentResume.theme,
          ...action.payload,
        };
      }
    },
    updateResumeTemplate: (state, action: PayloadAction<string>) => {
      if (state.currentResume) {
        state.currentResume.template = action.payload;
      }
    },
    clearCurrentResume: (state) => {
      state.currentResume = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResumes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchResumes.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(createResume.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
        state.currentResume = action.payload;
      })
      .addCase(saveResume.fulfilled, (state, action) => {
        const updatedResume = action.payload;
        const index = state.list.findIndex((r) => r.id === updatedResume.id);
        if (index >= 0) {
          state.list[index] = updatedResume;
        }
        if (state.currentResume?.id === updatedResume.id) {
          state.currentResume = updatedResume;
        }
      });
  },
});

export const { 
  setCurrentResume, 
  updateResumeData, 
  updateResumeTheme, 
  updateResumeTemplate, 
  clearCurrentResume 
} = resumeSlice.actions;
export default resumeSlice.reducer;



