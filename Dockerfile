# 使用輕量級的 Node.js 20 版本
FROM node:20-alpine

# 設定工作目錄
WORKDIR /app

# 先複製 package 設定檔 (利用 Docker 快取機制加速部署)
COPY package*.json ./

# 安裝依賴 (使用 ci 比 install 更乾淨穩定)
RUN npm ci --only=production

# 複製所有程式碼到容器內
COPY . .

# 設定環境變數 (告訴程式這是正式環境)
ENV NODE_ENV=production
# 告訴 Zeabur 我們會用 3000 Port
ENV PORT=3000

# 開放 Port
EXPOSE 3000

# 啟動指令
CMD ["npm", "start"]