import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { pool } from '../db/client.js';

const schemaPath = join(process.cwd(), 'schema', '001_initial.sql');

async function main() {
  if (!existsSync(schemaPath)) {
    console.error('Schema file not found:', schemaPath);
    process.exit(1);
  }
  const sql = readFileSync(schemaPath, 'utf-8');
  await pool.query(sql);
  console.log('Schema applied.');
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
