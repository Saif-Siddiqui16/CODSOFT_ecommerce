import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import type { RegisterFormData } from "@/pages/auth/Register";
import type { LoginFormData } from "@/pages/auth/Login";

export const API_BASE_URL = import.meta.env.VITE_API_BACKEND_URL;

export interface User {
  id: string;
  userName: string;
  email: string;
  role: "user" | "admin";
}

export interface BackendError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  registerError: BackendError | null;
  loginError: BackendError | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
  registerError: null,
  loginError: null,
};

export const registerUser = createAsyncThunk<
  { message: string; success: boolean },
  RegisterFormData,
  { rejectValue: BackendError }
>("auth/register", async (formData, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/auth/register`,
      formData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.data) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue({ message: "Network error" });
  }
});

export const loginUser = createAsyncThunk<
  { success: boolean; user: User },
  LoginFormData,
  { rejectValue: BackendError }
>("auth/login", async (formData, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/auth/login`,
      formData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.data) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue({ message: "Network error" });
  }
});

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Network error" });
    }
  }
);

export const checkAuth = createAsyncThunk<
  { success: boolean; user: User },
  void,
  { rejectValue: BackendError }
>("auth/checkAuth", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
      withCredentials: true,
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.data) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue({ message: "Network error" });
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.registerError = null;
      state.loginError = null;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.registerError = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.registerError = action.payload || {
          message: "Registration failed",
        };
      })

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.loginError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
          state.loginError = null;
        } else {
          state.user = null;
          state.isAuthenticated = false;
          state.loginError = { message: "Login failed" };
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.loginError = action.payload || { message: "Login failed" };
      })

      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearErrors, setUser } = authSlice.actions;

export default authSlice.reducer;
