# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概述

員工請假系統 (Employee Leave System) — 作品集演示專案（Portfolio Demo），模擬企業內部的請假申請／審核流程，涵蓋 Employee／Manager／HR 三種角色。沒有真實後端，所有資料皆來自 MSW（Mock Service Worker）模擬的 API。產品需求見 `docs/PRD v1.1.md`；前端架構的權威設計文件是 `docs/Architecture.md`（資料夾結構、分層規則、命名規範——進行任何結構性改動前務必先讀這份文件）。

## 常用指令

```bash
npm run dev            # 啟動開發伺服器（Vite，DEV 模式下自動啟用 MSW mock）
npm run build           # vue-tsc 型別檢查（project references）+ vite build
npm run preview          # 預覽建置後的成果
npm run lint             # eslint . --max-warnings 0（必須零警告通過）
npm run lint:fix          # eslint --fix
npm run format            # prettier --write .
npm run format:check       # prettier --check .
npm run test              # vitest run（單次執行，用於 CI／驗證）
npm run test:watch         # vitest（互動式 watch 模式）
```

執行單一測試檔案：`npx vitest run src/composables/useAuth.spec.ts`

目前沒有另外封裝「跑單一檔案」的指令，直接把路徑／pattern 傳給 vitest 即可。

## 架構

### 分層（嚴格單向）

```text
features/*  →  stores/*  →  services/*  →  Axios (services/http.ts)  →  MSW 攔截 → 回傳 mock 資料
```

- `features/*` 頁面只能呼叫 Store，不可跳過 Store 直接呼叫 Service 或 Axios；Store 呼叫 Service，Service 呼叫共用的 Axios 實例。除了 `services/*` 之外，沒有其他地方能直接呼叫 Axios。即使某個查詢很單純（例如唯讀的下拉選單資料），也要補一個對應的最小 Store（狀態 + fetch action）讓頁面透過它取得資料，而不是讓頁面直接 import Service——參考 `stores/leaveType.store.ts`。
- `components/`（共用 UI）絕不引用 Store 或 Service——資料一律透過 props 傳入。
- Store 之間不互相呼叫；跨領域的資料組合交由 composable 或呼叫端元件處理。
- `features/*` 依角色垂直切分（`auth/`、`employee/`、`manager/`、`hr/`），彼此不互相 import。

### 路由

- 路由表依角色拆檔於 `router/routes/` 下（`auth.routes.ts`、`employee.routes.ts`、`manager.routes.ts`、`hr.routes.ts`），再於 `router/index.ts` 合併註冊。
- 每個路由的 `meta` 都帶有 `requiresAuth: boolean`、`roles?: UserRole[]`、`layout: 'auth' | 'default'`（型別透過 `router/types.ts` 的 module augmentation 定義）。
- `router/guards.ts` 只有一個全域 `beforeEach`：未登入使用者存取 `requiresAuth` 路由時導向登入頁；已登入使用者存取登入頁時導向自己角色的首頁；角色不符時導向使用者自己角色的首頁（MVP 範圍刻意不做獨立的「無權限頁」）。
- `constants/roleHomeRoutes.ts`（`ROLE_HOME_ROUTES`）將每個 `UserRole` 對應到其首頁路由名稱——這是「登入後該去哪」的唯一真實來源。
- 路由名稱一律使用 `constants/routeNames.ts`（`ROUTE_NAMES`）——絕不硬編碼路由名稱字串。
- `App.vue` 依 `route.meta.layout` 決定套用 `AuthLayout` 還是 `DefaultLayout`。

### Session 還原的啟動順序（重要限制）

在 `main.ts` 中，`useAuthStore(pinia).restoreSession()` **必須**在 `app.use(pinia)` 之後、`app.use(router)` 之前呼叫。Vue Router 一安裝就會開始解析初次導航（並執行 `beforeEach`），所以如果 session 還原放在 `app.use(router)` 之後才做，第一次的 guard 檢查可能會跟空的 auth store 產生 race condition，把原本已登入的使用者誤導向 `/login`。`restoreSession()` 本身是同步的（只讀 `localStorage`），所以只要呼叫順序正確即可，不需要額外 await。

### 登入狀態

- `stores/auth.store.ts` 是 Pinia 的 setup-store（`currentUser`、`token`、`role` getter、`isAuthenticated` getter、`login`/`logout`/`restoreSession` actions）。會把 `token` 與 `user` 的 JSON 寫入 `localStorage`（key 定義在 `constants/storageKeys.ts` 的 `STORAGE_KEYS.AUTH_TOKEN`／`AUTH_USER`），讓整頁重新整理後可以還原登入狀態，不需要重打一次 mock 登入端點。
- `composables/useAuth.ts` 透過 `storeToRefs` 包裝該 store 供元件使用；`composables/usePermission.ts` 在此基礎上衍生出 `isEmployee`/`isManager`/`isHr`/`hasRole(...)`。元件內請優先使用這兩個 composable，不要直接呼叫 `useAuthStore()`。

### Mock API（MSW）

- `services/http.ts` 匯出唯一的 Axios 實例（`baseURL: '/api'`），所有 Service 都必須透過它。請求攔截器會從 `localStorage` 附加 bearer token；回應攔截器會把任何失敗統一轉成 `ApiError`（`types/apiError.ts`，繼承 `Error`——用 `new ApiError(message, status)` 拋出，而非普通物件，因為 `@typescript-eslint/prefer-promise-reject-errors` 要求必須是真正的 `Error`）。
- `mocks/handlers/index.ts` 是合併點——每個領域的 handlers 檔（例如 `auth.handlers.ts`）都會被展開進匯出的 `handlers` 陣列。`mocks/browser.ts` 再把這個陣列接進 `setupWorker`。
- MSW 只會在 `import.meta.env.DEV` 時啟動（見 `main.ts` 裡的 `enableMocking()` 判斷），且會在 `app.mount()` 之前完成 await，確保啟動階段的任何請求都能被攔截到。
- `public/mockServiceWorker.js` 是用 `npx msw init public --save` 產生的——絕不手動修改，且已被排除在 ESLint 與 Prettier 檢查之外。
- 種子資料放在 `mocks/data/`（例如 `users.ts`、`leaveTypes.ts`、`leaveBalances.ts`、`leaveRequests.ts`）。本機測試帳號（密碼皆為 `password123`）：`employee@example.com`、`manager@example.com`、`hr@example.com`。
- 種子資料陣列（`MOCK_` 開頭的 `const`）在需要「新增」語意的 handler（如建立請假申請）中會被直接 `push`——陣列繫結是 `const` 但內容可變，重新整理頁面即重新初始化模組狀態，天然重置為種子資料，不需要額外的重置邏輯。
- Mock token 格式為 `` `mock-token-${userId}-${Date.now()}` ``（見 `auth.handlers.ts`）。由於 `userId` 本身含連字號（例如 `u-001`），handler 內要從 `Authorization` header 反查目前使用者時，不能用 `split('-')`，必須改用 `MOCK_USERS.find(user => token.startsWith(\`mock-token-${user.id}-\`))` 這種前綴比對（見 `leave.handlers.ts` 的 `resolveCurrentUser`）。

### 設計系統

- 視覺設計文件與 Pencil 原始檔在 `docs/design/`（`design-system.md` 記錄色彩／字體 token、簽名視覺與各頁面設計重點；`employee-leave-system.pen` 用 Pencil App 開啟）。進行任何視覺／樣式改動前先讀這份文件，避免顏色或字體選用偏離既有系統。
- `src/styles/tokens.css`（由 `src/styles/main.css` `@import`）定義色彩／字體／圓角／間距的 CSS 變數，並覆蓋 Element Plus 的 `--el-color-primary`／`--el-color-success`／`--el-color-warning`／`--el-color-danger` 等變數——因此 `el-tag`／`el-button` 等元件會自動套用新色票，不需要在個別元件裡覆寫顏色。標題字體是 Noto Serif TC（`--font-display`，用於頁面標題、Hero 數字），內文與介面文字是 Noto Sans TC（`--font-body`）；字型透過 `index.html` 的 Google Fonts `<link>` 載入。
- `src/components/LeaveRing.vue` 是整套設計的簽名視覺元件（SVG 環形進度條，props：`remaining`／`total`／`unitLabel`／`size`／`variant: 'dark' | 'light'`），出現在登入頁品牌面板、剩餘假期 Hero 卡、申請請假側邊卡等處。純 UI 元件，不呼叫 Store／Service，符合 `components/` 的規則。
- 響應式斷點統一為 768px。`DefaultLayout.vue` 在 <768px 時側邊欄不是收合成圖示列，而是變成 **off-canvas 抽屜**：預設隱藏、頂欄漢堡選單（`Fold` icon）觸發滑出，滑出時疊加半透明遮罩，點擊遮罩或任一導覽項目會自動收合（見 `isDrawerOpen`／`closeDrawer`）。含表格的頁面（請假紀錄、待審核、HR 總覽）在同一支 `.vue` 內同時渲染桌面表格與手機卡片列表兩份 DOM，用 `@media (max-width: 767px)` 切換 `display`，而非用 JS 條件渲染——避免 resize 時的版面抖動。
- `features/manager/*` 與 `features/hr/*`（US-005～US-008）尚未排入 Sprint，沒有對應的 Store／Service／MSW handler；但這三個頁面已套用完整視覺設計，內部用元件本地的靜態陣列（例如 `ApprovalListView.vue` 的 `PENDING_REQUESTS`）取代真實資料，操作按鈕（核准／拒絕、新增／編輯／刪除假別）點擊後呼叫 `ElMessage.info(...)` 提示「尚未串接」，而不是真的執行動作。等對應 Sprint 排入時，把這些本地陣列替換成真正的 Store／Service 串接即可，版面與樣式不需要重做。

### 命名規範（完整表格見 `docs/Architecture.md` 第 9 節）

- 元件：PascalCase。Composable：camelCase，`use` 開頭。Store：檔名 `*.store.ts`，匯出 `useXStore`。Service：`*Service.ts`。型別／介面：PascalCase。常數：`UPPER_SNAKE_CASE`。MSW handler 檔：`*.handlers.ts`。`features/*` 子資料夾：kebab-case。
- Barrel 檔（`types/index.ts`、`constants/index.ts`）會重新匯出資料夾內所有內容——新增型別／常數時記得也要加進去。

### 測試

- Vitest + jsdom（因為 `auth.store` 會操作 `localStorage`，純 Node 環境沒有這個全域物件，所以需要 jsdom）。設定寫在 `vite.config.ts` 的 `test` 區塊，沒有另外獨立的 vitest 設定檔。
- 測試檔與被測程式碼並列同一資料夾（`*.spec.ts`），不另外放到獨立的 `__tests__/` 目錄。
- 測試一律從 `vitest` 明確 import `describe`/`it`/`expect` 等（沒有注入全域變數）——凡是會碰到 Store 的測試，記得在 `beforeEach` 裡 `setActivePinia(createPinia())`；若測試路徑會碰到持久化的登入狀態，也要 `localStorage.clear()`。

### 編碼規範（見 `docs/Architecture.md` 第 10 節）

- 一律使用 Composition API + `<script setup lang="ts">`——不使用 Options API。
- TypeScript 嚴格模式，禁止 `any`；ESLint 使用 `@vue/eslint-config-typescript` 的 `recommendedTypeChecked`（型別感知 lint），所以新檔案必須落在 `tsconfig.app.json` 的 `include` glob 範圍內，否則 lint 會報錯。
- Props／Emits 一律用 `defineProps`／`defineEmits` 的泛型寫法，不使用執行期宣告的寫法。
- 不要為目前 Sprint 尚未排入的需求（多層簽核、稽核日誌等）預先設計抽象層——嚴格依照當下 Issue 的驗收標準實作，不做超出範圍的擴充。

## 目前實作狀態

- Sprint 1（`docs/Sprint-1-Issues.md` 全部 6 個 Issue）已完成：專案基礎建設、資料夾架構、API 層、身分驗證（mock 登入 + session 還原）、登入頁、以及完整的路由／Store 整合。
- Sprint 2（`docs/Sprint-2-Issues.md` 全部 6 個 Issue）已完成：US-002～US-004（剩餘假期、申請請假、請假紀錄）的完整垂直切片，涵蓋型別與種子資料、Mock API（`leave-types`／`leave-balances`／`leave-requests`）、Service／Store 層（`leaveTypeService`、`leaveService`、`leaveBalance.store`、`leaveRequest.store`、`leaveType.store`），以及 `features/employee/*` 三個頁面的完整 UI 實作（`leave-balance`、`leave-request`、`leave-history`）。
- `features/manager/*`（US-005～US-006，審核流程）與 `features/hr/*`（US-007～US-008，請假紀錄總覽、假別管理）功能本身尚未排入已完成的 Sprint，沒有 Store／Service／MSW handler。
- 全站視覺重新設計已完成：建立獨立設計系統（`docs/design/`、`src/styles/tokens.css`、`src/components/LeaveRing.vue`），`DefaultLayout`／`AuthLayout` 與全部 7 個頁面（含尚未排入 Sprint 的 Manager／HR 三頁）皆已套用新版面，並提供桌面版與 768px 斷點下的響應式版面（含側邊欄 off-canvas 抽屜、表格轉卡片列表）。Manager／HR 頁面目前是套用真實樣式的靜態視覺稿（本地假資料＋操作按鈕提示「尚未串接」），不是單純的文字 placeholder。
