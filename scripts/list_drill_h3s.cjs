const { chromium } = require('playwright');
(async () => {
  const url = process.argv[2] || 'http://localhost:5173/billiard-university-app/';
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const texts = await page.evaluate(()=> Array.from(document.querySelectorAll('.drill-card h3')).map(h => h.textContent && h.textContent.trim()));
  console.log('h3s:', texts);
  await browser.close();
})();