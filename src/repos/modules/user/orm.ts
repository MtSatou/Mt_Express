import jsonfile from 'jsonfile';
import { IUser } from '@src/types/user';

const DB_FILE_NAME = '../../db/database.json';

// **** Types **** //
interface IDb {
  users: IUser[];
}

/**
 * 读取json
 */
function openDb(): Promise<IDb> {
  return jsonfile.readFile(__dirname + '/' + DB_FILE_NAME) as Promise<IDb>;
}

/**
 * 写入json
 */
function saveDb(db: IDb): Promise<void> {
  return jsonfile.writeFile((__dirname + '/' + DB_FILE_NAME), db);
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
