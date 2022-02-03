require("dotenv").config();
import http from "http";
import getApp from "./app";

const app = getApp();
const port = 9000;
const ip = "127.0.0.1";

const server = http.createServer(app);
server.listen(port, ip, function () {
  console.log(
    "Express server listening on %d, in %s mode",
    port,
    app.get("env")
  );
});
