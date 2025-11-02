import multer from 'multer';
import path from 'path';
import fs from 'fs';

// 上传文件存储目录
const UPLOAD_DIR = path.join(__dirname, '../../../uploads');

// 确保上传目录存在
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/** 生成唯一的文件名：日期 + 时间戳 + 随机数 */
function generateFileName(originalName: string): string {
  const ext = path.extname(originalName);
  const timestamp = Date.now();
  const date = new Date();
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${dateStr}_${timestamp}_${random}${ext}`;
}

// 配置 multer 存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // 确保文件名使用 UTF-8 编码
    const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    const storedName = generateFileName(originalName);
    cb(null, storedName);
  },
});

// 文件过滤器（可选：限制文件类型）
const fileFilter = (req: any, file: any, cb: any) => {
  // 这里可以添加文件类型验证
  // 例如：只允许图片
  // const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
  // if (allowedMimes.includes(file.mimetype)) {
  //   cb(null, true);
  // } else {
  //   cb(new Error('不支持的文件类型'), false);
  // }
  
  // 目前允许所有类型
  cb(null, true);
};

// 配置 multer（限制文件大小：50MB）
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

export default upload;
export { UPLOAD_DIR };
