# 設計系統｜員工請假系統視覺重新設計

本文件記錄 2026-07 這次全站視覺重新設計的決策與規格，涵蓋桌面版與響應式（手機）版。設計稿以 Pencil 繪製，原始 `.pen` 檔案存放於 `docs/design/employee-leave-system.pen`（可用 Pencil App 開啟瀏覽）。

## 設計參考與定位

參考 [Venus Admin Template（semi-dark 版型）](https://venus-admin-template.multipurposethemes.com/main-semidark/index4.html) 的整體結構：深色側邊欄＋淺色頂欄＋卡片式內容區。但配色與字體並未照抄——請假系統的主題是「休息與人性化的假期管理」，因此刻意避開一般後台常見的冷色調 KPI 儀表板風格，改用偏溫暖、沉穩的識別系統。

三種角色（Employee／Manager／HR）共用同一套設計系統與版面骨架（側邊欄＋頂欄＋內容卡片），差異只在導覽項目與頁面內容。

## 色彩 Token

| Token 名稱 | Hex | 用途 |
|---|---|---|
| `ink` | `#141A2E` | 側邊欄、深色卡片背景 |
| `ink-soft` | `#1F2742` | 深色背景上的次要底色（如選單 active 底色） |
| `canvas` | `#F4F5F9` | 頁面背景 |
| `surface` | `#FFFFFF` | 卡片／輸入框背景 |
| `teal`（品牌主色） | `#0F8B8D` | 主要按鈕、連結、選單 active 圖示、Element Plus primary |
| `teal-soft` | `#E3F2F1` | 主色的淺底色（icon chip 底色） |
| `amber`（簽名重點色） | `#F2994A` | LeaveRing 進度環、待審核狀態 |
| `amber-soft` | `#FDEDE0` | 待審核狀態底色 |
| `coral` | `#E4572E` | 危險／已拒絕狀態、刪除操作 |
| `coral-soft` | `#FBE7E1` | 已拒絕狀態底色 |
| `moss` | `#2E9E6D` | 成功／已核准狀態 |
| `moss-soft` | `#E2F3EB` | 已核准狀態底色 |
| `text-primary` | `#1C2237` | 主要文字（淺色背景上） |
| `text-secondary` | `#6B7280` | 次要文字 |
| `text-inverse` | `#F4F5F9` | 深色背景上的主要文字 |
| `text-muted-inverse` | `#8A93B3` | 深色背景上的次要文字 |
| `border` | `#E5E7F0` | 卡片邊框、分隔線 |

實作對應 `src/styles/tokens.css`，並覆蓋 Element Plus 的 `--el-color-primary`／`--el-color-success`／`--el-color-warning`／`--el-color-danger`，讓 `el-tag`、`el-button` 等元件自動套用新色票，不需逐一改元件。

## 字體

- **標題／大數字**：Noto Serif TC（襯線字）——刻意的風格選擇，讓整體介面少一點「後台軟體感」、多一點溫度，用於頁面標題、Hero 數字、品牌 Logotype。
- **內文／介面文字**：Noto Sans TC（無襯線）——用於內文、表單、表格、按鈕、選單等高密度資訊區域，確保可讀性。
- 兩者皆透過 Google Fonts 載入（見 `index.html`），中文襯線標題搭配無襯線內文是本次設計唯一的「風格冒險」。

## 間距與圓角

- 間距單位：8px 基準（8 / 12 / 20 / 32）。
- 卡片圓角：14px；控制項（按鈕／輸入框）圓角：8px；徽章（Badge）：全圓角。
- 陰影：僅用於卡片，克制使用（避免過度堆疊陰影與圓角，維持後台工具應有的俐落感）。

## 簽名視覺：LeaveRing（假期圓環）

整套設計唯一重複出現、用來建立記憶點的元素。以琥珀色（`amber`）進度環呈現「剩餘／總額」比例，取代參考模板中泛用的「營收圓環」。出現位置：

- 登入頁品牌面板（裝飾性，顯示示範帳號的年假餘額）
- Employee／剩餘假期：Hero 卡片主視覺
- Employee／申請請假：側邊「目前年假餘額」小卡，即時反映本次申請後的剩餘天數
- 手機版對應位置皆等比例縮小重用

實作為 `src/components/LeaveRing.vue`，以 SVG `<circle>` + `stroke-dasharray` 繪製，支援任意 `size` 與 `light`／`dark` 兩種底色變體，避免 Pencil 原型中「固定像素子物件縮放時互相重疊」的問題（設計階段已發現並修正此問題，詳見下方「已知問題與修正」）。

## 版面骨架

### 桌面版（≥768px）

- 側邊欄：固定寬度 240px，`ink` 底色，品牌 Logo + 依角色顯示的導覽項目（Employee／Manager／HR 各自的選單），當前頁面以 `ink-soft` 底色＋`amber` 圖示標示。
- 頂欄：白底，左側頁面標題（Noto Serif TC），右側使用者資訊 + 登出。
- 內容區：`canvas` 底色，卡片式區塊，統一 32px 內距。

### 響應式（<768px）

- 側邊欄改為 **off-canvas 抽屜**：預設隱藏，頂欄左側漢堡選單觸發滑出，滑出時內容區加上半透明深色遮罩，點擊遮罩或選單項目後自動收合。這取代了舊版「側邊欄收合為 64px 圖示列」的做法，讓手機版有完整寬度可用。
- 頂欄：隱藏使用者姓名與大頭貼，僅保留標題與登出圖示，避免擁擠。
- 統計卡片／表格：由多欄改為單欄堆疊；表格（請假紀錄、審核清單、HR 總覽）在手機版改為「卡片列表」呈現（每筆紀錄一張卡片），取代原本的橫向表格捲動，避免小螢幕上表格可讀性不佳的問題。

## 頁面清單與設計重點

| 頁面 | 路由 | 設計重點 |
|---|---|---|
| 登入頁 | `/login` | 左右分割版面：左側 `ink` 品牌面板（Logo、LeaveRing 裝飾、標語），右側白底表單卡片。手機版堆疊為上下結構。 |
| Employee／剩餘假期 | `/employee/leave-balance` | 年假以 Hero Ring 呈現，病假／事假以統計卡呈現，取代原本三張等重卡片的排列。 |
| Employee／申請請假 | `/employee/leave-request` | 表單卡 + 右側「目前年假餘額」小卡（LeaveRing），讓使用者送出申請前就能看到餘額對照。 |
| Employee／請假紀錄 | `/employee/leave-history` | 沿用既有 `BaseTable`，重新套用狀態徽章色票；手機版改為卡片列表。 |
| Manager／待審核 | `/manager/approval` | 3 張統計卡（待審核／本月核准／本月拒絕）+ 審核清單，每列附「核准」「拒絕」操作按鈕。目前資料為靜態示意，尚未接上 Store／Service（US-005 尚未排入 Sprint）。 |
| HR／請假紀錄總覽 | `/hr/leave-records` | 搜尋欄 + 狀態篩選 + 全公司請假紀錄表格。目前資料為靜態示意（US-007 尚未排入 Sprint）。 |
| HR／假別管理 | `/hr/leave-types` | 假別清單卡片 + 新增／編輯／刪除操作入口。目前資料為靜態示意（US-008 尚未排入 Sprint）。 |

> **重要說明**：Manager／HR 三個頁面在程式碼中原本就是待實作的 placeholder（`US-005`／`US-007`／`US-008` 尚未排入 Sprint，無對應 Store／Service／MSW handler）。這次重新設計只套用了新的視覺樣式與版面骨架、以卡片列表呈現示意資料，**沒有**為此新增 Store、Service 或 Pinia 狀態管理，避免違反 `CLAUDE.md` 中「不為尚未排入的 Sprint 需求預先設計抽象層」的原則。待對應 Sprint 排入這些 User Story 時，再依驗收標準把示意資料替換為真實的 Store／Service 串接。

## 已知問題與修正紀錄

- **LeaveRing 縮放錯誤**：Pencil 原型中的圓環元件在縮小尺寸實例化時（登入頁裝飾用小圓環、申請請假頁側邊卡片），內部圖形因使用固定像素尺寸，未隨外框縮放，導致視覺上蓋住旁邊文字。已在設計稿中修正；程式碼實作改以 SVG `viewBox` + 相對座標繪製，從架構上避免此類縮放問題重現。

## 檔案對照

- 設計稿原始檔：`docs/design/employee-leave-system.pen`
- 設計 Token 實作：`src/styles/tokens.css`
- 簽名元件實作：`src/components/LeaveRing.vue`
