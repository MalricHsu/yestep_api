// 引入必要的套件
const jsonServer = require("json-server");
const auth = require("json-server-auth");
const path = require("path"); // Node.js 內建，用來處理檔案路徑
const fs = require("fs"); // Node.js 內建，用來讀取與寫入檔案

const server = jsonServer.create();
const middlewares = jsonServer.defaults(); // 包含 Logger, Static, CORS 等功能

// --- [核心設定：資料庫路徑] ---
// 判斷當前環境：如果環境變數 NODE_ENV 為 production，代表在雲端 (Zeabur)
const isProd = process.env.NODE_ENV === "production";

// 設定資料夾：雲端使用 /data (持久化空間)，本地開發使用當前目錄 (__dirname)
const dbDirectory = isProd ? "/data" : __dirname;

// 組合出 db.json 的完整絕對路徑
const dbPath = path.join(dbDirectory, "db.json");

// --- [核心設定：自動初始化] ---
// 當 Zeabur 第一次掛載空白硬碟時，/data 裡可能沒檔案，這段會自動補齊結構避免當機
if (!fs.existsSync(dbPath)) {
  console.log("⚠️ 偵測到環境中無資料庫檔案，正在初始化基本結構...");
  const initialData = {
    users: [],
    trails: [],
    theme: [],
    reviews: [],
    favorites: [],
    itinerary: [],
  };
  // 將結構轉為 JSON 字串並寫入檔案，格式化縮進為 2 格
  fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
}

// --- [核心設定：路由與權限] ---
// 1. 初始化資料庫路由
const router = jsonServer.router(dbPath);

// 2. 將資料庫實例綁定到 server 上，這是 json-server-auth 的要求
server.db = router.db;

// 3. 使用預設中間件 (一定要在最前面)
server.use(middlewares);

// 4. 使用 json-server-auth 權限驗證 (一定要在 router 之前)
server.use(auth);

// 5. 最後才掛載正式的資料路由
server.use(router);

// --- [啟動伺服器] ---
// 優先讀取 Zeabur 給予的 Port，若無則預設 3000 (本地開發用)
const port = process.env.PORT || 3000;

// 關鍵點：一定要監聽 '0.0.0.0'，這代表接受來自容器外部的所有連線
server.listen(port, "0.0.0.0", () => {
  console.log(`🚀 步道系統後端啟動成功！`);
  console.log(`📡 目前 Port：${port}`);
  console.log(`📂 目前資料庫檔案位置：${dbPath}`);
});

function Child({ posts }) {
  return posts.map((post) => {
    return (
      <li>
        <h3>{post.title}</h3>
        <p>{post.body}</p>
      </li>
    );
  });
}
