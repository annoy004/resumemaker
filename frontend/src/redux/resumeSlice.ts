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

export const publishResume = createAsyncThunk<
  { publicUrl: string; resume: Resume },
  string
>("resumes/publishResume", async (resumeId) => {
  const res = await api.post(`/resumes/${resumeId}/publish`);
  return res.data;
});

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

export const createResume = createAsyncThunk<
  Resume,
  { userId: string; title?: string }
>("resumes/createResume", async (payload) => {
  const res = await api.post("/resumes", payload);
  return res.data;
});

// 🎯 Default resume template (used only once when new resume created)
const defaultResumeData = {
  name: "Arnav Singh",
  designation: "Frontend Developer",
  summary:
    "Passionate frontend developer skilled in React, TypeScript, and UI design. Experienced in building responsive, interactive applications.",
  experience: [
    {
      title: "Frontend Developer",
      company: "Coding Community",
      period: "2024–Present",
      location: "Mumbai, India",
      description:
        "Built scalable UI with React and Tailwind CSS.\nIntegrated real-time APIs with Socket.IO.\nLed responsive design initiatives.",
    },
  ],
  skills: [
    { name: "React", level: "Advanced" },
    { name: "TypeScript", level: "Intermediate" },
  ],
  projectsArray: [
    {
      title: "Resume Builder App",
      techStack: "React, Node.js",
      description: "Built full MERN stack resume builder with live preview.",
      link: "",
    },
  ],
  educationArray: [
    {
      degree: "B.E. in Computer Engineering",
      institution: "TCET",
      year: "2022–2024",
      cgpa: "8.5",
      details: "",
    },
  ],
  projects: "",
  education: "",
  contact:
    "📧 arnav.singh@example.com\n📱 +91 98765 43210\n🌐 www.arnavportfolio.com",
  tempSkills: "",
};

const defaultTheme = {
  primary: "#2563eb",
  fontFamily: "Poppins, sans-serif",
  fontSize: 3,
  lineHeight: 1.6,
  pageMargin: 4,
  sectionSpacing: 2,
};

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
        // attach defaults when new resume is created
        const newResume = {
          ...action.payload,
          data: { ...defaultResumeData, ...(action.payload.data || {}) },
          theme: { ...defaultTheme },
          template: action.payload.template || "modern",
        };
        state.list.unshift(newResume);
        state.currentResume = newResume;
      })
      .addCase(saveResume.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.list.findIndex((r) => r.id === updated.id);
        if (index >= 0) {
          // Only update backend-managed fields (id, updatedAt, createdAt, publicSlug)
          state.list[index] = {
            ...state.list[index],
            id: updated.id,
            updatedAt: updated.updatedAt,
            createdAt: updated.createdAt,
            publicSlug: updated.publicSlug,
            // DO NOT overwrite data/template/theme!
          };
        }
        if (state.currentResume?.id === updated.id) {
          state.currentResume = {
            ...state.currentResume,
            id: updated.id,
            updatedAt: updated.updatedAt,
            createdAt: updated.createdAt,
            publicSlug: updated.publicSlug,
            // DO NOT overwrite user's data/template/theme with backend version!
          };
        }
      });
  },
});

export const {
  setCurrentResume,
  updateResumeData,
  updateResumeTheme,
  updateResumeTemplate,
  clearCurrentResume,
} = resumeSlice.actions;

export default resumeSlice.reducer;
