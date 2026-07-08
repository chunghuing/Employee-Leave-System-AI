# Sprint 1 GitHub Issues

本文件依據 `docs/PRD v1.1.md` 與 `docs/Architecture.md`，為 Sprint 1 拆解出可直接建立為 GitHub Issue 的任務清單。尚未實際建立於 GitHub，僅為草稿。

本版將原先 14 個細項任務，依職責合併為 6 個 Issue，每個 Issue 對應一個較大的交付職責，內部驗收標準保留原有細項的檢查點。

## Sprint 1 目標 ( Sprint Goal )

1. 依 `docs/Architecture.md` 建立專案基礎架構（資料夾結構、路由、Store、API 層、MSW、版面骨架、共用 UI 元件）。
2. 端到端完成 US-001（使用者登入），作為其他使用者故事（US-002～US-008 皆依賴 US-001）的解鎖前提。

不含於 Sprint 1：US-002～US-008 的實際頁面功能開發，待 Sprint 2 起依角色逐步展開。

## 標籤說明 ( Label Legend )

| 標籤 | 用途 |
|---|---|
| `type:chore` | 專案基礎建設、工具設定，非使用者可見功能 |
| `type:feature` | 對應 PRD 使用者故事的功能開發 |
| `area:foundation` | 資料夾結構、共用型別/常數等基礎骨架 |
| `area:router` | 路由與權限守衛 |
| `area:store` | Pinia 狀態管理 |
| `area:api` | Axios / Service / MSW Mock API |
| `area:layout` | 版面外殼 |
| `area:ui` | 頁面與共用 UI |
| `area:auth` | 登入與身分驗證相關 |
| `sprint-1` | 本次 Sprint 範圍 |

## Issue 總覽 ( Overview )

| # | 標題 | 優先權 | 預計時間 |
|---|---|---|---|
| 1 | Project Foundation | 高 | 2h |
| 2 | Application Architecture | 高 | 12h |
| 3 | API Layer | 高 | 5h |
| 4 | Authentication | 高 | 7h |
| 5 | Login Page | 高 | 3h |
| 6 | Integration | 高 | 2h |

---

## Issue 1：Project Foundation

### 描述

建立專案最基礎的開發環境：清除 Vite 預設樣板，依 `docs/Architecture.md` 建立 `src/` 資料夾骨架，並建立 ESLint / Prettier 設定，作為後續所有開發的品質門檻。

### 驗收標準

- 移除 `HelloWorld.vue` 及未使用的 Vite 預設樣板資源，`App.vue` 清空為最小可運作內容。
- 資料夾結構（`router/`、`stores/`、`services/`、`features/`、`components/`、`composables/`、`layouts/`、`types/`、`utils/`、`constants/`、`mocks/`、`styles/`、`assets/`）與 `docs/Architecture.md` 第 1 節一致，各資料夾至少有一個佔位檔案。
- 新增 ESLint 設定檔，規則涵蓋 Vue 3 + TypeScript；新增 Prettier 設定檔，且與 ESLint 規則不衝突。
- Lint 指令可於本機成功執行且無錯誤；`npm run dev` 可正常啟動且無因結構變更產生的路徑錯誤。

### 標籤

`type:chore`、`area:foundation`、`sprint-1`

### 優先權

高

### 預計時間

2 小時

---

## Issue 2：Application Architecture

### 描述

建立應用層級的骨架：共用型別與常數、路由與角色權限守衛、版面外殼（AuthLayout / DefaultLayout）、共用 UI 元件基礎集合，對應 `docs/Architecture.md` 第 3、6、7、9 節與 PRD 的角色/假別概念。

### 驗收標準

**Types / Constants**

- `types/` 涵蓋 `User`、`UserRole`、`LeaveType`、`LeaveStatus`、`LeaveRequest`；`constants/` 提供對應常數（角色、假別狀態、路由名稱），避免字串硬編碼。

**Router**

- 路由具備 `requiresAuth`、`roles`、`layout` 等 meta 欄位，並依角色拆分路由檔案（`auth`／`employee`／`manager`／`hr`）。
- 全域 `beforeEach` 守衛邏輯就緒（實際登入狀態依賴 Issue 4 完成後生效）；路由名稱統一使用常數，無硬編碼字串。

**Layout**

- `AuthLayout` 提供置中卡片版面容器；`DefaultLayout` 提供頂部列與側邊導覽選單容器。
- 版面可依路由 `meta.layout` 動態切換，於小螢幕寬度下不出現版面破版。

**Shared Components**

- 建立跨角色共用的基礎 UI 元件：`BaseTable`、`BasePagination`、`LeaveStatusTag`、`ConfirmDialog`、`EmptyState`、`PageHeader`，包裝 Element Plus 對應元件。
- 每個元件皆有明確定義的 Props／Emits 型別，元件內不出現任何 Store 或 Service 的直接引用。
- 元件可在暫時的測試路由中正常渲染驗證，驗證後可移除測試用途頁面。

### 標籤

`type:chore`、`area:foundation`、`area:router`、`area:layout`、`area:ui`、`sprint-1`

### 優先權

高

### 預計時間

12 小時

---

## Issue 3：API Layer

### 描述

建立 API 存取的基礎設施：Axios 實例與攔截器、MSW Mock API 環境，作為後續所有 Service 與 Mock Handler 的共用基礎，對應 `docs/Architecture.md` 第 5 節。

### 驗收標準

- `services/http.ts` 匯出單一 Axios 實例，設定 baseURL、逾時；請求攔截器附加 Token，回應攔截器統一錯誤格式。
- 安裝並設定 MSW，`mocks/browser.ts` 可於開發模式啟動 Service Worker 並於 `main.ts` 啟用。
- 提供空的 handlers 陣列匯出，供後續各領域 handlers（見 Issue 4）合併掛載。
- 開發模式下瀏覽器 Console 可見 MSW 啟動成功訊息。

### 標籤

`type:chore`、`area:api`、`sprint-1`

### 優先權

高

### 預計時間

5 小時

---

## Issue 4：Authentication

### 描述

建立登入功能所需的資料與邏輯層：Mock API Handler 與種子資料、`authService`、`auth Store`、`useAuth` / `usePermission` composables，對應 `docs/Architecture.md` 第 4、8 節與 PRD US-001。

### 驗收標準

- 種子資料涵蓋三種角色（Employee／Manager／HR），各至少一筆測試帳號；登入 Handler 對正確帳密回傳使用者資訊與模擬 Token，對錯誤帳密回傳對應錯誤訊息。
- `authService` 匯出 `login` 函式，透過 Issue 3 的 Axios 實例呼叫 Mock 登入端點，不含狀態管理或 UI 邏輯。
- `auth Store` 提供 `login`、`logout`、`restoreSession` actions，以及使用者、角色、登入狀態的 getters；僅透過 `authService` 存取資料，不直接呼叫 Axios。
- `useAuth` 包裝 `auth Store` 供元件直接使用；`usePermission` 可依角色回傳權限判斷結果；兩者皆有對應單元測試，覆蓋登入/未登入與各角色情境。

### 標籤

`type:feature`、`area:api`、`area:store`、`area:auth`、`sprint-1`

### 優先權

高

### 預計時間

7 小時

---

## Issue 5：Login Page

### 描述

實作登入頁面 UI，套用 Issue 2 的 `AuthLayout`，串接 Issue 4 的 `useAuth`，完成 US-001 的完整登入流程。

### 驗收標準

- 使用者可輸入帳號與密碼並送出；表單於送出前進行必填欄位驗證。
- 使用正確憑證登入成功後，畫面狀態就緒可導向對應角色首頁（實際導向邏輯由 Issue 6 完成）。
- 憑證錯誤時顯示錯誤訊息，不導向其他頁面。
- 對應 PRD US-001 全部驗收標準。

### 標籤

`type:feature`、`area:ui`、`area:auth`、`sprint-1`

### 優先權

高

### 預計時間

3 小時

---

## Issue 6：Integration

### 描述

將 Issue 2 的路由守衛與 Issue 4 的 `auth Store` 實際串接，完成登入導向、角色導向與登入狀態還原的完整邏輯，作為 Sprint 1 最終整合驗收項目。

### 驗收標準

- 未登入使用者存取需登入頁面時，正確導向登入頁。
- 登入成功後，依角色（Employee／Manager／HR）導向對應首頁路由。
- 已登入使用者以不符角色的路徑存取時，正確導向無權限頁或首頁，不會顯示不屬於該角色的頁面。
- 重新整理頁面後，登入狀態可正確還原（依賴 Issue 4 的 `restoreSession`），不會被誤判為未登入。

### 標籤

`type:feature`、`area:router`、`area:auth`、`sprint-1`

### 優先權

高

### 預計時間

2 小時

---

## Sprint 1 總預估時間 ( Total Estimate )

2h + 12h + 5h + 7h + 3h + 2h = 31 小時
