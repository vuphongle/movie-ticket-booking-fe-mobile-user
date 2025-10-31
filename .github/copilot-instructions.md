# GoCinema - GitHub Copilot Instructions

> **Mục đích**: Hướng dẫn GitHub Copilot sinh code đúng chuẩn cho dự án GoCinema - React Native mobile app.

---

## 1️⃣ Ngữ cảnh dự án

### Tech Stack

- **Platform**: React Native 0.79.2
- **Language**: TypeScript 5.9.2 (strict mode)
- **State Management**: Context API (Auth, Loading, Theme) + React Query (@tanstack/react-query)
- **Navigation**: React Navigation v7 (Stack + Bottom Tabs)
- **Form**: React Hook Form + Yup/Zod validation
- **HTTP Client**: Axios với custom service layer
- **Styling**: Custom theme system với hooks

### Kiến trúc

**Pattern**: Feature-based architecture với separation of concerns

**Layer structure**:

```
src/
├── Screens/          # UI Layer - Màn hình & layouts
├── Components/       # Reusable UI components
├── Contexts/         # Global state (Auth, Loading, Theme)
├── Hooks/            # Custom hooks (business logic + UI logic)
├── Services/         # API calls & external integrations
├── Utils/            # Pure functions & helpers
├── Types/            # TypeScript types & interfaces
├── Constants/        # Config, endpoints, theme tokens
├── Schemas/          # Validation schemas (Yup/Zod)
└── Navigation/       # Navigation setup & routes
```

### Coding Paradigm

- **Primary**: Functional Programming với React Hooks
- **Component**: Function components với TypeScript
- **State**: Immutable updates, avoid mutations
- **Side Effects**: Quản lý bằng useEffect, React Query, custom hooks

---

## 2️⃣ Code Style & Conventions

### ESLint & Prettier Rules

```json
{
  "singleQuote": false,
  "semi": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always"
}
```

**Key ESLint rules**:

- `no-unused-vars`: Error (except prefixed with `_`)
- `@typescript-eslint/no-explicit-any`: Off (nhưng hạn chế dùng)
- `react/react-in-jsx-scope`: Off (React 17+ auto-import)

### Naming Conventions

| Type             | Convention                                | Example                                |
| ---------------- | ----------------------------------------- | -------------------------------------- |
| Components       | PascalCase                                | `PickButton.tsx`, `LoginScreen.tsx`    |
| Hooks            | camelCase with `use` prefix               | `useLogin.ts`, `useThemedStyles.ts`    |
| Services         | camelCase with `Service` suffix           | `authService.ts`, `httpService.ts`     |
| Types/Interfaces | PascalCase, Interface prefix `I` optional | `AuthState`, `IButtonProps`            |
| Constants        | UPPER_SNAKE_CASE                          | `API_BASE_URL`, `AUTH_TOKEN_KEY`       |
| Functions        | camelCase                                 | `handleLogin`, `extractErrorMessage`   |
| Files            | Match export name                         | `authService.ts` exports `authService` |

### TypeScript Strict Mode

- **Always** định nghĩa types cho props, state, function params
- **Prefer** `interface` cho component props
- **Prefer** `type` cho unions, intersections
- **Avoid** `any` - dùng `unknown` hoặc generic nếu cần
- **Use** strict null checks - không assume value luôn tồn tại

### Async/Await Rules

- ✅ **Always** dùng `async/await` thay vì `.then()/.catch()`
- ✅ **Always** wrap async code trong `try/catch`
- ✅ **Always** handle loading states
- ❌ **Never** unhandled promise rejections

```typescript
// ✅ GOOD
const handleSubmit = async (data: FormData) => {
  try {
    setLoading(true);
    await authService.login(data);
  } catch (error) {
    handleApiError(error);
  } finally {
    setLoading(false);
  }
};

// ❌ BAD
const handleSubmit = (data: FormData) => {
  authService
    .login(data)
    .then(() => {})
    .catch(() => {}); // No finally, unclear loading state
};
```

### Comment & Documentation Style

- **JSDoc** cho public functions/classes
- **Inline comments** cho complex logic
- **NO** redundant comments (code nên self-explanatory)

```typescript
/**
 * Handle API error - Extract message, log, and return enhanced error
 * @param error - The error object from API call
 * @returns Enhanced error object with standardized structure
 */
export function handleApiError(error: any): Error & ApiError {
  // Implementation
}

// ✅ Complex logic cần comment
// Wait with exponential backoff before retrying
const delayMs = getBackoffDelay(attempt, config?.retryDelay ?? 1000);

// ❌ Redundant comment
// Set loading to true
setLoading(true);
```

---

## 3️⃣ Best Practices

### Business Logic Location

- **Services** (`src/Services/`): API calls, external integrations
- **Hooks** (`src/Hooks/`): Reusable business logic, data fetching
- **Utils** (`src/Utils/`): Pure functions, helpers, formatters
- **Contexts** (`src/Contexts/`): Global state management
- **Screens**: Orchestration only - compose hooks, components, handle navigation

```typescript
// ✅ GOOD - Business logic trong hook
// src/Hooks/auth/useLogin.ts
export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await authService.login(data);
      return response;
    },
  });
};

// ✅ Screen chỉ orchestrate
// src/Screens/Auth/LoginScreen.tsx
const LoginScreen = () => {
  const { mutate: login, isPending } = useLogin();
  const handleSubmit = (data: LoginForm) => {
    login(data);
  };
  return <LoginForm onSubmit={handleSubmit} loading={isPending} />;
};

// ❌ BAD - Business logic trong screen
const LoginScreen = () => {
  const handleLogin = async (data) => {
    try {
      const response = await axios.post("/login", data); // Direct API call
      await AsyncStorage.setItem("token", response.token); // Storage logic
      // ...
    } catch (error) {
      // ...
    }
  };
};
```

### Input Validation

- **Always** validate user input với Yup hoặc Zod
- **Schema** đặt trong `src/Schemas/`
- **Integrate** với React Hook Form

```typescript
// src/Schemas/authSchemas.ts
export const loginSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(8, "Password must be at least 8 characters").required(),
});

// Usage in component
const { control, handleSubmit } = useForm({
  resolver: yupResolver(loginSchema),
});
```

### Error Handling Standard

- **Centralized**: Dùng `handleApiError` utility
- **User-friendly**: Show toast messages
- **Structured**: Return typed error objects

```typescript
// src/Utils/errorHandlerUtils.ts
export function handleApiError(error: any): Error & ApiError {
  const message = extractErrorMessage(error);
  const status = error.response?.status;

  if (__DEV__) {
    console.log(`🚨 API Error [${status}]:`, message);
  }

  const errorDetail = new Error(message) as Error & ApiError;
  errorDetail.status = status;
  errorDetail.code = error.response?.data?.code;

  return errorDetail;
}

// Usage trong hooks
export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      try {
        return await authService.login(data);
      } catch (error) {
        throw handleApiError(error); // Centralized error handling
      }
    },
  });
};
```

### Component Guidelines

- **Tách component khi**:
  - Có khả năng tái sử dụng ở nhiều nơi
  - File quá lớn (>300 lines) - tách thành các component nhỏ hơn
  - Logic phức tạp cần isolate
- **Component structure**:
  - Props interface luôn ở đầu file
  - Logic hooks trước JSX
  - Helper functions có thể đặt outside component nếu không depend vào props/state

```typescript
// ✅ GOOD - Reusable component
// src/Components/UserAvatar/UserAvatar.tsx
interface UserAvatarProps {
  userId: string;
  size?: "sm" | "md" | "lg";
  showBadge?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ userId, size = "md", showBadge }) => {
  // Implementation
};

// ✅ GOOD - Tách component khi file quá lớn
// Before: BookingScreen.tsx (500 lines)
// After:
//   - BookingScreen.tsx (orchestration)
//   - SeatSelector.tsx (seat selection logic)
//   - PaymentSummary.tsx (payment display)
```

### Performance Guidelines

- **Memoization**: Dùng `useMemo`, `useCallback` cho expensive calculations
- **Lists**: Always có `keyExtractor` unique cho FlatList
- **Images**: Dùng optimized images, consider lazy loading
- **Navigation**: Avoid nested navigators nếu có thể
- **Bundle size**: Check import statements, tree-shaking
- **Re-renders**: Avoid unnecessary re-renders bằng cách memo components khi cần

### Security Minimum

- ✅ Store sensitive data trong `AsyncStorage`
- ✅ Validate all inputs trước khi gửi API
- ✅ Use HTTPS cho tất cả API calls
- ❌ **NEVER** log sensitive data (tokens, passwords) ngay cả trong `__DEV__`
- ❌ **NEVER** hardcode secrets trong code

```typescript
// ✅ GOOD - Mask sensitive data in dev logs
if (__DEV__ && !config.url?.includes("/auth/")) {
  console.log(`🚀 [API Request]`, { params: config.params });
}

// ❌ BAD - Logging password
console.log("Login data:", { email, password }); // NEVER DO THIS
```

### Test Requirements

- **No testing required** - Focus on code quality and manual testing
- **Optional**: Viết test nếu muốn đảm bảo critical business logic

---

## 4️⃣ Điều CẤM

### ❌ Không tạo logic sai layer

```typescript
// ❌ BAD - API call trong Component
const LoginScreen = () => {
  const handleLogin = async () => {
    const response = await axios.post("/api/login", data);
  };
};

// ✅ GOOD - API call trong Service, wrapped trong Hook
// Service layer
export const login = async (data: LoginRequest) => {
  return httpService.post(endpoints.AUTH.LOGIN, data);
};

// Hook layer
export const useLogin = () => useMutation({ mutationFn: login });

// Component layer
const LoginScreen = () => {
  const { mutate: login } = useLogin();
};
```

### ❌ Không tự nghĩ API/Logic nếu không có

- **ALWAYS** check API documentation/Postman trước
- **ALWAYS** check existing services/hooks trước khi tạo mới
- **ASK** nếu không rõ endpoint structure
- **NO MOCKING**: Không tạo mock data cho development (chờ API thật)

### ❌ Không dùng thư viện lạ

- **CHECK** `package.json` trước khi suggest thư viện mới
- **PREFER** thư viện đã có trong project
- **ASK** nếu cần add dependency mới

**Thư viện đã có:**

- State: React Query, Context API
- Form: React Hook Form
- Validation: Yup, Zod
- HTTP: Axios (via httpService)
- Navigation: React Navigation
- Icons: react-native-vector-icons
- Toast: react-native-toast-message

### ❌ Không console.log trong production

```typescript
// ✅ GOOD - Conditional logging
if (__DEV__) {
  console.log("Debug info:", data);
}

// ❌ BAD - Always logs
console.log("Debug info:", data);
```

### ❌ Không để code thừa

- Remove unused imports
- Remove commented code
- Remove unused variables/functions
- No dead code paths

---

## 5️⃣ Quy trình Dev

### Commit Format

**CRITICAL**: Trước khi commit hoặc hoàn thành 1 phần công việc, **LUÔN LUÔN** chạy:

```bash
pnpm format
```

Format commit tự do, nhưng nên rõ ràng và có ý nghĩa:

```
✅ GOOD examples:
- "Add login screen with form validation"
- "Fix seat selection bug in booking flow"
- "Refactor auth service to use new endpoints"
- "Update profile screen UI"

❌ BAD examples:
- "Update"
- "Fix bug"
- "WIP"
```

### Code Quality Checklist (Trước khi commit)

- [ ] **Chạy `pnpm format`** - Format code với Prettier
- [ ] **Chạy `pnpm lint`** - Kiểm tra ESLint errors
- [ ] **Chạy `pnpm type-check`** - Kiểm tra TypeScript errors
- [ ] Xóa các `console.log` không cần thiết
- [ ] Xóa imports không dùng
- [ ] Xóa code đã comment (nếu không cần)
- [ ] Test thử trên simulator/device

### PR Rules

- **No strict PR review process** - Self-review carefully
- Đảm bảo code chạy được trên cả iOS và Android
- Merge khi tự tin về code quality

### Local Storage Guidelines

Khi làm việc với `AsyncStorage`:

- **Key naming**: Dùng prefix `@gocinema:`
  ```typescript
  const KEYS = {
    AUTH_TOKEN: "@gocinema:auth_token",
    USER_INFO: "@gocinema:user_info",
    THEME: "@gocinema:theme",
  };
  ```
- **Data structure changes**: Xử lý backward compatibility
  ```typescript
  // ✅ GOOD - Handle old data format
  const userData = await AsyncStorage.getItem(KEYS.USER_INFO);
  if (userData) {
    const parsed = JSON.parse(userData);
    // Check if old format and migrate
    if (!parsed.version || parsed.version < 2) {
      // Migrate to new format
    }
  }
  ```

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
10. **Component rules**: Tách ra khi reusable hoặc file quá lớn (>300 lines)

---

## 📋 Quick Commands Reference

```bash
# Development
pnpm start              # Start Metro bundler
pnpm android:dev        # Run Android with dev env
pnpm ios:dev           # Run iOS with dev env

# Code Quality (RUN BEFORE COMMIT!)
pnpm format            # Format code - ALWAYS RUN BEFORE COMMIT
pnpm lint              # Check linting
pnpm lint:fix          # Fix linting issues
pnpm type-check        # Check TypeScript errors

# Clean & Reset
pnpm clean             # Nuclear option - reset everything
```

---

**Generated for**: GoCinema Mobile App  
**Repository**: movie-ticket-booking-fe-mobile-user  
**Last updated**: November 1, 2025
