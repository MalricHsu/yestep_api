const jsonServer = require("json-server");
const auth = require("json-server-auth");
const path = require("path");
const fs = require("fs");
const server = jsonServer.create();
const middlewares = jsonServer.defaults();
// --- 修改 1：統一資料庫路徑 ---
// 無論是本地或生產環境，直接讀取與 server.js 同目錄下的 db.json
const dbPath = path.join(__dirname, "db.json");
// 確保 db.json 存在，若不存在則建立初始檔案
if (!fs.existsSync(dbPath)) {
  console.log("找不到 db.json，正在建立初始資料...");
  const initialData = {
    users: [],
    trails: [],
    theme: [],
    favorites: [],
    itinerary: [],
  };
  fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
}
const router = jsonServer.router(dbPath);
// 綁定資料庫路由
server.db = router.db;
// 設定預設中間件
server.use(middlewares);
// --- 修改 2：新增健康檢查端點 ---
server.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});
// 載入 json-server-auth 規則
server.use(auth);
// 使用路由
server.use(router);
// --- 修改 3：Port 預設為 8080 ---
const port = process.env.PORT || 8080;
server.listen(port, "0.0.0.0", () => {
  console.log(`JSON Server is running on port ${port}`);
});
