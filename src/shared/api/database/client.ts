import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './schemas/schema';

neonConfig.fetchConnectionCache = true;

let _db: NeonHttpDatabase<typeof schema> | null = null;
let _sql: ReturnType<typeof neon> | null = null;

export const getDb = (): NeonHttpDatabase<typeof schema> => {
  if (_db) return _db;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('[Database] DATABASE_URL environment variable is not defined.');
  }

  _sql = neon(url);
  _db = drizzle(_sql, { schema });
  return _db;
};

export const getSql = () => {
  if (_sql) return _sql;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('[Database] DATABASE_URL environment variable is not defined.');
  }
  _sql = neon(url);
  return _sql;
};

// Proxy to maintain backward compatibility with direct `db.select()` / `db.insert()` calls
export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
  get(_target, prop, receiver) {
    const realDb = getDb();
    const value = Reflect.get(realDb, prop, receiver);
    if (typeof value === 'function') {
      return value.bind(realDb);
    }
    return value;
  }
});

export const sql = new Proxy((() => {}) as unknown as ReturnType<typeof neon>, {
  apply(_target, thisArg, argArray) {
    const realSql = getSql();
    return Reflect.apply(realSql as any, thisArg, argArray);
  },
  get(_target, prop, receiver) {
    const realSql = getSql();
    return Reflect.get(realSql as any, prop, receiver);
  }
});
