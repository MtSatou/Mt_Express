import portfinder from "portfinder";
import session from "express-session";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import bodyParser from "body-parser";
import config from "@/config";
import useHttp from "./http";
import { ResolveType, Express } from "../types/server";

export const useServer = (app: Express) => {
  app.use(helmet());
  app.use(
    session({
      secret: "10000", // 用于对 session id 相关的加密密钥
      resave: false, // 是否在每次请求时都重新保存 session
      saveUninitialized: true, // 是否自动保存未初始化的 session
    })
  );
  app.use(rateLimit(config.net.rateLimit));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  useHttp(app);
  return new Promise<ResolveType>((resolve, reject) => {
    portfinder
      .getPortPromise({
        port: config.net.port,
        stopPort: config.net.stopPort,
      })
      .then((port) => {
        resolve({
          app,
          port,
          startingTime: Date.now() - config.net.startingTime,
        });
      })
      .catch((err) => reject({ err }));
  });
};
