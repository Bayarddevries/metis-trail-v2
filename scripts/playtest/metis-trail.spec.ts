import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:4175';
const SEGMENT_ID = '#s-segment';
const TRAVEL_BTN = '#btn-travel';
const START_BTN = '#intro-start';

async function dismissOverlays(page) {
  const selector = '#settlement-continue, #event-continue';
  const el = page.locator(selector).first();
  if (await el.count() > 0) {
    await el.first().click();
    await page.waitForTimeout(200);
  }
}

test('travel updates segment bar and map route', async ({ page }) => {
  const logs: string[] = [];
  let testFailed = false;
  page.on('console', (msg) => {
    logs.push(`[${msg.type()}] ${msg.text()}`);
  });
  page.on('pageerror', (err) => {
    logs.push(`[pageerror] ${err.message}`);
    testFailed = true;
  });

  try {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.click(START_BTN);

    const travel = page.locator(TRAVEL_BTN);
    expect(await travel.count()).toBeGreaterThan(0);

    const seg = page.locator(SEGMENT_ID);
    const initial = await seg.first().textContent();

    await travel.first().click();
    await page.waitForTimeout(400);
    await dismissOverlays(page);

    const after = await seg.first().textContent();

    const hasRoute = await page.locator('.leaflet-overlay-pane svg path').count();

    console.log(`\nLogs:\n${logs.join('\n')}`);

    expect(after).toBeTruthy();
    expect(initial).not.toBe(after);
    expect(hasRoute).toBeGreaterThanOrEqual(1);
  } catch (err) {
    console.log(`\nTest failure logs:\n${logs.join('\n')}`);
    if (testFailed) {
      console.log('\nDetected page boot/runtime error — likely dist/app.js still has stale function refs.');
    }
    throw err;
  }
});
