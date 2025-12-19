const jsonServer = require("json-server");
const auth = require("json-server-auth");
const server = jsonServer.create();
// const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

// --- 關鍵修改：路徑處理 ---
// 在 Zeabur 上，我們會掛載 /data 資料夾。如果是本地開發，就用根目錄。
const isProd = process.env.NODE_ENV === "production";
const dbDirectory = isProd ? "/data" : path.join(__dirname);
const dbPath = path.join(dbDirectory, "db.json");

// 確保 db.json 存在，否則啟動會報錯 (如果是第一次掛載 Volume，裡面可能是空的)
if (!fs.existsSync(dbPath)) {
  console.log("找不到 db.json，正在建立初始資料...");
  const initialData = { users: [], trails: [], theme: [] }; // 這裡放你預設的資料結構
  fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
}

const router = jsonServer.router(dbPath);

// 綁定資料庫路由
server.db = router.db;

// 1. 設定預設中間件 (Logger, static, cors, no-cache)
server.use(middlewares);

// 2. 載入 json-server-auth 規則 (必須在 router 之前)
server.use(auth);

// 3. 使用路由
server.use(router);

// 啟動伺服器
// 關鍵修改：優先讀取環境變數 PORT，若無則預設 3000
const port = process.env.PORT || 3000;

// 建議綁定到 '0.0.0.0'，確保容器外可以存取
server.listen(port, "0.0.0.0", () => {
  console.log(`JSON Server is running on port ${port}`);
});
