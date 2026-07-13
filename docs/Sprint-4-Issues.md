# Sprint 4 GitHub Issues

本文件依據 `docs/PRD v1.1.md` 與 `docs/Architecture.md`，並延續 Sprint 1（專案基礎架構、US-001 使用者登入）、Sprint 2（US-002～US-004，Employee 三個核心使用者故事）與 Sprint 3（US-005～US-006，Manager 審核流程）已完成的分層架構（`features/* → stores/* → services/* → Axios → MSW`），為 Sprint 4 拆解出可直接建立為 GitHub Issue 的任務清單。尚未實際建立於 GitHub，僅為草稿。

## Sprint 4 目標 ( Sprint Goal )

端到端完成 HR 角色的兩個核心使用者故事：

1. US-007 查看所有請假資料——HR 可查看所有員工的請假紀錄，並可搜尋、篩選、排序。
2. US-008 管理假別——HR 可新增、編輯、刪除假別，維護公司請假制度。

Sprint 1 已建立 `features/hr/leave-records/`、`features/hr/leave-types/` 的路由（`/hr/leave-records`、`/hr/leave-types`，路由名稱 `HR_LEAVE_RECORDS`、`HR_LEAVE_TYPES`）、角色守衛與 `DefaultLayout` 側邊選單；先前的全站視覺重新設計已將這兩個頁面套上完整視覺樣式，但資料來源是元件內寫死的本地陣列，操作按鈕僅顯示「尚未串接」提示（見 `CLAUDE.md`「目前實作狀態」一節）。Sprint 4 的工作是由資料層（Mock API）開始，依序長出 Service、Store，最後把這兩個靜態視覺稿換成真正串接資料與行為的功能頁面。

**Store 拆分說明：** `docs/Architecture.md` 第 4 節的 Store 設計表格將 US-007、US-008 都對應到單一 `leaveType.store`。但 US-007（查看所有請假紀錄）操作的是 `LeaveRequest` 領域，US-008（管理假別）操作的是 `LeaveType` 領域，兩者資料形狀與使用情境皆不同；比照 Sprint 3 中 Manager 的 `approval.store` 並未併入 Employee 既有的 `leaveRequest.store`、而是依角色情境獨立拆出的作法，Sprint 4 比照辦理：US-007 新增獨立的 `leaveRecord.store.ts`（Service 邏輯併入既有 `leaveService.ts`，沿用同一份 `LeaveRequest` 領域 Service），US-008 則直接擴充既有的 `leaveType.store.ts`／`leaveTypeService.ts`（與 Architecture.md 第 4 節列出的 Action 清單一致）。此為 Sprint 4 對既有架構文件的必要修正，不影響分層規則（`features → stores → services → Axios → MSW`）本身。

不含於 Sprint 4：

- Dashboard、Notification、Email、Audit Log、多層簽核（Multi-level Approval）、真實 Backend、Authentication 重構、RBAC 擴充、UI 美化、Performance Optimization——以上皆非 PRD US-007／US-008 驗收標準所要求，留待未來版本。
- 刪除假別時檢查是否有請假紀錄正在使用該假別（referential integrity）——US-008 驗收標準未提及，不做保護性檢查或關聯資料清理。
- 請假紀錄的匯出／報表產出——PRD「目標用戶」一節提到 HR「產生休假報告」，但 US-007 驗收標準只列出查看、搜尋、篩選、排序，不含匯出或報表功能。
- 表格分頁——目前種子資料量小（單位數到十位數筆），`BaseTable` 全量渲染即可滿足 US-007 需求，不引入分頁元件；未來資料量成長屬後續優化。
- Manager（US-005、US-006）功能異動——Sprint 3 已完成，本 Sprint 不修改 `features/manager/*`、`approval.store`、`approvalService`。

## 標籤說明 ( Label Legend )

| 標籤 | 用途 |
|---|---|
| `type:chore` | 基礎資料/型別建設，非使用者可見功能 |
| `type:feature` | 對應 PRD 使用者故事的功能開發 |
| `area:foundation` | 共用型別、種子資料等基礎骨架 |
| `area:api` | Service / MSW Mock API |
| `area:store` | Pinia 狀態管理 |
| `area:ui` | 頁面與共用 UI |
| `area:hr` | HR 角色功能 |
| `sprint-4` | 本次 Sprint 範圍 |

## Issue 總覽 ( Overview )

| # | 標題 | 對應 User Story | 優先權 | 預計時間 |
|---|---|---|---|---|
| 1 | Setup HR Domain：Mock Data / Types | US-007／US-008（共用基礎） | 高 | 2h |
| 2 | Mock API：HR 請假紀錄總覽與假別管理 | US-007／US-008 | 高 | 4h |
| 3 | Implement HR Service & Store：請假紀錄與假別管理 | US-007／US-008 | 高 | 5h |
| 4 | HR Leave Records UI：請假紀錄總覽頁 | US-007 | 高 | 6h |
| 5 | Leave Type CRUD UI：假別管理頁 | US-008 | 高 | 7h |
| 6 | Integration：HR 端到端驗證 | US-007／US-008 | 高 | 3h |

---

## Issue 1：Setup HR Domain：Mock Data / Types

### 描述

為 US-007、US-008 補齊必要的型別與種子資料，對應 `docs/Architecture.md` 第 1、9 節。目前 `types/leaveType.ts` 的 `LeaveType` 僅有 `{ id, name }`，不足以支援假別的新增／編輯（無法承載年度天數、說明等可編輯欄位）；`mocks/data/leaveTypes.ts` 種子資料也只有 `id`／`name`。US-007 所需的 `LeaveRequest`／`LeaveStatus` 型別與種子資料在 Sprint 2、Sprint 3 已補齊（`mocks/data/leaveRequests.ts` 現有 6 筆紀錄，涵蓋 2 位員工、3 種假別、待審核／已核准／已駁回三種狀態），足以支援清單顯示、搜尋、篩選、排序的驗收標準，本 Issue 不修改。

### 驗收標準

- 擴充 `types/leaveType.ts` 的 `LeaveType`，新增 `totalDays: number`、`description: string` 兩個欄位。
- 新增 `CreateLeaveTypePayload`（`name`、`totalDays`、`description`）與 `UpdateLeaveTypePayload`（同上）兩個型別於 `types/leaveType.ts`，並於 `types/index.ts` barrel 一併匯出。
- `mocks/data/leaveTypes.ts` 的既有三筆種子資料（`lt-001` 年假、`lt-002` 病假、`lt-003` 事假）補上對應的 `totalDays`／`description` 欄位，內容可參考 `LeaveTypesView.vue` 目前靜態稿已呈現的年度天數與說明文字。
- 確認 `LeaveRequest`／`LeaveStatus`（`types/leave.ts`）與現有 `mocks/data/leaveRequests.ts` 種子資料已足夠支援 US-007 的清單顯示、搜尋、篩選、排序驗收標準，本 Issue 不新增請假紀錄種子資料、不修改 `LeaveRequest` 型別。
- 種子資料維持既有的記憶體陣列可變模式（`push`／就地修改元素／`splice` 刪除），供 Issue 2 的 handlers 讀取與更新，不需額外持久化機制。

### 標籤

`type:chore`、`area:foundation`、`area:hr`、`sprint-4`

### 優先權

高

### 預計時間

2 小時

---

## Issue 2：Mock API：HR 請假紀錄總覽與假別管理

### 描述

依 Issue 1 的型別與種子資料，建立 US-007（查看所有請假紀錄）與 US-008（假別 CRUD）所需的 MSW Handler，對應 `docs/Architecture.md` 第 5 節。US-007 的查詢邏輯操作的是同一份 `MOCK_LEAVE_REQUESTS`，併入既有 `mocks/handlers/leave.handlers.ts`（比照 Sprint 3 Issue 2 的作法，不另立新檔）；US-008 的 CRUD 操作同一份 `MOCK_LEAVE_TYPES`，併入既有 `mocks/handlers/leaveType.handlers.ts`。

### 驗收標準

- 新增 `GET /api/hr/leave-records`：回傳 `MOCK_LEAVE_REQUESTS` 全部紀錄（不限申請人、不限狀態），對應 US-007「顯示所有員工請假資料」；與既有 `GET /api/leave-requests`（僅回傳目前登入者自己的紀錄，Sprint 2 既定行為）為不同端點，不更動既有端點的行為。
- `GET /api/hr/leave-records` 需帶有效登入 Token 才可呼叫（沿用既有 `resolveCurrentUser`），未登入時回傳統一錯誤格式；不額外實作角色層級的 API 授權檢查，維持與既有 handlers 一致的簡化程度。
- 新增 `POST /api/leave-types`：接收 `name`／`totalDays`／`description`，驗證必要欄位皆存在，缺漏時回傳 400；成功時建立新假別（產生新 `id`）並 push 進 `MOCK_LEAVE_TYPES`，回傳建立後的完整紀錄（201）。
- 新增 `PUT /api/leave-types/:id`：依 `id` 找到對應假別，若找不到則回傳 404；成功時更新該筆的 `name`／`totalDays`／`description`，回傳更新後的完整紀錄。
- 新增 `DELETE /api/leave-types/:id`：依 `id` 找到對應假別並自 `MOCK_LEAVE_TYPES` 移除，若找不到則回傳 404；成功時回傳已刪除的紀錄。
- 上述四支新 handlers 分別併入 `mocks/handlers/leave.handlers.ts`（`GET /hr/leave-records`）與 `mocks/handlers/leaveType.handlers.ts`（假別 CRUD 三支），並確認已被 `mocks/handlers/index.ts` 匯出的 `handlers` 陣列涵蓋（既有陣列已包含這兩個檔案，新增 handler 會自動生效，不需修改 `index.ts`）。
- 可於瀏覽器 DevTools Network 面板實際觀察到四支 API 的 Mock 回應（透過暫時的手動呼叫或既有頁面驗證）。

### 標籤

`type:feature`、`area:api`、`area:hr`、`sprint-4`

### 優先權

高

### 預計時間

4 小時

---

## Issue 3：Implement HR Service & Store：請假紀錄與假別管理

### 描述

依 Issue 2 的 Mock API，建立 US-007、US-008 的 Service 與 Store 層，對應 `docs/Architecture.md` 第 4、5 節。US-007 的查詢函式併入既有 `services/leaveService.ts`（沿用同一份 `LeaveRequest` 領域 Service，比照 Sprint 2 Issue 4 的「同一份 Service 供多個 Issue 擴充」慣例），並新增獨立的 `stores/leaveRecord.store.ts`（拆分原因見 Sprint Goal 的「Store 拆分說明」）。US-008 直接擴充既有的 `services/leaveTypeService.ts` 與 `stores/leaveType.store.ts`。

### 驗收標準

**US-007：leaveService 擴充 + leaveRecord.store**

- 於 `services/leaveService.ts` 新增 `getAllLeaveRequests()`，呼叫 `GET /hr/leave-records`，回傳 `Promise<LeaveRequest[]>`；不含狀態管理或 UI 邏輯。
- 新增 `stores/leaveRecord.store.ts`：提供 `records`（`LeaveRequest[]`）、`loading`、`error` 狀態，以及 `fetchAllRecords` action（呼叫 `leaveService.getAllLeaveRequests()`）。
- 提供 `searchKeyword`（員工姓名關鍵字，字串）、`leaveTypeFilter`（假別 id，可為空代表不篩選）兩個狀態，以及 `filteredRecords` getter：先以 `searchKeyword` 比對 `employeeName`（不分大小寫、包含即符合），再以 `leaveTypeFilter` 比對 `leaveTypeId`，最後依 `startDate` 排序，對應 US-007「可搜尋員工姓名」「可依請假類型篩選」「可依日期排序」三項驗收標準；篩選與排序邏輯放在 Store 的 getter，不放在元件內重複計算（比照 Sprint 2 Issue 5 的排序 getter 慣例）。
- Store 僅透過 `leaveService` 存取資料，不直接呼叫 Axios；不呼叫其他 Store（符合 Architecture 的 Store 隔離原則）。
- 新增 `services/leaveService.spec.ts`（目前尚無此檔案，新建），涵蓋 `getAllLeaveRequests` 成功回傳與請求失敗（拋出 `ApiError`）兩種情境；新增 `stores/leaveRecord.store.spec.ts`，覆蓋 `fetchAllRecords` 成功／失敗，以及 `filteredRecords` 在有／無 `searchKeyword`、有／無 `leaveTypeFilter` 組合下的篩選與排序結果。

**US-008：leaveTypeService 擴充 + leaveType.store 擴充**

- 於 `services/leaveTypeService.ts` 新增 `createLeaveType(payload: CreateLeaveTypePayload)`、`updateLeaveType(id: string, payload: UpdateLeaveTypePayload)`、`deleteLeaveType(id: string)`，分別對應 `POST /leave-types`、`PUT /leave-types/:id`、`DELETE /leave-types/:id`，回傳型別皆引用 `types/leaveType.ts`。
- 於 `stores/leaveType.store.ts` 新增 `createLeaveType`、`updateLeaveType`、`deleteLeaveType` actions（對應 `docs/Architecture.md` 第 4 節 `leaveType.store` 的 Action 清單）與單一操作進行中狀態（例如 `processingId`），供 UI 在送出中停用對應按鈕；三個 action 成功後皆需同步更新 `leaveTypes` 狀態（新增則 push、編輯則就地更新該筆、刪除則自陣列移除），使畫面即時反映最新結果，對應 US-008「CRUD 更新後立即反映畫面」。
- Store 僅透過 `leaveTypeService` 存取資料，不直接呼叫 Axios；不呼叫其他 Store。
- 新增 `services/leaveTypeService.spec.ts`（目前尚無此檔案，新建），涵蓋 `getLeaveTypes`（既有函式，一併補上遺漏的測試）與三個新函式的成功／失敗情境；擴充既有 `stores/leaveType.store.spec.ts`，新增 `createLeaveType`／`updateLeaveType`／`deleteLeaveType` 成功後狀態正確更新，以及失敗時 `error` 正確設置、原資料不被誤改的案例。

### 標籤

`type:feature`、`area:api`、`area:store`、`area:hr`、`sprint-4`

### 優先權

高

### 預計時間

5 小時

---

## Issue 4：HR Leave Records UI：請假紀錄總覽頁

### 描述

依 Issue 3 完成的 `leaveRecord.store`，將 `features/hr/leave-records/LeaveRecordsView.vue` 現有的靜態視覺稿（本地假資料 `RECORDS`）替換為真正串接資料的功能頁面，完成 US-007 的完整流程。路由（`/hr/leave-records`）、角色守衛、`DefaultLayout` 側邊選單與頁面視覺樣式皆已完成，本 Issue 只需替換資料來源與互動邏輯，對應 `docs/Architecture.md` 第 6、7 節。

### 驗收標準

- 頁面掛載時呼叫 `leaveRecord.store` 的 `fetchAllRecords`，載入中顯示 loading 狀態（沿用 `BaseTable` 的 `loading` prop）。
- 移除本地假資料 `RECORDS`，改為渲染 `leaveRecord.store` 的 `filteredRecords`；每筆顯示員工姓名、假別、請假日期、天數、狀態（使用既有 `LeaveStatusTag`），對應 PRD US-007「顯示所有員工請假資料」。
- 既有的搜尋輸入框（目前僅為靜態 placeholder 文字）改為可輸入的 `el-input`，雙向綁定 `leaveRecord.store` 的 `searchKeyword`，輸入後即時篩選清單，對應 US-007「可搜尋員工姓名」。
- 既有的狀態篩選下拉選單旁新增一個假別篩選 `el-select`，選項資料來源為 `leaveType.store` 的 `leaveTypes`（沿用既有唯讀假別清單 Store，不重複拉取資料），綁定 `leaveRecord.store` 的 `leaveTypeFilter`，對應 US-007「可依請假類型篩選」。
- 桌面表格提供依請假日期排序的操作（表格欄位排序或排序切換按鈕，比照 Sprint 2 請假紀錄頁的排序模式），對應 US-007「可依日期排序」。
- 桌面表格（`BaseTable`）與手機卡片列表（既有 `@media (max-width: 767px)` 切換模式）皆套用上述真實資料與互動邏輯，維持既有響應式版面不變，不重做視覺樣式。
- 無資料（含篩選後無符合結果）時顯示既有的 `EmptyState` 共用元件。
- 元件內不直接呼叫 Service 或 Axios，一律經由 `leaveRecord.store`／`leaveType.store` 存取資料，符合分層規則。

### 標籤

`type:feature`、`area:ui`、`area:hr`、`sprint-4`

### 優先權

高

### 預計時間

6 小時

---

## Issue 5：Leave Type CRUD UI：假別管理頁

### 描述

依 Issue 3 完成的 `leaveType.store` CRUD actions，將 `features/hr/leave-types/LeaveTypesView.vue` 現有的靜態視覺稿（本地假資料 `LEAVE_TYPES`、`ElMessage.info` 尚未串接提示）替換為真正串接資料與行為的功能頁面，完成 US-008 的完整互動流程。路由（`/hr/leave-types`）、角色守衛、`DefaultLayout` 側邊選單與頁面視覺樣式皆已完成，本 Issue 只需替換資料來源與互動邏輯，對應 `docs/Architecture.md` 第 6、7 節。

### 驗收標準

- 頁面掛載時呼叫 `leaveType.store` 的 `fetchLeaveTypes`，載入中顯示 loading 狀態。
- 移除本地假資料 `LEAVE_TYPES`，改為渲染 `leaveType.store` 的 `leaveTypes`；每筆顯示假別名稱、年度天數、說明，對應 US-008「顯示所有假別」。
- 既有「＋ 新增假別」按鈕改為開啟新增表單（使用 Element Plus Form：`el-form` + `el-form-item`，欄位為名稱／年度天數／說明，皆為必填並顯示驗證訊息），送出後呼叫 `leaveType.store` 的 `createLeaveType`，成功後顯示 `ElMessage.success` 並關閉表單，新假別立即出現在清單中，對應 US-008「可新增假別」。
- 既有的編輯圖示改為開啟同一個 Element Plus Form（欄位預先帶入該筆現有資料），送出後呼叫 `leaveType.store` 的 `updateLeaveType`，成功後顯示 `ElMessage.success` 並關閉表單，清單中該筆立即更新為最新內容，對應 US-008「可編輯假別」。
- 既有的刪除圖示改為先透過既有的 `ConfirmDialog` 元件要求二次確認，確認後才呼叫 `leaveType.store` 的 `deleteLeaveType`，成功後顯示 `ElMessage.success`，該筆立即自清單移除，對應 US-008「可刪除假別」。
- 新增／編輯／刪除任一操作失敗時顯示錯誤訊息，畫面資料維持操作前狀態，以便使用者可重試。
- 桌面表格（`BaseTable`）與手機卡片列表皆套用上述真實資料與互動邏輯，維持既有響應式版面不變，不重做視覺樣式。
- 元件內不直接呼叫 Service 或 Axios，一律經由 `leaveType.store` 存取資料，符合分層規則。

### 標籤

`type:feature`、`area:ui`、`area:hr`、`sprint-4`

### 優先權

高

### 預計時間

7 小時

---

## Issue 6：Integration：HR 端到端驗證

### 描述

串接路由、Store、Mock API 與 UI，驗證 US-007、US-008 的完整流程，並確認與既有 Employee／Manager 流程不互相影響，作為 Sprint 4 最終整合驗收項目。路由與角色守衛已於 Sprint 1 建立完成（`HR_LEAVE_RECORDS`／`HR_LEAVE_TYPES` 路由、`roles: ['hr']` 守衛），本 Issue 不需新增路由設定。

### 驗收標準

- HR 角色登入後，可透過 `DefaultLayout` 既有側邊選單導覽至「請假紀錄總覽」與「假別管理」兩個頁面；Employee／Manager 角色無法存取（沿用 Sprint 1 既有角色守衛，不需調整）。
- 端到端驗證 US-007：HR 登入請假紀錄總覽頁，可看到目前系統內所有員工（跨多個 Employee 帳號）的請假紀錄；輸入員工姓名關鍵字可正確篩選出符合結果、切換假別篩選可正確篩選、切換日期排序可正確排序。
- 端到端驗證 US-008 新增流程：HR 於假別管理頁新增一筆新假別 → 清單立即顯示該筆 → 確認 Employee 角色的「申請請假」頁（US-003，Sprint 2 既有功能）假別下拉選單也能看到這筆新假別，驗證假別資料為 Employee／HR 共用同一份 Mock 資料源。
- 端到端驗證 US-008 編輯與刪除流程：編輯剛新增的假別（修改名稱／天數／說明）→ 清單立即反映最新內容；刪除該筆 → 清單立即移除，可於 Network 面板確認 `DELETE` 請求回應成功。
- `npm run lint`、`npm run build`、`npm run test` 皆需通過。
- 確認本 Sprint 未修改 `docs/Architecture.md`、未加入 Dashboard、Notification、Email、Audit Log、多層簽核、真實 Backend、Authentication 重構、RBAC 擴充、UI 美化、Performance Optimization 等 PRD 未要求或本文件明確排除的功能。

### 標籤

`type:feature`、`area:hr`、`sprint-4`

### 優先權

高

### 預計時間

3 小時

---

## Sprint 4 總預估時間 ( Total Estimate )

2h + 4h + 5h + 6h + 7h + 3h = 27 小時
