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
