const { test, expect } = require('@playwright/test');
const origin = process.env.TEST_BASE_URL;
const product = { title: 'Verification garment', category: 'tailoring', categoryName: 'Tailoring', priceEUR: 100, primaryImage: '/images/tj_drive_1.jpg', secondaryImage: '/images/tj_drive_1.jpg', description: 'Test-only garment in an isolated database.', sizes: ['M'], inStock: true };
async function login(request) {
  const response = await request.post('/api/admin/session', { headers: { origin }, data: { username: 'test-admin', password: process.env.TEST_ADMIN_PASSWORD } });
  expect(response.status()).toBe(200);
  expect(response.headers()['set-cookie']).toContain('HttpOnly');
  expect(response.headers()['set-cookie']).toContain('Secure');
  const cookie = response.headers()['set-cookie'].split(';')[0];
  return { origin, cookie };
}
test('unauthenticated writes and order reads are blocked; removed seed stays removed', async ({ request }) => {
  for (const [method, url] of [['post','/api/admin/products'],['put','/api/admin/products/test'],['delete','/api/admin/products/test'],['post','/api/admin/upload'],['put','/api/content'],['post','/api/content'],['get','/api/orders']]) {
    expect((await request[method](url, { data: {}, headers: { origin } })).status()).toBe(401);
  }
  expect((await request.post('/api/seed')).status()).toBe(404);
  expect((await request.post('/api/orders', { data: { totalEUR: 1, items: [product] } })).status()).toBe(503);
  expect((await (await request.get('/api/products')).json()).data).toEqual([]);
  expect((await request.get('/api/products/tj-1')).status()).toBe(404);
});
test('persistent product CRUD, validation, CSRF, content, uploads, logout revocation', async ({ request }) => {
  const headers = await login(request);
  expect((await request.post('/api/admin/products', { headers: { ...headers, origin: 'https://attacker.invalid' }, data: product })).status()).toBe(403);
  expect((await request.post('/api/admin/products', { headers, data: { ...product, priceEUR: -5 } })).status()).toBe(400);
  expect((await request.post('/api/admin/products', { headers, data: { ...product, primaryImage: 'javascript:alert(1)' } })).status()).toBe(400);
  const created = await request.post('/api/admin/products', { headers, data: { ...product, _id: 'injected' } });
  expect(created.status()).toBe(201); const { data } = await created.json();
  expect(data._id).not.toBe('injected');
  expect((await (await request.get(`/api/products/${data.id}`)).json()).data.title).toBe(product.title);
  expect((await (await request.get('/api/products?category=missing')).json()).data).toEqual([]);
  expect((await (await request.get('/api/products')).json()).data).toHaveLength(1);
  expect((await request.put(`/api/admin/products/${data.id}`, { headers, data: { ...product, inStock: false } })).status()).toBe(200);
  expect((await (await request.get(`/api/products/${data.id}`)).json()).data.inStock).toBe(false);
  const content = (await (await request.get('/api/content')).json()).data;
  content.hero.headline = 'Verified campaign';
  expect((await request.put('/api/content', { headers, data: content })).status()).toBe(200);
  expect((await (await request.get('/api/content')).json()).data.hero.headline).toBe('Verified campaign');
  expect((await request.post('/api/admin/upload', { headers, multipart: { file: { name: 'bad.html', mimeType: 'image/png', buffer: Buffer.from('<script>bad</script>') } } })).status()).toBe(400);
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64');
  const upload = await request.post('/api/admin/upload', { headers, multipart: { file: { name: 'image.png', mimeType: 'image/png', buffer: png } } });
  expect(upload.status()).toBe(201);
  const image = await request.get((await upload.json()).url);
  expect(image.headers()['content-type']).toBe('image/png'); expect(await image.body()).toEqual(png);
  expect((await request.delete(`/api/admin/products/${data.id}`, { headers })).status()).toBe(200);
  expect((await request.delete(`/api/admin/products/${data.id}`, { headers })).status()).toBe(404);
  expect((await (await request.get('/api/products')).json()).data).toEqual([]);
  expect((await (await request.get('/api/orders', { headers })).json()).data).toEqual([]);
  expect((await request.delete('/api/admin/session', { headers })).status()).toBe(200);
  expect((await request.get('/api/orders', { headers })).status()).toBe(401);
});
test('newsletter validates and handles duplicate subscriptions', async ({ request }) => {
  expect((await request.post('/api/newsletter', { data: { email: 'invalid@' } })).status()).toBe(400);
  for (const email of ['subscriber@example.test', 'SUBSCRIBER@example.test']) expect((await request.post('/api/newsletter', { data: { email } })).status()).toBe(200);
});
test('storefront starts empty and admin cannot be bypassed with localStorage', async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByText('New pieces are coming soon.')).toBeVisible();
  await expect(page.getByRole('button', { name: /Cart \( 0 \)/ })).toBeVisible();
  await page.evaluate(() => localStorage.setItem('tj_admin_auth', 'true'));
  await page.goto('/admin');
  await expect(page.getByRole('button', { name: /Sign In to Admin Dashboard/ })).toBeVisible();
  await expect(page.getByText('Store CMS & Order Management')).toHaveCount(0);
  await page.locator('input[autocomplete="username"]').fill('test-admin');
  await page.locator('input[type="password"]').fill(process.env.TEST_ADMIN_PASSWORD);
  await page.getByRole('button', { name: /Sign In to Admin Dashboard/ }).click();
  await expect(page.getByRole('heading', { name: /Store CMS & Order Management/ })).toBeVisible();
  await expect(page.getByText('No products found. Add your first garment to publish it.')).toBeVisible();
  await page.getByRole('button', { name: /Client Orders/ }).click();
  await expect(page.getByText('No orders yet.')).toBeVisible();
  await page.getByRole('button', { name: 'Log Out' }).click();
  await expect(page.getByRole('button', { name: /Sign In to Admin Dashboard/ })).toBeVisible();
  expect(errors).toEqual([]);
});
test('admin form publishes, edits, and deletes a garment on desktop and mobile', async ({ page }) => {
  page.on('dialog', dialog => dialog.accept());
  await page.goto('/admin');
  await page.locator('input[autocomplete="username"]').fill('test-admin');
  await page.locator('input[type="password"]').fill(process.env.TEST_ADMIN_PASSWORD);
  await page.getByRole('button', { name: /Sign In to Admin Dashboard/ }).click();
  await page.getByRole('button', { name: '+ Add New Garment', exact: true }).click();
  await page.getByPlaceholder('e.g. Asymmetric Zip Wool Trench').fill('Browser verified garment');
  await page.getByPlaceholder('1850.00').fill('125');
  await page.getByPlaceholder('46, 48, 50, 52').fill('M, L');
  await page.getByPlaceholder('/images/tj_drive_1.jpg or image URL').fill('/images/tj_drive_1.jpg');
  await page.getByPlaceholder('Describe the garment, materials, and fit').fill('A verified product description.');
  await page.getByRole('button', { name: 'Save Garment', exact: true }).click();
  await expect(page.getByText('Browser verified garment', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Edit', exact: true }).click();
  await page.getByPlaceholder('1850.00').fill('150');
  await page.getByRole('button', { name: 'Save Garment', exact: true }).click();
  await expect(page.getByRole('cell', { name: '€ 150.00', exact: true })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'test-results/admin-mobile.png', fullPage: true });
  await page.getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(page.getByText('No products found. Add your first garment to publish it.')).toBeVisible();
  await page.goto('/');
  await expect(page.getByText('New pieces are coming soon.')).toBeVisible();
  await page.screenshot({ path: 'test-results/store-mobile.png', fullPage: true });
});
test('invalid credentials and forged sessions cannot bypass login throttling', async ({ request }) => {
  expect((await request.get('/api/orders', { headers: { cookie: 'tj_admin_session=9999999999999.forged.invalid' } })).status()).toBe(401);
  let status;
  for (let i = 0; i < 22; i++) {
    status = (await request.post('/api/admin/session', { headers: { origin }, data: { username: 'test-admin', password: 'incorrect password' } })).status();
    expect([401, 429]).toContain(status);
  }
  expect(status).toBe(429);
});
