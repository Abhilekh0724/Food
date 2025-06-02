// api.ts
import axios from "axios";
import { User } from "./lib/types";

const API_URL = process.env.REACT_APP_API_BASEURL;

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to attach the token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.href = "/auth/login"; // Redirect to login on token expiration
    }
    return Promise.reject(error);
  }
);

export const login = async (
  email: string,
  password: string
): Promise<{ jwt: string; data: User }> => {
  const response = await api.post("/auth/local", {
    identifier: email,
    password,
  });
  return response.data;
};

export const register = async (
  name: string,
  email: string,
  password: string
): Promise<{ accessToken: string; user: User }> => {
  const response = await api.post("/auth/register", { name, email, password });
  return response.data;
};

export const fetchUser = async (): Promise<User> => {
  const response = await api.get("/users/me", {
    params: {
      populate: "avatar,organizerProfile.address,organizerProfile.avatar,currentAddress,organizerMembers",
    },
  });
  return response.data;
};

export default api;
