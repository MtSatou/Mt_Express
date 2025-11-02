import orm from './orm';
import { IUploadedFile } from '@src/types/upload';

/** 获取自增 id */
async function nextId(): Promise<number> {
  const db = await orm.openDb();
  const maxId = db.uploads.reduce((m, f) => Math.max(m, Number(f.id) || 0), 0);
  return maxId + 1;
}

/** 保存上传文件记录 */
async function add(record: Omit<IUploadedFile, 'id'>): Promise<IUploadedFile> {
  const db = await orm.openDb();
  const id = await nextId();
  const uploadRecord: IUploadedFile = {
    id,
    ...record,
  };
  db.uploads.push(uploadRecord);
  await orm.saveDb(db);
  return uploadRecord;
}

/** 通过 id 获取上传记录 */
async function getById(id: number): Promise<IUploadedFile | null> {
  const db = await orm.openDb();
  return db.uploads.find(u => Number(u.id) === Number(id)) || null;
}

/** 获取用户的所有上传记录 */
async function getAllByUserId(userId: number): Promise<IUploadedFile[]> {
  const db = await orm.openDb();
  return db.uploads.filter(u => Number(u.userId) === Number(userId));
}

/** 删除上传记录 */
async function deleteById(id: number): Promise<boolean> {
  const db = await orm.openDb();
  const idx = db.uploads.findIndex(u => Number(u.id) === Number(id));
  if (idx >= 0) {
    db.uploads.splice(idx, 1);
    await orm.saveDb(db);
    return true;
  }
  return false;
}

export default {
  add,
  getById,
  getAllByUserId,
  deleteById,
} as const;
