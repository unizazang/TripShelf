import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var pgPool: Pool | undefined;
}

function createPool() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL이 설정되지 않았습니다.");
  }

  return new Pool({
    connectionString,
  });
}

export function getDb() {
  if (!global.pgPool) {
    global.pgPool = createPool();
  }

  return global.pgPool;
}