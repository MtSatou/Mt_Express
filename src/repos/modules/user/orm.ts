import jsonfile from 'jsonfile';
import { IUser } from '@src/types/user';
import { writeJsonSafe, ensureJsonFile } from '@src/util/fs';
import path from 'path';

const DB_FILE_NAME = '../../db/database.json';

// **** Types **** //
interface IDb {
  users: IUser[];
}

/**
 * 读取json
 */
function openDb(): Promise<IDb> {
  const fp = path.join(__dirname, DB_FILE_NAME);
  return ensureJsonFile(fp, { users: [] }).then(() => jsonfile.readFile(fp) as Promise<IDb>);
}

/**
 * 写入json
 */
async function saveDb(db: IDb): Promise<void> {
  const fp = path.join(__dirname, DB_FILE_NAME);
  await writeJsonSafe(fp, db);
}

/** 返回数据库文件的绝对路径（便利函数） */
function dbFilePath(): string {
  return __dirname + '/' + DB_FILE_NAME;
}

/** lock 文件路径 */
function lockFilePath(): string {
  return dbFilePath() + '.lock';
}

export default {
  openDb,
  saveDb,
  dbFilePath,
  lockFilePath,
} as const;
