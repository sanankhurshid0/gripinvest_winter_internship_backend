export interface User {
  id: string;
  first_name: string;
  last_name?: string;
  email: string;
  risk_appetite: "low" | "moderate" | "high";
  created_at?: string;
}

export interface InvestmentProduct {
  id: string;
  name: string;
  investment_type: "bond" | "fd" | "mf" | "etf" | "other";
  tenure_months: number;
  annual_yield: number;
  risk_level: "low" | "moderate" | "high";
  min_investment: number;
  max_investment?: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Investment {
  id: string;
  user_id: string;
  product_id: string;
  amount: number;
  invested_at: string;
  status: "active" | "matured" | "cancelled";
  expected_return: number;
  maturity_date: string;
  product_name: string;
  investment_type: string;
  risk_level: string;
  description?: string;
}

export interface PortfolioSummary {
  total_invested: number;
  total_expected_return: number;
  total_gain: number;
  active_investments: number;
}

export interface APIResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  first_name: string;
  last_name?: string;
  email: string;
  password: string;
  confirmPassword: string;
  risk_appetite: "low" | "moderate" | "high";
}

export interface InvestmentFormData {
  product_id: string;
  amount: number;
}
