import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      Cookies.remove("auth_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  signup: (data: {
    first_name: string;
    last_name?: string;
    email: string;
    password: string;
    risk_appetite?: "low" | "moderate" | "high";
  }) => api.post("/api/auth/signup", data),

  login: (data: { email: string; password: string }) =>
    api.post("/api/auth/login", data),

  getProfile: () => api.get("/api/auth/profile"),
};

// Products API calls
export const productsAPI = {
  getProducts: (params?: {
    risk_level?: string;
    investment_type?: string;
    sort_by?: string;
  }) => api.get("/api/products", { params }),

  getProduct: (productId: string) => api.get(`/api/products/${productId}`),

  getRecommendations: () => api.get("/api/products/recommendations/for-me"),
};

// Investments API calls
export const investmentsAPI = {
  createInvestment: (data: { product_id: string; amount: number }) =>
    api.post("/api/investments", data),

  getInvestments: () => api.get("/api/investments"),

  getInvestment: (investmentId: string) =>
    api.get(`/api/investments/${investmentId}`),

  cancelInvestment: (investmentId: string) =>
    api.patch(`/api/investments/${investmentId}/cancel`),
};

// Health check
export const healthAPI = {
  check: () => api.get("/health"),
};

export default api;
