# Prompt Library

本文件整理本專案使用的 Claude Code Prompts。

---

## Prompt-001

### 名稱(Name)

PRD Review

### 目的(Purpose)

在開發之前評審產品需求文件。 Review Product Requirement Document before development.

### 提示(PRD Review Prompt)

```
請同時擔任以下角色：

1. 資深產品經理

2. 高階前端技術負責人

請仔細閱讀以下產品需求文件 (PRD)。

您的任務如下：

1. 評估 PRD 是否完整。

2. 識別缺失的業務需求。

3. 辨識缺失的使用者故事。

4. 辨識相互衝突的需求。

5. 提出改進建議。

6. 檢查最小可行產品 (MVP) 的範圍是否合理。

7. 檢查使用者故事是否可以直接轉換為 GitHub Issues。

8. 識別技術風險。

9. 提出推薦的前端模組架構。

請以 Markdown 格式輸出，並包含以下部分：

# PRD 審核

## 總體評分 (0~100)

## 優勢

## 缺失的需求

## 潛在風險

## 改進建議

## 推薦的模組結構

請勿編寫任何程式碼。

請專注於產品分析。
```

### Result

產出：

- 整體評分 Overall Score
- 缺失的需求 Missing Requirements
- 風險 Risks
- 建議的改進 Suggested Improvements

### 決定(Decision)

已接受 Accepted

- 專案範圍 Project Scope
- 部署策略 Deployment Strategy
- 完整的使用者故事 Complete User Stories

已拒絕 Rejected

- 勞動法規則 Labor Law Rules
- 電子郵件通知 Email Notification
- 審計日誌 Audit Log
- 多級審批 Multi-level Approval

原因 Reason

這些功能超出了MVP的範圍 These features are out of MVP scope.

---

## Prompt-002

### 名稱(Name)

PRD Revision

### 目的(Purpose)

根據 PRD Review（Prompt-001）的審核結果，修訂並補全產品需求文件，產出 PRD v1.1。 Revise and complete the PRD based on the review findings from Prompt-001, producing PRD v1.1.

### 提示(PRD Revision Prompt)

```
請根據以下「PRD 審核報告」的內容，修訂目前的產品需求文件（PRD v1.0），產出新版本 PRD v1.1。

請依照以下原則進行修訂：

1. 針對審核報告中「潛在風險」提到的技術棧與部署方式衝突，明確將本專案定位為 Portfolio Demo 專案，前端資料來源改為 Mock API（Mock Service Worker / MSW），並在文件開頭新增「專案範圍」章節說明此定位。

2. 補齊 US-004 至 US-008 五則使用者故事，每則須包含：角色、使用者故事、驗收標準、優先權、依賴項，格式比照 US-001～003。

3. 依照先前已決定的 MVP 範圍，以下功能維持排除，不需在本版補上對應需求或使用者故事：
   - 勞動法規則（特休／病假年資計算）
   - 電子郵件通知
   - 審計日誌（Audit Log）
   - 多級審批

4. 功能需求、非功能需求、UI/UX 需求、API 需求、驗收標準、里程碑等章節，若尚未有足夠資訊定案，可維持章節標題保留、內容留待下一版補充，不需臆測填寫。

5. 版本號更新為 1.1.0。

請直接輸出修訂後的完整 Markdown 文件。
```

### Result

產出：

- PRD v1.1（docs/PRD v1.1.md）
- 補齊 US-004～008 五則使用者故事
- 新增「專案範圍」章節，釐清 Portfolio Demo 定位
- 部署策略明確化為 GitHub Pages（Portfolio Demo）＋ Mock API（MSW）

### 決定(Decision)

已接受 Accepted

- 完成 US-004～008 五要素（角色／故事／驗收標準／優先權／依賴項）
- 新增專案範圍章節，明確技術展示與 Demo 定位
- 明確 Mock API（MSW）作為資料來源，化解部署方式與功能需求之間的衝突

延後 Deferred

- 功能需求／非功能需求／UI/UX 需求／API 需求／驗收標準／里程碑：維持章節標題保留，內容留待後續版本補充

已拒絕 Rejected（沿用 Prompt-001 決定）

- 勞動法規則
- 電子郵件通知
- 審計日誌
- 多級審批

原因 Reason

這些功能超出了 MVP 的範圍 These features are out of MVP scope.

### 備註(Note)

本 Prompt 內容係依據 PRD v1.0 → v1.1 的實際文件差異，以及 AI-PRD-Review v1.0 的「改進建議」與「決定」章節回溯重建，非原始逐字使用記錄。
