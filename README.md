# GoCinema

Ứng dụng di động **GoCinema** phát triển bằng **React Native**.

## 🚀 Công nghệ sử dụng

- React Native
- Redux Toolkit
- React Navigation
- i18next (đa ngôn ngữ)
- Axios (gọi API)

## 📦 Cài đặt

```bash
pnpm install
```

## ▶️ Chạy dự án

### Android

- Mặc định:
  ```bash
  pnpm android
  ```
- Dev:
  ```bash
  pnpm android:dev
  ```
- UAT:
  ```bash
  pnpm android:uat
  ```

### iOS

Cài đặt pod trước khi chạy:

```bash
cd ios && pod install && cd ..
```

- Mặc định:
  ```bash
  pnpm ios
  ```
- Dev:
  ```bash
  pnpm ios:dev
  ```
- UAT:
  ```bash
  pnpm ios:uat
  ```

## 🔧 Lệnh phát triển

- `pnpm start` – Khởi động Metro Bundler
- `pnpm lint` / `pnpm lint:fix` – Kiểm tra & sửa lint
- `pnpm format` / `pnpm format:check` – Định dạng code với Prettier
- `pnpm test` / `pnpm test:watch` / `pnpm test:coverage` – Unit test với Jest
- `pnpm type-check` – Kiểm tra type với TypeScript
- `pnpm clean` – Xóa cache, node_modules, lockfile, cài lại & reset Metro

## 📂 Cấu trúc thư mục

- `App.tsx` – Điểm khởi đầu ứng dụng
- `android/` – Cấu hình Android
- `ios/` – Cấu hình iOS
- `__tests__/` – Unit test

## ⚠️ Ghi chú

- Yêu cầu **Node.js >= 18** và **pnpm**.
- Nếu lỗi iOS → kiểm tra Xcode & chạy lại `pod install`.
- Các môi trường dev/uat cần file `.env.dev` hoặc `.env.uat`.

---

👉 Tham khảo thêm tại [React Native Docs](https://reactnative.dev/docs/getting-started).
