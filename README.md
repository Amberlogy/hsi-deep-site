# HSI深度分析平台

這是一個使用 Next.js、TypeScript 和 Tailwind CSS 構建的香港股市深度分析平台。

## 功能概述

- 最新策略推薦：展示三個策略標題與簡述
- 即時恆指總覽：顯示恒生指數報價、漲跌與漲跌幅
- 今日市場摘要：市場圖表與摘要信息
- 推薦熱股：熱門股票名稱與價格變動
- 熱門板塊入口：展示五個分類按鈕，連結到「Sector Radar」頁

## 線上演示

訪問我們的線上演示網站：[HSI深度分析平台](https://hsi-deep-site-agnblz4qk-ambers-projects-242e116b.vercel.app)

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
- **圖表庫**：Recharts
- **部署**：Vercel

## 部署指南

本專案已配置為可以在 Vercel 上輕鬆部署：

1. 安裝 Vercel CLI: `npm install -g vercel`
2. 登入 Vercel: `vercel login`
3. 在專案根目錄執行: `vercel`
4. 部署到生產環境: `vercel --prod`

## 常見問題解決

如果部署時出現「Module not found: Can't resolve 'recharts'」錯誤：

1. 確認 recharts 已安裝: `npm install --save recharts`
2. 檢查 package.json 中是否有 recharts 依賴
3. 使用 `--force` 參數重新部署: `vercel --prod --force`
4. 添加 vercel.json 配置文件，自定義安裝命令:

   ```json
   {
     "version": 2,
     "buildCommand": "npm install --legacy-peer-deps && npm run build",
     "builds": [
       {
         "src": "package.json",
         "use": "@vercel/next",
         "config": {
           "installCommand": "npm install --legacy-peer-deps",
           "nodeVersion": "20.x"
         }
       }
     ]
   }
   ```

5. 在 next.config.js 中添加 transpilePackages 配置:

   ```js
   transpilePackages: ['recharts']
   ```

6. 創建 .npmrc 文件來設置 npm 配置:

   ```ini
   legacy-peer-deps=true
   prefer-offline=true
   force=true
   ```

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
