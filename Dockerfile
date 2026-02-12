# 1. 使用 Node.js 20 輕量版
FROM node:20-alpine

# 2. 設定工作目錄
WORKDIR /app

# 3. 複製 package 設定檔
COPY package*.json ./

# 4. 安裝依賴 (使用 ci 確保乾淨安裝，解決找不到模組的問題)
RUN npm ci --only=production

# 5. 複製所有程式碼
COPY . .

# 6. 【關鍵】設定環境變數 PORT 為 8080 (配合 Zeabur)
ENV PORT=8080
ENV NODE_ENV=production

# 7. 開放 8080 Port
EXPOSE 8080

# 8. 啟動
CMD ["npm", "start"]