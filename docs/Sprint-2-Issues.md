# Sprint 2 GitHub Issues

本文件依據 `docs/PRD v1.1.md` 與 `docs/Architecture.md`，並延續 Sprint 1 已完成的專案基礎架構與 US-001（使用者登入），為 Sprint 2 拆解出可直接建立為 GitHub Issue 的任務清單。尚未實際建立於 GitHub，僅為草稿。

## Sprint 2 目標 ( Sprint Goal )

在 Sprint 1 建立的分層架構（`features/* → stores/* → services/* → Axios → MSW`）之上，端到端完成 Employee 角色的三個核心使用者故事：

1. US-002 查看剩餘假期——員工可查看年假、病假、事假的剩餘天數。
2. US-003 提交請假申請——員工可選擇假別與起訖日期、填寫原因並送出申請。
3. US-004 查看請假紀錄——員工可查看自己所有請假申請的狀態與歷史紀錄。

Sprint 1 已完成 `features/employee/*` 底下三個頁面的路由、版面（`DefaultLayout` 側邊選單）與 placeholder 元件；Sprint 2 的工作是由資料層（Mock API）開始，依序長出 Service、Store，最後補上真正的頁面內容，取代 placeholder。

不含於 Sprint 2：

- Manager（US-005、US-006）與 HR（US-007、US-008）的任何功能開發。
- 多層簽核、審計日誌、通知系統等未在 PRD MVP 範圍內的功能。
- 假別的新增／編輯／刪除（屬於 US-008，HR 管理假別，排在後續 Sprint）。Sprint 2 的假別僅提供唯讀清單供員工申請時選擇。

## 標籤說明 ( Label Legend )

| 標籤 | 用途 |
|---|---|
| `type:chore` | 基礎資料/型別建設，非使用者可見功能 |
| `type:feature` | 對應 PRD 使用者故事的功能開發 |
| `area:foundation` | 共用型別、常數等基礎骨架 |
| `area:api` | Service / MSW Mock API |
| `area:store` | Pinia 狀態管理 |
| `area:ui` | 頁面與共用 UI |
| `area:employee` | Employee 角色功能 |
| `sprint-2` | 本次 Sprint 範圍 |

## Issue 總覽 ( Overview )

| # | 標題 | 對應 User Story | 優先權 | 預計時間 |
|---|---|---|---|---|
| 1 | Setup Leave Domain Types & Mock Data | US-002／US-003／US-004（共用基礎） | 高 | 3h |
| 2 | Mock API：假別與剩餘假期 | US-002 | 高 | 3h |
| 3 | Mock API：請假申請 | US-003／US-004 | 高 | 4h |
| 4 | Implement Leave Balance Service & Store：剩餘假期 | US-002 | 高 | 3h |
| 5 | Implement Leave Request Service & Store：請假申請與紀錄 | US-003／US-004 | 高 | 5h |
| 6 | Implement Employee Leave Features：三頁面實作與整合 | US-002／US-003／US-004 | 高 | 10h |

---

## Issue 1：Setup Leave Domain Types & Mock Seed Data

### 描述

建立請假相關領域的共用型別與種子資料，作為後續 Mock API、Service、Store、UI 的共同基礎，對應 `docs/Architecture.md` 第 1、9 節。目前 `types/leaveType.ts` 僅有 `LeaveType { id, name }`，`types/leave.ts` 已有 `LeaveRequest`／`LeaveStatus`，本 Issue 需新增「剩餘假期」的型別，並補上假別與剩餘假期的種子資料。

### 驗收標準

- 新增 `LeaveBalance` 型別（`types/leaveBalance.ts`），至少包含 `leaveTypeId`、`leaveTypeName`、`totalDays`、`remainingDays`，並於 `types/index.ts` barrel 匯出。
- `mocks/data/` 新增假別種子資料，至少涵蓋年假、病假、事假三種假別（對應 US-002 驗收標準）。
- `mocks/data/` 新增剩餘假期種子資料，對應 Sprint 1 建立的三個測試帳號（`employee@example.com` 等），每個員工帳號皆有三種假別的剩餘天數。
- `mocks/data/` 新增請假申請種子資料（`LeaveRequest[]`），至少包含員工帳號下不同狀態（待審核／已核准／已駁回）的歷史紀錄各一筆，供 US-004 顯示與排序驗證使用。
- 種子資料維持記憶體陣列即可（供 Issue 3 的 handlers 讀取與模擬新增/查詢），不需額外持久化機制。

### 標籤

`type:chore`、`area:foundation`、`sprint-2`

### 優先權

高

### 預計時間

3 小時

---

## Issue 2：Implement Leave Mock APIs：假別與剩餘假期

### 描述

依 Issue 1 的型別與種子資料，建立 US-002 所需的 MSW Handler，對應 `docs/Architecture.md` 第 5 節。這兩支 API 也會被 Issue 3（請假申請表單的假別下拉選單）共用。

### 驗收標準

- 新增 `mocks/handlers/leaveType.handlers.ts`：`GET /api/leave-types` 回傳所有假別清單（唯讀，不含新增/編輯/刪除，屬 US-008 範圍）。
- 新增 `mocks/handlers/leave.handlers.ts`（或併入同檔）：`GET /api/leave-balances` 依請求帶入的 Token 解析出目前登入使用者，回傳該使用者三種假別的剩餘天數。
- 未登入或找不到對應使用者時，回傳統一的錯誤格式（比照 Issue 3（Sprint 1）`http.ts` 攔截器可解析的錯誤結構）。
- 新增 handlers 已合併進 `mocks/handlers/index.ts` 匯出的 `handlers` 陣列。
- 可於瀏覽器 DevTools Network 面板實際觀察到 Mock 回應（透過暫時的手動呼叫或既有頁面驗證）。

### 標籤

`type:feature`、`area:api`、`area:employee`、`sprint-2`

### 優先權

高

### 預計時間

3 小時

---

## Issue 3：Mock API：請假申請

### 描述

依 Issue 1 的型別與種子資料，建立 US-003（提交申請）與 US-004（查看紀錄）所需的 MSW Handler，對應 `docs/Architecture.md` 第 5 節。

### 驗收標準

- `POST /api/leave-requests`：接收假別、起訖日期、原因，驗證必要欄位皆存在、結束日期不早於開始日期；成功時建立一筆狀態為「待審核」的請假申請並存回記憶體種子資料，回傳建立後的完整紀錄。
- `GET /api/leave-requests`：依 Token 解析出目前登入使用者，回傳僅屬於該使用者的請假申請清單（不可看到其他員工的紀錄）。
- 兩支 API 的錯誤情境（驗證失敗、未登入）回傳統一錯誤格式，可被既有的 `ApiError` 攔截器正確解析。
- 新增 handlers 已合併進 `mocks/handlers/index.ts` 匯出的 `handlers` 陣列。
- 手動驗證：連續呼叫 `POST` 後再呼叫 `GET`，可看到新建立的紀錄出現在清單中（同一次瀏覽器 session 內，重新整理後可重置為種子資料即可，不需真正持久化）。

### 標籤

`type:feature`、`area:api`、`area:employee`、`sprint-2`

### 優先權

高

### 預計時間

4 小時

---

## Issue 4：Implement Leave Balance Service & Store：剩餘假期

### 描述

依 Issue 2 的 Mock API，建立 US-002 的 Service 與 Store 層，對應 `docs/Architecture.md` 第 4、5 節。

### 驗收標準

- 新增 `services/leaveTypeService.ts`：匯出 `getLeaveTypes()`，呼叫 `GET /leave-types`，不含狀態管理或 UI 邏輯。
- 新增 `services/leaveService.ts` 並匯出 `getMyBalance()`，呼叫 `GET /leave-balances`（若 Issue 5 也會擴充此檔案，兩者共用同一支 Service 檔即可，避免過度切分）。
- 新增 `stores/leaveBalance.store.ts`：提供 `balances` 狀態、`loading`／`error` 狀態，以及 `fetchBalance` action；僅透過 Service 存取資料，不直接呼叫 Axios。
- Store 不呼叫其他 Store（如 `auth.store`），符合 Architecture 的 Store 隔離原則。
- 補上對應的單元測試（`*.spec.ts`），覆蓋成功取得資料與請求失敗（Service 拋出錯誤）兩種情境。

### 標籤

`type:feature`、`area:api`、`area:store`、`area:employee`、`sprint-2`

### 優先權

高

### 預計時間

3 小時

---

## Issue 5：Implement Leave Request Service & Store：請假申請與紀錄

### 描述

依 Issue 3 的 Mock API，建立 US-003（提交申請）與 US-004（查看紀錄）的 Service 與 Store 層，對應 `docs/Architecture.md` 第 4、5 節。

### 驗收標準

- 於 `services/leaveService.ts` 新增 `createLeaveRequest(payload)` 與 `getMyLeaveRequests()`，分別對應 `POST /leave-requests`、`GET /leave-requests`。
- 新增 `stores/leaveRequest.store.ts`：提供 `requests` 狀態、`loading`／`error`／送出狀態，以及 `fetchMyRequests`、`submitRequest` actions。
- 提供依日期排序後的請假紀錄 getter（供 US-004「可依日期排序」驗收標準使用），排序邏輯放在 Store 的 getter，不放在元件內重複計算。
- `submitRequest` 成功後，Store 內的 `requests` 狀態需同步更新（重新查詢或直接附加新紀錄皆可），避免使用者送出後還要手動重新整理才看得到新紀錄。
- 補上對應的單元測試，覆蓋 `fetchMyRequests` 成功/失敗、`submitRequest` 成功/失敗，以及排序 getter 的行為。

### 標籤

`type:feature`、`area:api`、`area:store`、`area:employee`、`sprint-2`

### 優先權

高

### 預計時間

5 小時

---

## Issue 6：Implement Employee Leave Features：三頁面實作與整合

### 描述

依 Issue 4、Issue 5 完成的 Store，將 `features/employee/*` 下三個現有的 placeholder 頁面替換為真正的功能頁面，完成 US-002、US-003、US-004 的完整流程。路由、`DefaultLayout` 側邊選單皆已在 Sprint 1 建立完成，本 Issue 只需替換頁面內容並視需要新增 Composable，對應 `docs/Architecture.md` 第 6、8 節。

### 驗收標準

**剩餘假期頁（US-002，`leave-balance/LeaveBalanceView.vue`）**

- 頁面掛載時呼叫 `leaveBalance.store` 的 `fetchBalance`，載入中顯示 loading 狀態。
- 顯示年假、病假、事假三種假別的剩餘天數（對應 PRD US-002 全部驗收標準）。

**申請請假頁（US-003，`leave-request/LeaveRequestView.vue`）**

- 表單可選擇假別（下拉選單資料來源為 `leaveTypeService.getLeaveTypes()`）、選擇開始日期、選擇結束日期、輸入請假原因。
- 新增 `composables/useDateRange.ts`：封裝起訖日期選擇與天數計算邏輯，供本頁面使用。
- 送出前進行驗證（假別、日期、原因皆為必填，結束日期不得早於開始日期），驗證失敗時不呼叫 API。
- 送出成功後顯示成功提示，並清空表單或導向請假紀錄頁；送出失敗時顯示錯誤訊息（對應 PRD US-003 全部驗收標準）。

**請假紀錄頁（US-004，`leave-history/LeaveHistoryView.vue`）**

- 頁面掛載時呼叫 `leaveRequest.store` 的 `fetchMyRequests`，使用 `BaseTable` 顯示所有請假紀錄。
- 顯示假別、請假日期、狀態（使用既有的 `LeaveStatusTag` 元件顯示待審核／已核准／已駁回）。
- 提供依日期排序的操作（可為表格欄位排序或簡單的排序切換按鈕），對應 PRD US-004「可依日期排序」驗收標準。
- 無資料時顯示既有的 `EmptyState` 共用元件。

**整合驗收**

- 三個頁面皆透過 Sprint 1 既有的路由與 `DefaultLayout` 側邊選單可正常導覽，無需額外調整路由設定。
- 元件內不直接呼叫 Service 或 Axios，一律經由對應 Store 存取資料，符合分層規則。
- `npm run lint`、`npm run build`、`npm run test` 皆需通過。

### 標籤

`type:feature`、`area:ui`、`area:employee`、`sprint-2`

### 優先權

高

### 預計時間

10 小時

---

## Sprint 2 總預估時間 ( Total Estimate )

3h + 3h + 4h + 3h + 5h + 10h = 28 小時
