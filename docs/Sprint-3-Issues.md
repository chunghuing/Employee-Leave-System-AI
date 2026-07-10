# Sprint 3 GitHub Issues

本文件依據 `docs/PRD v1.1.md` 與 `docs/Architecture.md`，並延續 Sprint 1（專案基礎架構、US-001 使用者登入）與 Sprint 2（US-002～US-004，Employee 三個核心使用者故事）已完成的分層架構（`features/* → stores/* → services/* → Axios → MSW`），為 Sprint 3 拆解出可直接建立為 GitHub Issue 的任務清單。尚未實際建立於 GitHub，僅為草稿。

## Sprint 3 目標 ( Sprint Goal )

端到端完成 Manager 角色的兩個核心使用者故事：

1. US-005 查看待審核請假——主管可查看所有待審核的請假申請，並可點擊查看詳細內容。
2. US-006 核准或駁回請假——主管可核准或駁回請假申請，操作後更新請假狀態並回到待審核列表。

Sprint 1 已建立 `features/manager/approval/` 的路由（`/manager/approval`，路由名稱 `MANAGER_APPROVAL`）、角色守衛與 `DefaultLayout` 側邊選單；先前的全站視覺重新設計已將此頁面套上完整視覺樣式，但資料來源是元件內寫死的本地陣列，操作按鈕僅顯示「尚未串接」提示（見 `CLAUDE.md`「設計系統」一節）。Sprint 3 的工作是由資料層（Mock API）開始，依序長出 Service、Store，最後把這個靜態視覺稿換成真正串接資料與行為的功能頁面。

Sprint Goal 對應的端到端流程：

```text
Employee 提交請假
  ↓
Manager 查看待審核
  ↓
Manager 核准或駁回
  ↓
Employee 再次查看請假紀錄，狀態已正確更新
```

不含於 Sprint 3：

- HR（US-007、US-008）的任何功能開發。
- 主管與員工的組織對應關係（如部門、直屬主管）——目前 `types/user.ts` 沒有任何 `managerId`／`team` 概念，Manager 看到的是系統內「所有」待審核申請，不做按團隊篩選；若未來需要按團隊範圍限縮，屬於後續 Sprint 的資料模型擴充。
- 請假核准後扣減 `leaveBalance` 餘額——目前 `mocks/data/leaveRequests.ts` 與 `mocks/data/leaveBalances.ts` 是兩份互不關聯的種子資料，PRD US-005／US-006 的驗收標準也未提及餘額異動，本 Sprint 不建立兩者的連動邏輯。
- Email、Notification、Audit Log、多層簽核（Multi-level Approval）、WebSocket／即時更新、權限管理擴充等 PRD MVP 範圍外的功能。

## 標籤說明 ( Label Legend )

| 標籤 | 用途 |
|---|---|
| `type:chore` | 基礎資料/型別建設，非使用者可見功能 |
| `type:feature` | 對應 PRD 使用者故事的功能開發 |
| `area:foundation` | 共用型別、種子資料等基礎骨架 |
| `area:api` | Service / MSW Mock API |
| `area:store` | Pinia 狀態管理 |
| `area:ui` | 頁面與共用 UI |
| `area:manager` | Manager 角色功能 |
| `sprint-3` | 本次 Sprint 範圍 |

## Issue 總覽 ( Overview )

| # | 標題 | 對應 User Story | 優先權 | 預計時間 |
|---|---|---|---|---|
| 1 | Setup Manager Approval Domain：Mock Seed Data | US-005／US-006（共用基礎） | 高 | 2h |
| 2 | Mock API：待審核清單與審核操作 | US-005／US-006 | 高 | 4h |
| 3 | Implement approvalService | US-005／US-006 | 高 | 2h |
| 4 | Implement approval.store | US-005／US-006 | 高 | 3h |
| 5 | Approval UI：Manager Approval Page | US-005／US-006 | 高 | 8h |
| 6 | Integration：Employee → Manager → Employee 端到端驗證 | US-005／US-006 | 高 | 3h |

---

## Issue 1：Setup Manager Approval Domain：Mock Seed Data

### 描述

為 US-005、US-006 補齊必要的種子資料，對應 `docs/Architecture.md` 第 1、9 節。`types/leave.ts` 的 `LeaveRequest` 已包含 `employeeId`、`employeeName`、`status` 等欄位，`LeaveStatus` 已定義 `'pending' | 'approved' | 'rejected'`（`constants/leaveStatus.ts` 亦已有對應中文標籤），不需新增型別。目前 `mocks/data/leaveRequests.ts` 只有 1 筆待審核紀錄、且只屬於唯一的員工測試帳號，不足以驗證「顯示所有待審核申請」這項需要多筆、多人資料才看得出效果的驗收標準。

### 驗收標準

- 確認 `LeaveRequest`／`LeaveStatus`（`types/leave.ts`）與 `LEAVE_STATUS`（`constants/leaveStatus.ts`）既有欄位已足夠支援待審核清單與核准/駁回操作，本 Issue 不新增或修改型別定義。
- `mocks/data/users.ts` 新增至少 1 位 Employee 測試帳號（沿用 `password123` 密碼慣例），使待審核清單可展示來自不同申請人的請假申請。
- `mocks/data/leaveBalances.ts` 為新增的 Employee 帳號補上對應的三種假別餘額種子資料（沿用既有結構），避免該帳號登入後剩餘假期頁因缺資料而出錯。
- `mocks/data/leaveRequests.ts` 新增至少 2～3 筆狀態為 `pending` 的請假申請，分屬不同申請人與不同假別，取代目前僅有 1 筆待審核紀錄的種子資料。
- 種子資料維持既有的記憶體陣列可變模式（`push`／直接修改元素 `status`），供 Issue 2 的 handlers 讀取與更新，不需額外持久化機制。

### 標籤

`type:chore`、`area:foundation`、`area:manager`、`sprint-3`

### 優先權

高

### 預計時間

2 小時

---

## Issue 2：Mock API：待審核清單與審核操作

### 描述

依 Issue 1 的種子資料，建立 US-005（查看待審核）與 US-006（核准/駁回）所需的 MSW Handler，對應 `docs/Architecture.md` 第 5 節。沿用 `mocks/handlers/leave.handlers.ts` 既有的 `resolveCurrentUser` 前綴比對邏輯與統一錯誤格式慣例；由於審核 API 操作的是同一份 `MOCK_LEAVE_REQUESTS` 資源，併入既有的 `leave.handlers.ts`，不另立新檔。

### 驗收標準

- 新增 `GET /api/approvals/pending`：回傳 `MOCK_LEAVE_REQUESTS` 中所有 `status === 'pending'` 的請求，不依申請人身分過濾（因目前資料模型無主管-員工對應關係，Manager 看到系統內所有待審核申請），對應 US-005「顯示所有待審核申請」。
- `GET /api/approvals/pending` 需帶有效登入 Token 才可呼叫（沿用既有 `resolveCurrentUser`），未登入時回傳統一錯誤格式；不額外實作角色層級的 API 授權檢查，保持與既有 handlers 一致的簡化程度。
- 新增 `POST /api/approvals/:id/approve`：依 `id` 找到對應請求，若找不到則回傳錯誤；若該筆狀態已非 `pending`（已被處理過）則回傳錯誤、不可重複審核；成功時將該筆 `status` 更新為 `approved`，並回傳更新後的完整 `LeaveRequest`。
- 新增 `POST /api/approvals/:id/reject`：邏輯同上，成功時將該筆 `status` 更新為 `rejected`。
- 兩支審核 API 皆直接修改 `MOCK_LEAVE_REQUESTS` 陣列中對應元素的 `status`（沿用既有 `POST /leave-requests` 的記憶體陣列可變模式），使 Employee 端既有的 `GET /api/leave-requests`（Sprint 2）能立即讀到最新狀態，不需額外同步機制。
- 三支 handlers 併入 `mocks/handlers/leave.handlers.ts`，並確認已被 `mocks/handlers/index.ts` 匯出的 `handlers` 陣列涵蓋。
- 可於瀏覽器 DevTools Network 面板實際觀察到三支 API 的 Mock 回應（透過暫時的手動呼叫或既有頁面驗證）。

### 標籤

`type:feature`、`area:api`、`area:manager`、`sprint-3`

### 優先權

高

### 預計時間

4 小時

---

## Issue 3：Implement approvalService

### 描述

依 Issue 2 的 Mock API，建立 Service 層，對應 `docs/Architecture.md` 第 5 節。比照 `services/leaveService.ts` 既有模式：純函式、透過共用 Axios 實例呼叫、回傳明確型別，不含狀態或 UI 邏輯。

### 驗收標準

- 新增 `services/approvalService.ts`，匯出：
  - `getPendingApprovals()`：呼叫 `GET /approvals/pending`，回傳 `Promise<LeaveRequest[]>`。
  - `approveLeaveRequest(id: string)`：呼叫 `POST /approvals/:id/approve`，回傳 `Promise<LeaveRequest>`。
  - `rejectLeaveRequest(id: string)`：呼叫 `POST /approvals/:id/reject`，回傳 `Promise<LeaveRequest>`。
- 三個函式皆透過 `services/http.ts` 匯出的共用 Axios 實例呼叫，型別引用既有的 `types/leave.ts`（`LeaveRequest`），不重複定義型別。
- 本檔案不含任何狀態管理或 UI 邏輯，僅供 Issue 4 的 `approval.store` 呼叫，不被 `features/*` 直接引用（符合 Architecture 分層規則）。
- 補上對應的單元測試（`services/approvalService.spec.ts`），覆蓋三個函式成功回傳與請求失敗（拋出 `ApiError`）兩種情境。

### 標籤

`type:feature`、`area:api`、`area:manager`、`sprint-3`

### 優先權

高

### 預計時間

2 小時

---

## Issue 4：Implement approval.store

### 描述

依 Issue 3 的 Service，建立 Pinia Store 管理待審核清單與審核操作狀態，對應 `docs/Architecture.md` 第 4 節。比照 `stores/leaveRequest.store.ts` 既有的 setup-store 模式。

### 驗收標準

- 新增 `stores/approval.store.ts`：提供 `pendingRequests`（`LeaveRequest[]`）、`loading`、`error` 狀態，以及 `fetchPendingApprovals` action（呼叫 `approvalService.getPendingApprovals()`）。
- 提供 `approve(id: string)`、`reject(id: string)` actions，分別呼叫 `approvalService.approveLeaveRequest`／`rejectLeaveRequest`；成功後將該筆紀錄自 `pendingRequests` 移除，使畫面上的待審核清單即時反映最新結果，對應 US-006「操作完成後返回待審核列表」。
- 提供單一操作進行中狀態（例如 `processingId`），供 UI 在核准/駁回進行中時可針對該筆停用按鈕，避免重複送出。
- Store 僅透過 `approvalService` 存取資料，不直接呼叫 Axios；不呼叫其他 Store（符合 Architecture 的 Store 隔離原則）。
- 補上對應的單元測試（`stores/approval.store.spec.ts`），覆蓋 `fetchPendingApprovals` 成功/失敗、`approve`／`reject` 成功後清單正確移除該筆紀錄，以及失敗時 `error` 狀態正確設置、該筆紀錄不被移除。

### 標籤

`type:feature`、`area:store`、`area:manager`、`sprint-3`

### 優先權

高

### 預計時間

3 小時

---

## Issue 5：Approval UI：Manager Approval Page

### 描述

依 Issue 4 完成的 Store，將 `features/manager/approval/ApprovalListView.vue` 現有的靜態視覺稿（本地假資料 `PENDING_REQUESTS`／`STATS`、`ElMessage.info` 尚未串接提示）替換為真正串接資料與行為的功能頁面，完成 US-005、US-006 的完整互動流程。路由（`/manager/approval`）、角色守衛、`DefaultLayout` 側邊選單與頁面視覺樣式皆已完成，本 Issue 只需替換資料來源與互動邏輯，對應 `docs/Architecture.md` 第 6、7 節。

### 驗收標準

- 頁面掛載時呼叫 `approval.store` 的 `fetchPendingApprovals`，載入中顯示 loading 狀態（沿用 `BaseTable` 的 `loading` prop）。
- 移除本地假資料（`PENDING_REQUESTS`、`STATS`）與寫死的 `PENDING_STATUS`，改為渲染 `approval.store` 的 `pendingRequests`；每筆顯示申請人姓名、假別、請假日期、天數、原因、目前狀態（使用既有 `LeaveStatusTag`），對應 PRD US-005「顯示所有待審核申請／顯示申請人姓名／顯示請假類型／顯示請假日期」。
- 點擊清單中的項目（桌面表格列或手機卡片）可查看該筆申請的完整詳細內容（申請人、假別、日期範圍、天數、原因），對應 PRD US-005「可點擊查看申請詳細內容」；以簡單的 `el-dialog` 呈現即可，不需另立路由或頁面。
- 核准與駁回為兩個獨立的操作入口；點擊後先透過既有的 `ConfirmDialog` 元件要求使用者二次確認，確認後才呼叫 `approval.store` 的 `approve`／`reject`，對應 PRD US-006「可以核准申請」「可以駁回申請」。
- 核准/駁回成功後顯示成功提示（`ElMessage.success`），該筆紀錄自畫面上的待審核清單移除，對應 PRD US-006「更新請假狀態」「操作完成後返回待審核列表」。
- 核准/駁回失敗時顯示錯誤訊息，該筆紀錄不自清單移除，以便使用者可重試。
- 待審核清單為空時顯示既有的 `EmptyState` 共用元件。
- 桌面表格（`BaseTable`）與手機卡片列表（既有 `@media (max-width: 767px)` 切換模式）皆套用上述真實資料與互動邏輯，維持既有響應式版面不變，不重做視覺樣式。
- 元件內不直接呼叫 Service 或 Axios，一律經由 `approval.store` 存取資料，符合分層規則。

### 標籤

`type:feature`、`area:ui`、`area:manager`、`sprint-3`

### 優先權

高

### 預計時間

8 小時

---

## Issue 6：Integration：Employee → Manager → Employee 端到端驗證

### 描述

串接路由、Store、Mock API 與 UI，驗證 US-005、US-006 的完整流程，並確認與 Sprint 2 既有的 Employee 流程正確銜接，作為 Sprint 3 最終整合驗收項目。路由與角色守衛已於 Sprint 1 建立完成（`MANAGER_APPROVAL` 路由、`roles: ['manager']` 守衛），本 Issue 不需新增路由設定。

### 驗收標準

- Manager 角色登入後，可透過 `DefaultLayout` 既有側邊選單導覽至「待審核」頁面；Employee／HR 角色無法存取（沿用 Sprint 1 既有角色守衛，不需調整）。
- 端到端驗證核准流程：Employee 登入送出一筆新的請假申請（US-003）→ Manager 登入待審核頁可看到該筆新申請（狀態為待審核、申請人姓名與假別正確）→ Manager 核准 → 該筆自待審核清單消失 → Employee 重新登入（或重新整理）查看請假紀錄頁（US-004），該筆狀態已正確更新為「已核准」。
- 端到端驗證駁回流程：比照上述流程，改為 Manager 駁回，Employee 端最終看到狀態為「已駁回」。
- `npm run lint`、`npm run build`、`npm run test` 皆需通過。
- 確認本 Sprint 未修改 `docs/Architecture.md`、未新增 HR（US-007、US-008）相關程式碼，且未加入 Email、Notification、Audit Log、多層簽核、WebSocket、即時更新、權限管理擴充等 PRD 未要求的功能。

### 標籤

`type:feature`、`area:manager`、`sprint-3`

### 優先權

高

### 預計時間

3 小時

---

## Sprint 3 總預估時間 ( Total Estimate )

2h + 4h + 2h + 3h + 8h + 3h = 22 小時
