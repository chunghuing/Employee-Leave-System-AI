# 前端架構設計文件 ( Frontend Architecture )

## 概述 ( Overview )

本文件依據 `docs/PRD v1.1.md` 與 `package.json` 現況，為「員工請假系統（Employee Leave System）」設計前端架構。

專案定位：作品集演示（Portfolio Demo），無真實後端，資料來源為 Mock API（MSW）。

技術棧（依 `package.json` 現況）：

- Vue 3（3.5）
- Vite（8）
- TypeScript（6）
- Pinia（3）
- Vue Router（5）
- Element Plus（2）
- Axios（HTTP Client）
- ESLint + Prettier（程式碼品質與格式化）

設計目標對齊 PRD：簡潔架構、以功能（角色/業務領域）為主的資料夾結構、易維護、易單元測試、對 AI 輔助開發友善（檔案職責單一、路徑可預期、命名一致）。

---

## 1. 資料夾結構 ( Folder Structure )

採用「以角色/業務領域為主、型別為輔」的功能導向切分（Feature-based），對應 PRD 的三種角色（Employee／Manager／HR）與 US-001～US-008。

```text
src/
├── main.ts                     # 應用進入點：建立 App、掛載 Pinia / Router / Element Plus
├── App.vue                     # 根元件
├── router/                     # 路由定義、角色權限守衛、路由 meta 常數
│   ├── index.ts
│   ├── guards.ts
│   └── routes/
│       ├── employee.routes.ts
│       ├── manager.routes.ts
│       ├── hr.routes.ts
│       └── auth.routes.ts
├── stores/                     # Pinia，依業務領域劃分
│   ├── auth.store.ts
│   ├── leaveBalance.store.ts
│   ├── leaveRequest.store.ts
│   ├── approval.store.ts
│   └── leaveType.store.ts
├── services/                   # API 存取層（封裝 Axios），依領域拆分
│   ├── http.ts                 # Axios 實例與攔截器
│   ├── authService.ts
│   ├── leaveService.ts
│   ├── approvalService.ts
│   └── leaveTypeService.ts
├── features/                   # 依角色垂直切分的功能模組（US-001～US-008 對應處）
│   ├── auth/                   # US-001 登入
│   │   ├── views/
│   │   └── components/
│   ├── employee/
│   │   ├── leave-balance/      # US-002 查看剩餘假期
│   │   ├── leave-request/      # US-003 提交請假申請
│   │   └── leave-history/      # US-004 查看請假紀錄
│   ├── manager/
│   │   └── approval/           # US-005 查看待審核、US-006 核准或駁回
│   └── hr/
│       ├── leave-records/      # US-007 查看所有請假資料
│       └── leave-types/        # US-008 管理假別
├── components/                 # 共用、無業務邏輯的 UI 元件（Element Plus 封裝層）
├── composables/                # 可複用邏輯
├── layouts/                    # 版面外殼（依角色或單一版面 + 導覽設定）
├── types/                      # 共用型別/列舉：LeaveType、LeaveStatus、Role、User
├── utils/                      # 日期計算、格式化、驗證邏輯
├── constants/                  # 狀態列舉、角色列舉、路由名稱常數
├── mocks/                      # MSW：handlers、seed data、瀏覽器啟動設定
│   ├── browser.ts
│   ├── data/
│   └── handlers/
│       ├── auth.handlers.ts
│       ├── leave.handlers.ts
│       └── leaveType.handlers.ts
├── styles/                     # 全域樣式、Element Plus 主題變數覆寫
└── assets/                     # 靜態資源
```

**設計原則：**

- `features/` 依角色分群，對應 PRD 的 Employee／Manager／HR 三種目標用戶，避免功能持續分化後塞進單一 `views/` 資料夾。
- `services/` 與 `mocks/` 分離：元件與 Store 只依賴 `services/`，`services/` 內部呼叫 Axios，實際資料由 MSW 於網路層攔截並回傳，未來若要串接真實後端，只需調整 MSW 啟用開關與 Base URL，不需改動元件或 Store。
- 不設立 RBAC 專用的 `directives/`（如 `v-permission`）：MVP 範圍僅三種角色、無多級審批，直接以路由 meta + 導覽守衛 + `usePermission` composable 判斷即足夠，避免過度設計。

---

## 2. 模組職責 ( Module Responsibilities )

| 模組 | 職責 | 不負責 |
|---|---|---|
| `main.ts` / `App.vue` | 應用程式進入點、掛載全域 Plugin（Pinia、Router、Element Plus） | 業務邏輯 |
| `router/` | 定義路由表、路由層級的角色守衛、meta 設定 | 畫面渲染、資料請求 |
| `stores/` | 管理跨元件共享的狀態、呼叫 `services/` 取得資料、暴露 actions/getters | 直接呼叫 Axios、畫面邏輯 |
| `services/` | 封裝所有對外（Mock）API 呼叫，定義請求/回應型別 | 狀態管理、UI 邏輯 |
| `features/*` | 各角色的頁面（views）與該頁面專屬元件，組裝 Store + Composable + 共用元件 | 被其他 feature 依賴（feature 之間不互相 import） |
| `components/` | 無業務邏輯的通用 UI 元件（表格、狀態標籤、對話框等） | 直接依賴 Store 或 Service |
| `composables/` | 封裝可複用的邏輯與狀態（如權限判斷、日期區間、分頁） | 畫面渲染 |
| `layouts/` | 頁面外殼（導覽列、側邊欄、內容插槽） | 業務資料處理 |
| `types/` | 全專案共用的 TypeScript 型別與列舉 | 邏輯運算 |
| `utils/` | 純函式（日期、格式化、驗證） | 狀態、副作用 |
| `constants/` | 固定不變的常數（角色、假別狀態、路由名稱） | 邏輯運算 |
| `mocks/` | 以 MSW 模擬後端，提供 handlers 與種子資料 | 被 `features/` 或 `components/` 直接引用 |

---

## 3. 路由策略 ( Routing Strategy )

- 使用 Vue Router 的巢狀路由：最外層為 `layouts/`（`DefaultLayout`、`AuthLayout`），內層依角色掛載對應的 `features/*/views`。
- 路由依角色拆檔（`employee.routes.ts`、`manager.routes.ts`、`hr.routes.ts`、`auth.routes.ts`），於 `router/index.ts` 合併註冊，避免單一路由檔案過長。
- 所有頁面元件皆採路由層級的懶載入（動態 import），降低初始封裝體積。
- 路由 `meta` 攜帶：
  - `requiresAuth`：是否需登入。
  - `roles`：允許存取的角色（`employee` / `manager` / `hr`）。
  - `layout`：使用的版面（預設 / 無導覽）。
- `router/guards.ts` 提供全域 `beforeEach` 守衛：
  1. 檢查登入狀態（讀取 `auth.store`），未登入導向登入頁（對應 US-001）。
  2. 檢查角色是否符合 `meta.roles`，不符合則導向無權限頁或首頁。
- 路由名稱使用常數（定義於 `constants/routeNames.ts`），避免元件中出現字串硬編碼路由名稱。

---

## 4. Pinia Store 設計 ( Store Design )

依業務領域拆分，避免單一 Store 承擔過多職責：

| Store | 對應使用者故事 | 主要狀態 | 主要 Actions |
|---|---|---|---|
| `auth.store` | US-001 | 當前使用者、角色、登入狀態、Token | `login`、`logout`、`restoreSession` |
| `leaveBalance.store` | US-002 | 各假別剩餘天數 | `fetchBalance` |
| `leaveRequest.store` | US-003、US-004 | 請假申請列表、送出狀態 | `fetchMyRequests`、`submitRequest` |
| `approval.store` | US-005、US-006 | 待審核列表、審核處理狀態 | `fetchPendingApprovals`、`approve`、`reject` |
| `leaveType.store` | US-007、US-008 | 假別清單、HR 檢視的全體請假紀錄 | `fetchLeaveTypes`、`createLeaveType`、`updateLeaveType`、`deleteLeaveType`、`fetchAllRecords` |

**設計原則：**

- Store 只透過對應的 `services/*Service.ts` 取得資料，不直接呼叫 Axios 或 MSW。
- Getters 用於衍生狀態（如「依日期排序後的請假紀錄」「待審核件數」），避免元件內重複計算。
- 讀取狀態（loading／error）由各 Store 自行管理並暴露，元件依此顯示載入中或錯誤訊息，不另設全域 loading Store。
- Store 之間避免互相呼叫；若需跨領域資料（例如審核時需要請假型別名稱），由元件層組合對應的多個 Store，或由 Composable 封裝組合邏輯。

---

## 5. API 層 ( API Layer )

**分層：** `features/*`（呼叫 Store） → `stores/*`（呼叫 Service） → `services/*`（呼叫 Axios） → MSW 攔截並回傳 Mock 資料。

- `services/http.ts`：建立單一 Axios 實例，設定 baseURL、逾時、統一的請求/回應攔截器（如附加 Token、統一錯誤格式）。
- 每個領域一支 Service 檔案（`authService`、`leaveService`、`approvalService`、`leaveTypeService`），每個檔案：
  - 定義該領域的請求/回應 TypeScript 型別（或引用 `types/`）。
  - 匯出對應的非同步函式（如 `getBalance()`、`createLeaveRequest(payload)`），供 Store 呼叫。
  - 不包含任何 UI 或狀態邏輯。
- `mocks/handlers/` 依領域對應 `services/`，一個 Service 對應一組 handlers，確保請求路徑與回應結構一致。
- `mocks/data/` 存放種子資料（假別清單、假資料使用者、預設請假紀錄），供 handlers 讀取與模擬狀態變更（如核准後更新狀態）。
- 錯誤處理：Service 層統一拋出正規化後的錯誤物件，由呼叫端（Store）決定如何呈現；元件不直接處理 Axios 錯誤細節。

---

## 6. 共享組件 ( Shared Components )

`components/` 存放跨角色共用、不含業務邏輯的 UI 元件，作為 Element Plus 的封裝層：

- `BaseTable`：統一表格外觀、空狀態、載入狀態，包裝 `el-table`。
- `BasePagination`：統一分頁元件，包裝 `el-pagination`。
- `LeaveStatusTag`：依請假狀態（待審核／已核准／已駁回）顯示對應顏色標籤，包裝 `el-tag`。
- `ConfirmDialog`：共用的確認對話框（用於核准/駁回/刪除假別等動作），包裝 `el-dialog` + `el-button`。
- `EmptyState`：無資料時的共用提示畫面。
- `PageHeader`：頁面標題列（標題、操作按鈕插槽）。
- `FormField`：包裝 `el-form-item`，統一標籤寬度與驗證訊息呈現。

**設計原則：** 共享元件只負責呈現與互動事件（透過 props/emits），不呼叫 Store 或 Service；資料一律由使用它的 `features/*` 頁面傳入。

---

## 7. 佈局結構 ( Layout Structure )

- `layouts/AuthLayout.vue`：無導覽列，置中卡片版面，供登入頁使用（US-001）。
- `layouts/DefaultLayout.vue`：含頂部列（使用者資訊、登出）與側邊導覽選單，供登入後所有角色頁面使用。
  - 側邊選單項目依 `auth.store` 當前角色動態產生（Employee／Manager／HR 顯示不同選單）。
  - 版面採 Element Plus 的 `el-container` / `el-aside` / `el-header` / `el-main` 組合。
- 版面透過路由 `meta.layout` 決定套用哪一種外殼，由 `router` 或最外層 `App.vue` 依 meta 動態渲染對應 Layout。
- 響應式設計（對應 PRD 技術目標）：側邊選單在小螢幕寬度下可收合為抽屜或圖示列，統一由 `DefaultLayout` 內部處理，`features/*` 頁面不需個別處理版面響應邏輯。

---

## 8. 可組合組件 ( Composables )

`composables/` 封裝可跨頁面複用的邏輯，命名以 `use` 開頭：

- `useAuth`：包裝 `auth.store`，暴露目前使用者、角色、登入/登出方法。
- `usePermission`：依角色判斷是否可執行特定操作（如「僅 Manager 可核准」），供頁面與元件的條件渲染使用，取代分散的 `v-if="role === 'manager'"`。
- `useLeaveBalance`：組合 `leaveBalance.store`，提供已格式化的假別餘額顯示邏輯。
- `useDateRange`：處理請假起訖日選擇、天數計算（排除假日的邏輯集中於此，配合 `utils/`）。
- `usePagination`：管理表格分頁狀態（當前頁碼、每頁筆數），供 HR 請假紀錄列表、審核列表等共用。
- `useAsyncState`：統一處理非同步請求的 `loading` / `error` / `data` 狀態，減少各頁面重複樣板邏輯。

---

## 9. 命名規範 ( Naming Conventions )

| 類型 | 規則 | 範例 |
|---|---|---|
| Vue 元件檔案 | PascalCase | `LeaveStatusTag.vue`、`ApprovalListView.vue` |
| Composable 檔案/函式 | camelCase，`use` 開頭 | `useAuth.ts`、`usePermission.ts` |
| Store 檔案 | camelCase，`.store.ts` 結尾 | `leaveRequest.store.ts` |
| Store 定義函式 | camelCase，`use` 開頭、`Store` 結尾 | `useLeaveRequestStore` |
| Service 檔案 | camelCase，`Service.ts` 結尾 | `leaveService.ts` |
| 型別/介面 | PascalCase | `LeaveRequest`、`LeaveStatus`、`UserRole` |
| 常數 | UPPER_SNAKE_CASE | `ROUTE_NAMES`、`LEAVE_STATUS` |
| 路由名稱（route name） | kebab-case 或 SCREAMING 常數對應字串，統一由 `constants/routeNames.ts` 管理 | `employee-leave-request` |
| MSW handler 檔案 | camelCase，`.handlers.ts` 結尾 | `leave.handlers.ts` |
| 資料夾 | kebab-case（`features/` 下的功能子資料夾）或全小寫 | `leave-request/`、`leave-history/` |
| Props/Emits | camelCase，事件名採 kebab-case（Vue 慣例） | `leaveId`、`@submit-success` |

---

## 10. 編碼規範 ( Coding Conventions )

- 一律使用 Composition API 搭配 `<script setup lang="ts">`，不使用 Options API。
- TypeScript 開啟嚴格模式，禁止使用 `any`；對外資料（Service 回傳值）需有明確型別。
- Props 與 Emits 使用 `defineProps` / `defineEmits` 的型別泛型寫法定義，不使用執行期宣告。
- 元件只負責「組裝」：資料請求交給 Store，複用邏輯交給 Composable，元件內部盡量只保留樣板組裝與少量 UI 狀態。
- 禁止在元件內直接呼叫 Axios 或 Service；一律經由對應 Store 存取資料，確保資料流向單一、可預測。
- 每個檔案單一職責：一個 Store 對應一個業務領域、一個 Service 對應一個 Store、一個 Composable 只封裝一件事，避免巨石檔案，利於單元測試與 AI 輔助閱讀/修改。
- 單元測試檔案與被測檔案同資料夾並列（`*.spec.ts`），優先覆蓋 `stores/`、`services/`、`composables/`、`utils/` 等無 UI 相依的邏輯層。
- 全專案遵循既有的 ESLint + Prettier 設定，提交前需通過 Lint 檢查，不手動覆寫格式化結果。
- 避免為尚未發生的需求（如多級審批、審計日誌等已排除於 MVP 範圍的功能）預先設計擴充點或抽象層，維持架構與目前 PRD 範圍一致。
