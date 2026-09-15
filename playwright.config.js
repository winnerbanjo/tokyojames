const { defineConfig } = require('@playwright/test');
const { existsSync } = require('node:fs');
const candidates = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`,
];
module.exports = defineConfig({ testDir: './tests', workers: 1, use: { baseURL: process.env.TEST_BASE_URL || 'http://localhost:3199', launchOptions: { executablePath: candidates.find(existsSync) } }, reporter: 'list' });
