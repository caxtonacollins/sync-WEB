/**
 * Shared utility functions for formatting data across admin and user interfaces
 */

export const formatTokenAmount = (amount: number | string, decimals: number = 2): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return num.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: true
  });
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  NGN: "₦",
  USD: "$",
  EUR: "€",
  GBP: "£",
  BTC: "₿",
  ETH: "Ξ"
  // Add more symbols as needed
};

export const formatCurrency = (amount: number, currency: string, decimals = 2): string => {
  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  
  // For known fiat currencies, use the browser's currency formatter
  if (CURRENCY_SYMBOLS[currency] && currency.length === 3) {
    try {
      return amount.toLocaleString(undefined, {
        style: 'currency',
        currency,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    } catch (error) {
      // Fall through to default formatter if currency formatting fails
    }
  }
  
  // For crypto or unknown currencies, use a simple format
  const formattedAmount = formatNumber(amount, decimals);
  return `${symbol} ${formattedAmount}`;
};

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return formatDate(date);
};

export const formatAddress = (address: string, chars: number = 6): string => {
  if (address.length <= chars * 2) return address;
  return `${address.substring(0, chars)}...${address.substring(
    address.length - chars
  )}`;
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const formatNumber = (value: number | null | undefined, decimals: number = 2, fallback: string = '0.00'): string => {
  if (value === null || value === undefined) return fallback;
  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: true
  });
};

export const truncateText = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};
