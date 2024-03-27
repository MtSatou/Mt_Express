import { Express } from "express";
import multer from "multer";
import config from "@/config";

const upload = multer({ dest: "uploads/" });

const useHttp = (app: Express) => {
  // http://localhost:5000/
  app.get("/", (req, res) => {
    if ((req.session as any).count) {
      (req.session as any).count += 1;
    } else {
      (req.session as any).count = 1;
    }

    res.send(`
      欢迎使用 Mt_Express <br/>
      你已访问：${(req.session as any).count} 次, 将在${
        config.net.rateLimit.limit
      }次后禁止访问
    `);
  });

  // http://localhost:5000/post-json
  app.post("/post-json", (req, res) => {
    var comment = req.body;
    console.log("/post-json: ", comment);
    res.send({
      msg: "接收到了",
      data: comment,
    });
  });

  // http://localhost:5000/post-formData
  app.post("/post-formData", upload.single("file"), (req, res) => {
    var comment = req.file;
    console.log("/post-formData: ", comment);
    res.send({
      msg: "接收到了",
      data: comment
    });
  });
};

export default useHttp;
