import express from "express";
import { useServer } from "@/server";
import log from "@/utils/log";
const app = express();

useServer(app)
  .then(({ app, port, startingTime }) => {
    app.listen(port, () => {
      log.success(`start local: `, `http://localhost:${port}`);
      log.success(`start timer: `, `${startingTime} ms`);
    });
  })
  .catch(({ err }) => {
    console.error("无法启动服务器:", err);
  });

export default app;
