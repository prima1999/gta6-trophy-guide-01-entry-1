// Screenshot the guide at four views, as real renders in a headless browser.
// Usage: node shots.mjs
// Serves app/ on port 8123 first (run `node serve.ts --port 8123` in another shell),
// then captures: 1-checklist (cover), 2-guide (guide + sources open),
// 3-roadmap (roadmap + missables), 4-spoiler (spoiler setting on, missable filter).
import { chromium } from '/home/hatch/workspace/makefun/tr-shots/node_modules/playwright/index.mjs';

const BASE = 'http://127.0.0.1:8123/';
const SHOTS = '/home/hatch/workspace/makefun/gta6-trophy-guide-01-entry-1/screenshots';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const failedRequests = [];
page.on('requestfailed', (request) => failedRequests.push(request.url()));
page.on('response', (response) => {
  if (response.status() >= 400) failedRequests.push(response.url() + ' -> ' + response.status());
});

// Seed a realistic partial playthrough so the cover shows progress.
await page.addInitScript(() => {
  const earned = [
    'Just Like Paradise', 'Paradise Lost', 'T**s Ass Drug Money', 'Vice City, Baby!',
    'Trust', 'Break the Bank', 'Family Matters', 'DWNFALL',
    'Master of None', 'Stick Fiddler', 'Baited My Tackle', 'Whip It Good',
    'Retail Therapy', 'Treat Yo Self',
  ];
  localStorage.setItem('vice-city-platinum-progress-v1', JSON.stringify(earned));
});

await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForSelector('.trophy-card', { timeout: 10000 });
await page.waitForTimeout(400);

// 1 — cover: checklist with official names, descriptions and grades.
await page.screenshot({ path: SHOTS + '/1-checklist.jpg', type: 'jpeg', quality: 82 });

// 2 — one trophy's guide with its sources open.
await page.click('.trophy-card[data-trophy-id="15"] .guide-button');
await page.waitForSelector('#guide-panel:not([hidden])', { timeout: 5000 });
await page.waitForTimeout(600);
await page.screenshot({ path: SHOTS + '/2-guide.jpg', type: 'jpeg', quality: 82 });

// 3 — platinum roadmap and missable flags.
await page.evaluate(() => document.getElementById('roadmap').scrollIntoView());
await page.waitForTimeout(400);
await page.screenshot({ path: SHOTS + '/3-roadmap.jpg', type: 'jpeg', quality: 82 });

// 4 — spoiler setting on, missable filter active.
await page.evaluate(() => document.getElementById('checklist').scrollIntoView());
await page.check('#spoiler-toggle');
await page.click('.chip[data-kind="missable"]');
await page.waitForTimeout(400);
await page.screenshot({ path: SHOTS + '/4-spoiler.jpg', type: 'jpeg', quality: 82 });

console.log('failed requests:', JSON.stringify(failedRequests));
console.log('progress text:', await page.textContent('#progress-text'));
console.log('cards shown:', await page.locator('.trophy-card').count());
await browser.close();
