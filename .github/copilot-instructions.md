````instructions
# GoCinema - GitHub Copilot Instructions

> Hướng dẫn code chuẩn cho GoCinema - React Native 0.79.2 + TypeScript

---

## 1️⃣ Tech Stack & Architecture

**Core**: React Native 0.79.2, TypeScript 5.9.2 (strict), React Query, Context API, React Navigation v7

**Forms**: React Hook Form + Yup/Zod | **HTTP**: Axios service layer | **Icons**: react-native-vector-icons

**Layer**: Screens (UI) → Hooks (logic) → Services (API) → Utils (helpers)

---

## 2️⃣ Coding Standards

- **Components**: PascalCase (`LoginScreen.tsx`)
- **Hooks**: camelCase with `use` (`useLogin.ts`)
- **Services**: camelCase + `Service` (`authService.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)

### TypeScript Rules

- Always type props, state, params (no `any`)
- Use `interface` for props, `type` for unions
- Strict null checks enabled

---

## 3️⃣ Best Practices

### Validation & Error Handling

- Validate inputs với Yup/Zod schemas (đặt trong `src/Schemas/`)
- Centralized error handling với `handleApiError` utility
- Show user-friendly toast messages

### Component Rules

- Tách component khi: reusable hoặc file >300 lines
- Props interface ở đầu file
- Use `useMemo`/`useCallback` cho expensive operations

### Security

- ❌ NO logging sensitive data (tokens, passwords)
- ❌ NO hardcoded secrets
- ✅ Validate all inputs
- ✅ HTTPS only

---

## 4️⃣ Điều CẤM

### ❌ KHÔNG logic sai layer
- NO API calls trong screens (dùng Services + Hooks)
- NO business logic trong components

### ❌ KHÔNG tự nghĩ API/logic
- Check API docs/Postman trước
- Check existing services/hooks
- NO mock data (chờ API thật)

### ❌ KHÔNG dùng thư viện lạ
- Check `package.json` trước
- Thư viện có sẵn: React Query, React Hook Form, Yup/Zod, Axios, React Navigation, react-native-vector-icons

### ❌ KHÔNG để code thừa
- Remove unused imports, comments, variables
- Conditional `console.log`: `if (__DEV__) { ... }`

---

## 5️⃣ Platform Compatibility (iOS & Android)

### 🚨 CRITICAL: Mọi thay đổi phải tương thích cả iOS và Android

**Khi add thư viện/config:**
1. Test trên CẢ HAI platforms
2. Check library docs về iOS + Android support
3. Verify build success trên cả 2 platforms
4. Check native setup cho từng platform

### Native Module Setup

**Android**: `cd android && ./gradlew clean && cd .. && pnpm android`

**iOS**: `cd ios && rm -rf Pods Podfile.lock && pod install && cd .. && pnpm ios`

### New Architecture = OFF (đừng bật!)

- Android: `android/gradle.properties` → `newArchEnabled=false`
- iOS: `ios/.xcode.env.local` → `export RCT_NEW_ARCH_ENABLED=0`

### Vector Icons Setup

- **Android**: Gradle config `apply from: file("../../node_modules/react-native-vector-icons/fonts.gradle")`
- **iOS**: Auto-linked qua CocoaPods
- **KHÔNG dùng** `react-native-asset` hoặc manual copy fonts

### Platform-Specific Code

```typescript
// ✅ Runtime check
const padding = Platform.select({ ios: 10, android: 8 });

// ✅ File extension: Button.ios.tsx / Button.android.tsx
```

### Build Troubleshooting

**Android fails**: Clean gradle, delete build folders, check AndroidManifest

**iOS fails**: Clean pods, reinstall, clean DerivedData, check Info.plist

---

## 6️⃣ Quy trình Dev

### Commit Workflow

**CRITICAL**: Trước khi commit, **LUÔN LUÔN** chạy:

```bash
pnpm format
```

Commit message tự do nhưng rõ ràng (vd: "Add login screen with validation")

### Pre-Commit Checklist

- [ ] `pnpm format` - KHÔNG BAO GIỜ QUÊN
- [ ] `pnpm lint` & `pnpm type-check`
- [ ] Xóa console.log, unused imports
- [ ] Test trên simulator/device

### AsyncStorage Keys

Dùng prefix `@gocinema:` cho keys (vd: `@gocinema:auth_token`)

---

## 🎯 Tóm tắt: Khi code, hãy nhớ

1. **Format trước khi commit**: `pnpm format` - KHÔNG BAO GIỜ QUÊN
2. **Respect layer boundaries**: Screen → Hook → Service → API
3. **Type everything**: No `any`, strict TypeScript
4. **Handle errors**: Try/catch, centralized error handling
5. **Validate inputs**: Yup/Zod schemas
6. **Think mobile**: Performance, battery, network
7. **Check existing**: Reuse services, hooks, components
8. **No shortcuts**: Proper error handling, loading states
9. **Clean code**: No console.log, no dead code, no unused imports
10. **Component rules**: Tách ra khi reusable hoặc file >300 lines
11. **🚨 iOS & Android**: LUÔN test và verify build trên CẢ HAI platforms

---

**Generated for**: GoCinema Mobile App | React Native 0.79.2 + TypeScript 5.9.2
**Last updated**: November 2, 2025
````
