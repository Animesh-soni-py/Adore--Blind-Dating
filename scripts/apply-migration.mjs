#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { createInterface } from 'readline';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sqlPath = join(__dirname, '..', 'supabase', 'migrations', '001_initial_schema.sql');

const rl = createInterface({ input: process.stdin, output: process.stdout });

function ask(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

const DB_PASS = await ask('Enter your Supabase database password: ');
rl.close();

if (!DB_PASS) {
  console.error('Password is required');
  process.exit(1);
}

const PROJECT_REF = 'xomefbuzmimwbpmtvhxo';
const poolerHost = 'aws-0-ap-south-1.pooler.supabase.com';
const connStr = `postgresql://postgres.${PROJECT_REF}:${encodeURIComponent(DB_PASS)}@${poolerHost}:6543/postgres`;

console.log('\nConnecting to Supabase database via connection pooler...');

try {
  const sql = readFileSync(sqlPath, 'utf8');
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`Found ${statements.length} SQL statements to execute.\n`);

  const { default: pg } = await import('pg');
  const client = new pg.Client({ connectionString: connStr, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log('Connected! Running migration...\n');

  for (let i = 0; i < statements.length; i++) {
    try {
      await client.query(statements[i] + ';');
      console.log(`  ✓ Statement ${i + 1}/${statements.length}`);
    } catch (err) {
      if (err.code === '42P07' || err.code === '42710') {
        console.log(`  - Statement ${i + 1}/${statements.length} (already exists, skipped)`);
      } else {
        console.error(`  ✗ Statement ${i + 1}/${statements.length} FAILED:`, err.message);
      }
    }
  }

  await client.end();
  console.log('\n✅ Migration complete! Refresh your website.');
} catch (err) {
  console.error('\n❌ Failed:', err.message);
  process.exit(1);
}
