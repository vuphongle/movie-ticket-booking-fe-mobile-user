import { z } from "zod";

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
  .min(1, "Mật khẩu là bắt buộc")
  .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
  .regex(
    passwordRegex,
    "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt (@$!%*?&#)"
  );

export const loginSchema = z.object({
  email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu là bắt buộc"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const vietnamesePhoneRegex = /^(03|05|07|08|09|012|016|018|019)[0-9]{8}$/;

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Họ và tên là bắt buộc")
      .min(2, "Họ và tên phải có ít nhất 2 ký tự")
      .max(100, "Họ và tên không được quá 100 ký tự"),
    email: z.string().min(1, "Email là bắt buộc").email("Email không đúng định dạng"),
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
          message: "Bạn phải đủ 12 tuổi để đăng ký",
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
    password: passwordValidation,
    confirmPassword: z.string().min(1, "Xác nhận mật khẩu là bắt buộc"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Change Password Schema
 * Validates old password, new password, and confirmation
 */
export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Mật khẩu cũ là bắt buộc"),
    newPassword: passwordValidation,
    confirmPassword: z.string().min(1, "Xác nhận mật khẩu mới là bắt buộc"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
