import { MongoClient, BSON } from 'mongodb';
import { createHash } from 'node:crypto';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('MONGODB_URI is required.');
const signatures = JSON.parse(await readFile(new URL('./demo-signatures.json', import.meta.url), 'utf8'));
const client = new MongoClient(uri);
try {
  await client.connect(); const db = client.db(); const matches = {};
  for (const [collection, entries] of Object.entries(signatures)) {
    matches[collection] = [];
    for (const entry of entries) {
      const rows = await db.collection(collection).find(entry.selector).toArray();
      for (const row of rows) {
        const normalized = Object.fromEntries(entry.fields.map(key => [key, row[key] ?? null]));
        if (createHash('sha256').update(JSON.stringify(normalized)).digest('hex') === entry.hash) matches[collection].push(row);
      }
    }
  }
  console.log('Exact unchanged demo records:', Object.fromEntries(Object.entries(matches).map(([key, rows]) => [key, rows.length])));
  if (!process.argv.includes('--apply')) { console.log('Dry run only. Add --apply to back up and remove these records. Modified products are preserved.'); }
  else {
    await mkdir('backups', { recursive: true, mode: 0o700 });
    const file = `backups/demo-${Date.now()}.json`;
    await writeFile(file, BSON.EJSON.stringify(matches), { mode: 0o600, flag: 'wx' });
    for (const [collection, rows] of Object.entries(matches)) {
      for (const row of rows) await db.collection(collection).deleteOne(row);
    }
    console.log(`Demo records removed. Backup: ${file}`);
  }
} finally { await client.close(); }
