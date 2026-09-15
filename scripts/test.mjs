import { MongoMemoryServer } from 'mongodb-memory-server';
import { spawn } from 'node:child_process';
import { randomBytes, scryptSync } from 'node:crypto';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
const binary = `${process.env.HOME}/.cache/mongodb-binaries/mongod-arm64-darwin-7.0.24`;
const mongo = await MongoMemoryServer.create({ binary: existsSync(binary) ? { systemBinary: binary } : { version: '7.0.24' }, instance: { args: ['--wiredTigerCacheSizeGB', '0.25', '--setParameter', 'diagnosticDataCollectionEnabled=false'] } });
const salt = randomBytes(16).toString('hex');
const password = randomBytes(24).toString('hex');
const port = '3199';
const env = { ...process.env, MONGODB_URI: mongo.getUri('tokyo_james_test'), ADMIN_USERNAME: 'test-admin', ADMIN_PASSWORD_HASH: `${salt}:${scryptSync(password, salt, 64).toString('hex')}`, ADMIN_SESSION_SECRET: randomBytes(32).toString('hex'), APP_URL: `http://localhost:${port}`, TEST_ADMIN_PASSWORD: password, TEST_BASE_URL: `http://localhost:${port}` };
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', port], { env, stdio: ['ignore', 'pipe', 'pipe'] });
let logs = ''; server.stdout.on('data', data => logs += data); server.stderr.on('data', data => logs += data);
try {
  let ready = false;
  for (let i = 0; i < 60; i++) { try { if ((await fetch(env.APP_URL)).ok) { ready = true; break; } } catch {} await new Promise(r => setTimeout(r, 500)); }
  if (!ready) throw new Error(`Server did not start: ${logs}`);
  const tests = spawn(process.execPath, ['node_modules/@playwright/test/cli.js', 'test'], { env, stdio: 'inherit' });
  process.exitCode = await new Promise(resolve => tests.on('exit', resolve));
  if (process.exitCode) console.error(logs);
  else {
    await mongo.stop();
    for (const [path, options] of [['/api/products', {}], ['/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'outage@example.test' }) }]]) {
      const response = await fetch(env.APP_URL + path, options);
      assert.equal(response.status, 503);
      assert.equal((await response.json()).success, false);
    }
    console.log('Database outage checks passed: no demo fallback and no false subscription success.');
  }
} finally { server.kill('SIGTERM'); await new Promise(resolve => server.once('exit', resolve)); await mongo.stop(); }
