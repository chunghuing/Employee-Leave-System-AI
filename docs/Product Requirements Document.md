# 📄 產品需求文檔 ( Product Requirements Document )

## 項目概述 ( Project Overview )

專案名稱：員工請假系統

版本：1.0.0

狀態：規劃中

技術棧：

前端

- Vue 3
- Vite
- TypeScript
- Pinia
- Vue Router
- Element Plus

開發流程

- Claude Code
- GitHub
- GitHub MCP
- Notion
- Notion MCP

部署

- GitHub Pages

項目描述：

Employee Leave System 是一套公司內部請假管理系統，目的是將傳統以 Excel、Email 或紙本為主的請假流程數位化。

系統提供員工線上申請請假、查詢請假紀錄與剩餘假別，主管可線上審核請假申請，HR 可管理請假資料與統計報表。

本專案除了展示 Vue3 前端開發能力，也展示如何將 Claude Code、Notion MCP 與 GitHub MCP 導入軟體開發流程，建立 AI-Driven Development Workflow。

## 商業背景 ( Business Background )

目前流程

目前公司請假流程：

1. 員工填寫請假單（Excel）
2. Email 或 LINE 通知主管
3. 主管回覆是否同意
4. HR 手動更新請假紀錄
5. 員工需要另外詢問剩餘假別

現有問題：

目前流程存在以下問題：

1. 流程分散於 Excel、Email、LINE 等不同工具。
2. HR 需要手動更新資料，容易發生錯誤。
3. 員工無法即時查詢剩餘假別。
4. 主管無法快速查看待審核案件。
5. 缺乏歷史紀錄與統計分析。

預期解決方案：

建立一套 Web 系統，整合請假申請、審核、查詢與管理功能，讓員工、主管與 HR 都能透過同一平台完成請假流程，提升作業效率並降低人工錯誤。

## 專案目標 ( Project Goals )

業務目標

1. 提升請假流程效率。
2. 降低 HR 人工維護成本。
3. 建立完整請假紀錄。
4. 提高主管審核效率。

技術目標

1. 使用 Vue3 + TypeScript 建立前端。
2. 採用模組化架構。
3. 使用 Pinia 管理狀態。
4. 支援 Responsive Design。
5. 展示 AI 導入軟體開發流程。

## 目標用戶 ( Target Users )

Employee（員工）

```markdown
### 員工

**描述**

員工是系統的主要使用者。他們提交請假申請、查詢剩餘假期餘額和查看請假記錄。

**職責**

- 提交請假申請。

- 查看請假紀錄。

- 查詢剩餘假期餘額。

**目標**

- 輕鬆申請請假。

- 了解請假審批狀態。

- 隨時查看剩餘假期天數。

**痛點**

- 紙本申請不便。

- 需要向人力資源部查詢剩餘假期餘額。

- 難以追蹤請假審批進度。

```

Manager（主管）

```markdown
### 主管

**職位說明**

經理負責審核和批准員工的請假申請。

**職責**

- 審核請假申請。

- 批准或拒絕請假申請。

**目標**

- 快速審核請假申請。

- 了解團隊的休假安排。

**痛點**

- 請假申請分散在電子郵件和聊天工具。

- 難以找到待審批的申請。
```

HR（人資）

```markdown
### 人力資源部

**職位說明**

人力資源部負責管理員工休假政策並維護休假記錄。

**職責**

- 管理休假記錄。

- 維護休假類型。

- 產生休假報告。

**目標**

- 減少人工操作。

- 提高數據準確性。

**痛點**

- 手動更新 Excel 表格非常耗時。

- 人為錯誤風險高。
```

## 使用者故事 ( User Stories )

US-001 User Login

```markdown
### US-001 使用者登入

**角色**

員工

**使用者故事**

作為一名員工，

我希望登入請假管理系統，

以便存取我的個人請假資訊。

**驗收標準**

- 使用者可以輸入帳號和密碼。

- 使用正確的憑證登入成功。

- 如果憑證錯誤，則顯示錯誤訊息。

- 使用者成功登入後，將被重新導向到控制面板。

**優先權**

高

**依賴項**

無
```

User Story 2：查看剩餘假別

```markdown
### US-002 查看剩餘假期

**角色**

員工

**使用者故事**

作為一名員工，

我希望查看我的剩餘假期餘額，

以便了解我還能使用多少假期。

**驗收標準**

- 顯示年假。

- 顯示病假。

- 顯示事假。

**優先權**

高

**依賴項**

US-001
```

User Story 3：建立請假單

```markdown
### US-003 提交請假申請

**角色**

員工

**使用者故事**

作為一名員工，

我希望提交一份請假申請，

以便我的經理可以審核。

**驗收標準**

- 選擇請假類型。

- 選擇開始日期。

- 選擇結束日期。

- 輸入請假原因。

- 提交前進行驗證。

- 請假申請創建成功。

**優先權**

高

**依賴項**

US-001
```

User Story 4：查看請假紀錄

```markdown
員工 (Employee)
```

User Story 5：主管查看待審核

```markdown
主管 (Manager)
```

User Story 6：主管核准

```markdown
主管 (Manager)
```

User Story 7：HR 查看全部

```markdown
人資 (HR)
```

User Story 8：HR 管理假別

```markdown
人資 (HR)
```

## 功能需求 ( Functional Requirements )

## 非功能需求 ( Non-functional Requirements )

## 使用者介面/使用者體驗需求 ( UI / UX Requirements )

## API需求 ( API Requirements )

## 驗收標準 ( Acceptance Criteria )

## 里程碑 ( Milestones )