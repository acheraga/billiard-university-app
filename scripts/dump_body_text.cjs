const { chromium } = require('playwright');
(async () => {
  const url = process.argv[2] || 'http://localhost:5173/billiard-university-app/';
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const text = await page.evaluate(()=> document.body.innerText.slice(0,2000));
  console.log('body snippet:\n', text);
  await browser.close();
})();