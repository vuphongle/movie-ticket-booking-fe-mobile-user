import { format, parse, isValid } from "date-fns";

/**
 * Convert date to ISO date string (YYYY-MM-DD)
 * Used for API payload
 */
export const toISODate = (date: Date | string | null | undefined): string => {
  if (!date) return "";

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (!isValid(dateObj)) return "";

    return format(dateObj, "yyyy-MM-dd");
  } catch (error) {
    console.error("Error converting to ISO date:", error);
    return "";
  }
};

/**
 * Format date to display format (DD/MM/YYYY)
 * Used for UI display
 */
export const toDisplayDate = (date: Date | string | null | undefined): string => {
  if (!date) return "";

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (!isValid(dateObj)) return "";

    return format(dateObj, "dd/MM/yyyy");
  } catch (error) {
    console.error("Error formatting display date:", error);
    return "";
  }
};

/**
 * Parse ISO date string to Date object
 */
export const parseISODate = (dateStr: string | null | undefined): Date | null => {
  if (!dateStr) return null;

  try {
    const parsed = parse(dateStr, "yyyy-MM-dd", new Date());
    return isValid(parsed) ? parsed : null;
  } catch (error) {
    console.error("Error parsing ISO date:", error);
    return null;
  }
};

/**
 * Calculate age from date of birth
 * Returns exact age in years
 */
export const calcAge = (dob: Date | string | null | undefined): number => {
  if (!dob) return 0;

  try {
    const birthDate = typeof dob === "string" ? new Date(dob) : dob;
    if (!isValid(birthDate)) return 0;

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    // Adjust age if birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  } catch (error) {
    console.error("Error calculating age:", error);
    return 0;
  }
};

/**
 * Check if date is in the future
 */
export const isFutureDate = (date: Date | string): boolean => {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (!isValid(dateObj)) return false;

    return dateObj > new Date();
  } catch (error) {
    return false;
  }
};

/**
 * Get minimum date (e.g., for date picker)
 */
export const getMinimumDate = (): Date => {
  return new Date(1900, 0, 1);
};

/**
 * Get maximum date (today)
 */
export const getMaximumDate = (): Date => {
  return new Date();
};

/**
 * Convert array date format from backend to Date object
 * Backend returns: [year, month, day, hour, minute, second, nanosecond]
 * Month is 1-indexed in backend (1 = January, 2 = February, etc.)
 *
 * @param dateArray - Array of date components from backend
 * @returns Date object or null if invalid
 */
export const parseBackendDate = (dateArray: number[] | string | null | undefined): Date | null => {
  if (!dateArray) return null;

  // If it's already a string (ISO format), parse it directly
  if (typeof dateArray === "string") {
    const date = new Date(dateArray);
    return isValid(date) ? date : null;
  }

  // If it's an array from backend: [year, month, day, hour, minute, second, nanosecond]
  if (Array.isArray(dateArray) && dateArray.length >= 3) {
    const [year, month, day, hour = 0, minute = 0, second = 0] = dateArray;

    // Backend uses 1-indexed months (1 = January), JavaScript uses 0-indexed (0 = January)
    const date = new Date(year, month - 1, day, hour, minute, second);

    return isValid(date) ? date : null;
  }

  return null;
};

/**
 * Format backend date array to Vietnamese locale string
 *
 * @param date - Date object or backend date array
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string or empty string if invalid
 */
export const formatBackendDate = (
  date: Date | number[] | string | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string => {
  const parsedDate = date instanceof Date ? date : parseBackendDate(date);

  if (!parsedDate || !isValid(parsedDate)) return "";

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  };

  return parsedDate.toLocaleDateString("vi-VN", defaultOptions);
};

/**
 * Format backend date to short Vietnamese format (dd/mm/yyyy)
 *
 * @param date - Date object or backend date array
 * @returns Formatted date string (e.g., "29/02/2024") or empty string if invalid
 */
export const formatBackendDateShort = (
  date: Date | number[] | string | null | undefined
): string => {
  return formatBackendDate(date, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

/**
 * Format backend date to relative time (e.g., "2 ngày trước", "1 tuần trước")
 *
 * @param date - Date object or backend date array
 * @returns Relative time string or formatted date if too old
 */
export const formatRelativeTime = (date: Date | number[] | string | null | undefined): string => {
  const parsedDate = date instanceof Date ? date : parseBackendDate(date);

  if (!parsedDate || !isValid(parsedDate)) return "";

  const now = new Date();
  const diffMs = now.getTime() - parsedDate.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffSeconds < 60) return "Vừa xong";
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;
  if (diffWeeks < 4) return `${diffWeeks} tuần trước`;
  if (diffMonths < 12) return `${diffMonths} tháng trước`;

  // If more than 1 year, show full date
  return formatBackendDate(parsedDate, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDate = (
  dateInput?: string | number | Date | [number, number, number]
): string => {
  if (!dateInput) return "N/A";

  let date: Date;

  if (Array.isArray(dateInput)) {
    const [year, month, day] = dateInput;
    date = new Date(year, month - 1, day);
  } else {
    date = new Date(dateInput);
  }

  if (isNaN(date.getTime())) return "N/A";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};
