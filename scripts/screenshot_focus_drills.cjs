const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const url = process.argv[2] || 'http://localhost:5173/billiard-university-app/';
  const outDir = path.join(__dirname, '..', 'screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  // force hotspots visible if helper present
  await page.evaluate(() => { try { if (window.toggleShowHotspots) window.toggleShowHotspots(true); } catch(e){} });
  await page.waitForTimeout(200);

  const codes = ['F6','F7','F8'];
  const debug = {};

  for (const code of codes) {
    const card = await page.$(`.drill-card:has(h3:has-text("${code}"))`);
    if (!card) { debug[code] = { found: false }; continue; }

    // ensure overlay present
    const overlay = await card.$('.potting-overlay');
    const hotspots = overlay ? await overlay.$$('.potting-hotspot') : [];
    const hotspotInfo = [];
    for (const h of hotspots) {
      const text = (await h.textContent())?.trim() || '';
      const style = await h.evaluate((el) => ({ left: el.style.left, top: el.style.top }));
      const rect = await h.boundingBox();
      hotspotInfo.push({ text, left: style.left, top: style.top, rect });
    }

    debug[code] = { found: true, overlay: !!overlay, hotspotsCount: hotspotInfo.length, hotspots: hotspotInfo };

    // Take a focused screenshot of the drill card
    try {
      const shotPath = path.join(outDir, `debug_${code}_360x800.png`);
      await card.screenshot({ path: shotPath });
    } catch (e) {
      // ignore
    }
  }

  // write debug json
  const debugPath = path.join(outDir, 'perAttempt_focus_debug.json');
  fs.writeFileSync(debugPath, JSON.stringify(debug, null, 2), 'utf8');

  await browser.close();
  console.log('Done. Debug JSON written to', debugPath);
})();