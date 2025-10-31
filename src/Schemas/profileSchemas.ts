import { z } from "zod";
import { calcAge } from "@Utils/dateUtils";

// Vietnamese phone regex - same as in authSchemas.ts
const vietnamesePhoneRegex = /^(03|05|07|08|09|012|016|018|019)[0-9]{8}$/;

/**
 * Update Profile Schema
 * Validation rules synchronized with registration
 */
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(1, "Họ và tên là bắt buộc")
    .trim()
    .min(2, "Họ và tên phải có ít nhất 2 ký tự")
    .max(100, "Họ và tên không được quá 100 ký tự"),

  phone: z
    .string()
    .min(1, "Số điện thoại là bắt buộc")
    .regex(vietnamesePhoneRegex, "Số điện thoại không đúng định dạng"),

  dob: z
    .date({
      required_error: "Ngày sinh là bắt buộc",
      invalid_type_error: "Ngày sinh không hợp lệ",
    })
    .refine(
      (date) => {
        const year = date.getFullYear();
        return year >= 1900;
      },
      {
        message: "Năm sinh phải từ 1900 trở lên",
      }
    )
    .refine(
      (date) => {
        const age = calcAge(date);
        return age >= 12;
      },
      {
        message: "Bạn phải đủ 12 tuổi để sử dụng dịch vụ",
      }
    )
    .refine(
      (date) => {
        return date <= new Date();
      },
      {
        message: "Ngày sinh không được là ngày trong tương lai",
      }
    ),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
