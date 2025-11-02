import jsonfile from 'jsonfile';
import path from 'path';
import { writeJsonSafe, ensureJsonFile } from '@src/util/fs';
import { IUploadedFile } from '@src/types/upload';

const UPLOAD_DB_FILE = '../../db/uploads.json';

interface IUploadDb {
  uploads: IUploadedFile[];
}

/** 读取上传记录 json */
async function openDb(): Promise<IUploadDb> {
  const fp = path.join(__dirname, UPLOAD_DB_FILE);
  await ensureJsonFile(fp, { uploads: [] });
  const db: any = await jsonfile.readFile(fp);
  if (!db.uploads) db.uploads = [];
  return db as IUploadDb;
}

/** 写入上传记录 json */
async function saveDb(db: IUploadDb): Promise<void> {
  const fp = path.join(__dirname, UPLOAD_DB_FILE);
  if (!db.uploads) db.uploads = [];
  await writeJsonSafe(fp, db);
}

export default {
  openDb,
  saveDb,
} as const;
