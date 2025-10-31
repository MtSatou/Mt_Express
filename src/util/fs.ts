import fs from 'fs';
import path from 'path';
import jsonfile from 'jsonfile';

/**
 * 确保指定文件存在；如果目录不存在则创建目录；如果文件不存在则写入 initialData（或空对象）
 */
export async function ensureJsonFile(filePath: string, initialData: unknown = {}): Promise<void> {
  const dir = path.dirname(filePath);
  await fs.promises.mkdir(dir, { recursive: true });
  try {
    await fs.promises.access(filePath, fs.constants.F_OK);
  } catch {
    await jsonfile.writeFile(filePath, initialData);
  }
}

/**
 * 安全写入 JSON 文件：先确保目录存在，再写入（覆盖）
 */
export async function writeJsonSafe(filePath: string, data: unknown): Promise<void> {
  const dir = path.dirname(filePath);
  await fs.promises.mkdir(dir, { recursive: true });
  return jsonfile.writeFile(filePath, data);
}

export default {
  ensureJsonFile,
  writeJsonSafe,
};
