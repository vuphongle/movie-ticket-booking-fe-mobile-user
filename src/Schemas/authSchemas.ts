import { z } from "zod";
import { i18n } from "@Locales/i18n";

/**
 * Shared password validation rule:
 * - At least 8 characters
 * - Contains uppercase letter (A-Z)
 * - Contains lowercase letter (a-z)
 * - Contains number (0-9)
 * - Contains special character (@$!%*?&#)
 */
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

export const passwordValidation = z
  .string()
  .min(1, i18n.t("VALIDATION_PASSWORD_REQUIRED"))
  .min(8, i18n.t("VALIDATION_PASSWORD_MIN"))
  .regex(passwordRegex, i18n.t("VALIDATION_PASSWORD_COMPLEXITY"));

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, i18n.t("VALIDATION_EMAIL_REQUIRED"))
    .email(i18n.t("VALIDATION_EMAIL_INVALID")),
  password: z.string().min(1, i18n.t("VALIDATION_PASSWORD_REQUIRED")),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, i18n.t("VALIDATION_EMAIL_REQUIRED"))
    .email(i18n.t("VALIDATION_EMAIL_INVALID")),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const vietnamesePhoneRegex = /^(03|05|07|08|09|012|016|018|019)[0-9]{8}$/;

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, i18n.t("VALIDATION_NAME_REQUIRED"))
      .min(2, i18n.t("VALIDATION_NAME_MIN"))
      .max(100, i18n.t("VALIDATION_NAME_MAX")),
    email: z
      .string()
      .min(1, i18n.t("VALIDATION_EMAIL_REQUIRED"))
      .email(i18n.t("VALIDATION_EMAIL_FORMAT")),
    phone: z
      .string()
      .min(1, i18n.t("VALIDATION_PHONE_REQUIRED"))
      .regex(vietnamesePhoneRegex, i18n.t("VALIDATION_PHONE_INVALID")),
    dob: z
      .date({
        required_error: i18n.t("VALIDATION_DOB_REQUIRED"),
        invalid_type_error: i18n.t("VALIDATION_DOB_INVALID"),
      })
      .refine(
        (date) => {
          const year = date.getFullYear();
          return year >= 1900;
        },
        {
          message: i18n.t("VALIDATION_DOB_MIN_YEAR"),
        }
      )
      .refine(
        (date) => {
          const today = new Date();
          const age = today.getFullYear() - date.getFullYear();
          const monthDiff = today.getMonth() - date.getMonth();
          const dayDiff = today.getDate() - date.getDate();

          let exactAge = age;
          if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            exactAge--;
          }

          return exactAge >= 12;
        },
        {
          message: i18n.t("VALIDATION_DOB_MIN_AGE_REGISTER"),
        }
      )
      .refine(
        (date) => {
          return date <= new Date();
        },
        {
          message: i18n.t("VALIDATION_DOB_FUTURE"),
        }
      ),
    password: passwordValidation,
    confirmPassword: z.string().min(1, i18n.t("VALIDATION_CONFIRM_PASSWORD_REQUIRED")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: i18n.t("VALIDATION_PASSWORD_MISMATCH"),
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Change Password Schema
 * Validates old password, new password, and confirmation
 */
export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, i18n.t("VALIDATION_OLD_PASSWORD_REQUIRED")),
    newPassword: passwordValidation,
    confirmPassword: z.string().min(1, i18n.t("VALIDATION_CONFIRM_NEW_PASSWORD_REQUIRED")),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: i18n.t("VALIDATION_PASSWORD_MISMATCH"),
    path: ["confirmPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
