import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu là bắt buộc").min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
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
    password: z.string().min(1, "Mật khẩu là bắt buộc").min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().min(1, "Xác nhận mật khẩu là bắt buộc"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
