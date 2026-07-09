# 員工請假系統 (Employee Leave System)

作品集演示專案（Portfolio Demo），模擬企業內部的請假申請與審核流程，涵蓋 Employee／Manager／HR 三種角色。無真實後端，資料來源為 Mock API（MSW）。

## 技術棧

- Vue 3 + TypeScript
- Vite
- Pinia（狀態管理）
- Vue Router
- Element Plus（UI 元件庫）
- Axios（HTTP Client）
- ESLint + Prettier（程式碼品質與格式化）

## 開發

```bash
npm install
npm run dev
```

## 常用指令

| 指令                   | 說明                             |
| ---------------------- | -------------------------------- |
| `npm run dev`          | 啟動本機開發伺服器               |
| `npm run build`        | 型別檢查並建置正式版             |
| `npm run preview`      | 預覽建置後的成果                 |
| `npm run lint`         | 執行 ESLint 檢查                 |
| `npm run lint:fix`     | 執行 ESLint 並自動修復可修復問題 |
| `npm run format`       | 使用 Prettier 格式化所有檔案     |
| `npm run format:check` | 檢查檔案是否符合 Prettier 格式   |

## 文件

- [PRD](docs/PRD%20v1.1.md)
- [前端架構設計文件](docs/Architecture.md)
