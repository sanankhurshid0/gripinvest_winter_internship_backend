// Currency formatting
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Number formatting
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("en-IN").format(num);
};

// Date formatting
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Get investment type badge variant
export const getInvestmentTypeColor = (
  type: string
): "info" | "success" | "warning" | "secondary" => {
  switch (type.toLowerCase()) {
    case "bond":
      return "info";
    case "fd":
      return "success";
    case "mf":
      return "warning";
    case "etf":
      return "info";
    default:
      return "secondary";
  }
};

// Get risk level badge variant
export const getRiskLevelColor = (
  risk: string
): "success" | "warning" | "destructive" | "secondary" => {
  switch (risk.toLowerCase()) {
    case "low":
      return "success";
    case "moderate":
      return "warning";
    case "high":
      return "destructive";
    default:
      return "secondary";
  }
};

// Calculate investment returns
export const calculateReturns = (
  amount: number,
  annualYield: number,
  tenureMonths: number
): number => {
  return amount + (amount * annualYield * tenureMonths) / (100 * 12);
};

// Capitalize first letter
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Utility function for combining class names (replacement for cn)
export const combineClasses = (
  ...classes: (string | undefined | null | false)[]
): string => {
  return classes.filter(Boolean).join(" ");
};

// Alias for backward compatibility
export const cn = combineClasses;
