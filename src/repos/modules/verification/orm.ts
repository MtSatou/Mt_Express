import jsonfile from 'jsonfile';
import path from 'path';
import baseUrl from '@src/util/baseUrl';
import { writeJsonSafe, ensureJsonFile } from '@src/util/fs';
import { IVerificationCode } from '@src/types/verification';

const VERIFICATION_DB_FILE = baseUrl + 'db/verifications.json';

interface IVerificationDb {
  codes: IVerificationCode[];
}

/** 读取验证码记录 json */
async function openDb(): Promise<IVerificationDb> {
  const fp = path.join(__dirname, VERIFICATION_DB_FILE);
  await ensureJsonFile(fp, { codes: [] });
  const db = await jsonfile.readFile(fp) as IVerificationDb;
  if (!db.codes) db.codes = [];
  return db;
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
