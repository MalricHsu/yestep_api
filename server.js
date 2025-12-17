const jsonServer = require("json-server");
const auth = require("json-server-auth");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

// 綁定資料庫路由
server.db = router.db;

// 1. 設定預設中間件 (Logger, static, cors, no-cache)
server.use(middlewares);

// 2. 載入 json-server-auth 規則 (必須在 router 之前)
server.use(auth);

// 3. 使用路由
server.use(router);

// 啟動伺服器
server.listen(3000, () => {
  console.log("JSON Server is running on http://localhost:3000");
});
