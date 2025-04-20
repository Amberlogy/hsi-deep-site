# HSI深度分析平台

這是一個使用 Next.js、TypeScript 和 Tailwind CSS 構建的香港股市深度分析平台。

## 功能概述

- 最新策略推薦：展示三個策略標題與簡述
- 即時恆指總覽：顯示恒生指數報價、漲跌與漲跌幅
- 今日市場摘要：市場圖表與摘要信息
- 推薦熱股：熱門股票名稱與價格變動
- 熱門板塊入口：展示五個分類按鈕，連結到「Sector Radar」頁

## 安裝與運行

### 環境要求

- Node.js 18.0 或更高版本
- npm 或 yarn

### 安裝步驟

1. 克隆此倉庫

   ```bash
   git clone <repository-url>
   cd hsi-deep-site
   ```

2. 安裝依賴

   ```bash
   npm install
   # 或
   yarn install
   ```

3. 啟動開發服務器

   ```bash
   npm run dev
   # 或
   yarn dev
   ```

4. 打開瀏覽器，訪問 [http://localhost:3000](http://localhost:3000)

## 技術架構

- **前端框架**：Next.js 14
- **語言**：TypeScript
- **樣式**：Tailwind CSS
- **部署**：Vercel (推薦)

## 頁面結構

- `/` - 首頁
- `/market-overview` - 市場總覽
- `/sector-radar` - 活躍板塊分析
- `/star-stocks` - 明星股分析
- `/technical-analysis` - 深度技術分析
- `/candlestick-ai` - 陰陽燭辨識
- ...其他頁面

## 許可證

MIT
