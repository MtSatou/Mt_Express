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

export default {
  openDb,
  saveDb,
} as const;
