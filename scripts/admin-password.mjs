import { randomBytes, scryptSync } from 'node:crypto';
let password = '';
for await (const chunk of process.stdin) password += chunk;
password = password.replace(/\r?\n$/, '');
if (password.length < 16 || password.length > 256) throw new Error('Use a password of 16–256 characters.');
const salt = randomBytes(16).toString('hex');
console.log(`${salt}:${scryptSync(password, salt, 64).toString('hex')}`);
