import { z } from "zod";
import { calcAge } from "@Utils/dateUtils";
import { i18n } from "@Locales/i18n";

// Vietnamese phone regex - same as in authSchemas.ts
const vietnamesePhoneRegex = /^(03|05|07|08|09|012|016|018|019)[0-9]{8}$/;

/**
 * Update Profile Schema
 * Validation rules synchronized with registration
 */
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(1, i18n.t("VALIDATION_NAME_REQUIRED"))
    .trim()
    .min(2, i18n.t("VALIDATION_NAME_MIN"))
    .max(100, i18n.t("VALIDATION_NAME_MAX")),

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
        const age = calcAge(date);
        return age >= 12;
      },
      {
        message: i18n.t("VALIDATION_DOB_MIN_AGE_PROFILE"),
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
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
