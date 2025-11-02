import jsonfile from 'jsonfile';
import path from 'path';
import { writeJsonSafe, ensureJsonFile } from '@src/util/fs';
import { IVerificationCode } from '@src/types/verification';

const VERIFICATION_DB_FILE = '../../db/verifications.json';

interface IVerificationDb {
  codes: IVerificationCode[];
}

/** 读取验证码记录 json */
async function openDb(): Promise<IVerificationDb> {
  const fp = path.join(__dirname, VERIFICATION_DB_FILE);
  await ensureJsonFile(fp, { codes: [] });
  const db: any = await jsonfile.readFile(fp);
  if (!db.codes) db.codes = [];
  return db as IVerificationDb;
}

/** 写入验证码记录 json */
async function saveDb(db: IVerificationDb): Promise<void> {
  const fp = path.join(__dirname, VERIFICATION_DB_FILE);
  if (!db.codes) db.codes = [];
  await writeJsonSafe(fp, db);
}

export default {
  openDb,
  saveDb,
} as const;
