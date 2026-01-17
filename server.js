const jsonServer = require("json-server");
const auth = require("json-server-auth");
const path = require("path");
const fs = require("fs");

const server = jsonServer.create();
const middlewares = jsonServer.defaults();

// --- 修改 1：統一資料庫路徑 ---
// 無論是本地或生產環境，直接讀取與 server.js 同目錄下的 db.json
// 注意：在容器化環境(如 Zeabur)若未掛載 Volume，重新部署後資料會重置
const dbPath = path.join(__dirname, "db.json");

// 確保 db.json 存在，若不存在則建立初始檔案
if (!fs.existsSync(dbPath)) {
  console.log("找不到 db.json，正在建立初始資料...");
  // 這裡放入你的預設資料結構
  const initialData = { users: [], trails: [], theme: [] };
  fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
}

const router = jsonServer.router(dbPath);

// 綁定資料庫路由 (json-server-auth 需要)
server.db = router.db;

// 設定預設中間件 (Logger, static, cors, no-cache)
server.use(middlewares);

// --- 修改 2：新增健康檢查端點 (Health Check) ---
// 必須放在 auth 和 router 之前，確保 Zeabur 隨時可以訪問
server.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

// 載入 json-server-auth 規則 (必須在 router 之前)
server.use(auth);

// 使用路由
server.use(router);

// --- 修改 3：Port 預設為 8080 ---
// 優先讀取環境變數 PORT，若無則使用 8080
const port = process.env.PORT || 8080;

// 綁定到 '0.0.0.0' 確保容器外可存取
server.listen(port, "0.0.0.0", () => {
  console.log(`JSON Server is running on port ${port}`);
});
