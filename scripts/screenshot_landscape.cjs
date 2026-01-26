const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const url = process.argv[2] || 'http://localhost:5174/billiard-university-app/';
  const outDir = path.join(__dirname, '..', 'screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `examI_mobile_800x360.png`);

  console.log('Launching browser...');
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 800, height: 360 }, deviceScaleFactor: 2 });
  const page = await context.newPage();
  console.log('Navigating to', url);
  await page.goto(url, { waitUntil: 'networkidle' });
  // wait a bit for fonts/styles
  await page.waitForTimeout(500);
  console.log('Capturing screenshot to', outPath);
  await page.screenshot({ path: outPath, fullPage: false });
  await browser.close();
  console.log('Done.');
})();