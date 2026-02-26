import axios from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
  baseURL: "https://api.freeapi.app/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync("token");
      router.replace("/login");
    }

    return Promise.reject(error);
  },
);

export default api;
