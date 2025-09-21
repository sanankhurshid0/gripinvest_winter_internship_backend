import Cookies from "js-cookie";

export interface User {
  id: string;
  first_name: string;
  last_name?: string;
  email: string;
  risk_appetite: "low" | "moderate" | "high";
}

export const AUTH_COOKIE_NAME = "auth_token";
export const USER_COOKIE_NAME = "user_data";

export const authUtils = {
  // Store auth data
  setAuth: (token: string, user: User) => {
    Cookies.set(AUTH_COOKIE_NAME, token, {
      expires: 1, // 1 day
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    Cookies.set(USER_COOKIE_NAME, JSON.stringify(user), {
      expires: 1,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  },

  // Get auth token
  getToken: (): string | null => {
    return Cookies.get(AUTH_COOKIE_NAME) || null;
  },

  // Get user data
  getUser: (): User | null => {
    const userData = Cookies.get(USER_COOKIE_NAME);
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch {
        return null;
      }
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!authUtils.getToken();
  },

  // Logout user
  logout: () => {
    Cookies.remove(AUTH_COOKIE_NAME);
    Cookies.remove(USER_COOKIE_NAME);
  },

  // Get user's risk appetite color
  getRiskColor: (risk: string): string => {
    switch (risk) {
      case "low":
        return "text-green-600 bg-green-50";
      case "moderate":
        return "text-yellow-600 bg-yellow-50";
      case "high":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  },
};
