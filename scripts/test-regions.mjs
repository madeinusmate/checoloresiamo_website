import { chromium } from 'playwright';

const baseUrl = 'http://localhost:8080';

const restrictionIdByColor = {
  GIALLO: 'restrictions_yellow',
  ARANCIO: 'restrictions_orange',
  'ARANCIO RAFFORZATO': 'restrictions_orangeStrong',
  ROSSO: 'restrictions_red',
  BIANCO: 'restrictions_white',
};

const regionTests = [
  { path: '/lombardia/', regione: 'Lombardia', colore: 'GIALLO', background: 'rgb(255, 193, 0)' },
  { path: '/piemonte/', regione: 'Piemonte', colore: 'ROSSO', background: 'rgb(204, 0, 0)' },
  { path: '/lazio/', regione: 'Lazio', colore: 'ARANCIO RAFFORZATO', background: 'rgb(194, 107, 0)' },
  { path: '/veneto/', regione: 'Veneto', colore: 'BIANCO', background: 'rgb(255, 255, 255)' },
];

const run = async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(`${baseUrl}/lombardia/`);
  await page.waitForTimeout(500);

  for (const test of regionTests) {
    if (test.path !== '/lombardia/') {
      await page.goto(`${baseUrl}${test.path}`);
    }
    const restrictionId = restrictionIdByColor[test.colore];

    await page.waitForFunction(
      ([expectedRegione, expectedRestrictionId]) => {
        const regionReady = document.getElementById('regione')?.innerHTML === expectedRegione;
        const restrictionElement = document.getElementById(expectedRestrictionId);
        const restrictionReady = restrictionElement
          && getComputedStyle(restrictionElement).display === 'inline';
        return regionReady && restrictionReady;
      },
      [test.regione, restrictionId],
      { timeout: 10000 }
    );

    const result = await page.evaluate((activeRestrictionId) => ({
      regione: document.getElementById('regione')?.innerHTML,
      colore: document.getElementById('colore')?.innerHTML,
      background: getComputedStyle(document.getElementById('body')).backgroundColor,
      activeRestriction: getComputedStyle(document.getElementById(activeRestrictionId)).display,
      update: document.getElementById('update')?.innerHTML,
    }), restrictionId);

    const passed = result.regione === test.regione
      && result.colore === test.colore
      && result.background === test.background
      && result.activeRestriction === 'inline'
      && result.update === '7 Luglio 2026';

    console.log(`\n${test.path}`);
    console.log('  regione:', result.regione, passed ? 'OK' : 'FAIL');
    console.log('  colore:', result.colore, result.colore === test.colore ? 'OK' : 'FAIL');
    console.log('  background:', result.background, result.background === test.background ? 'OK' : 'FAIL');
    console.log('  update:', result.update, result.update === '7 Luglio 2026' ? 'OK' : 'FAIL');
    console.log('  active restriction:', result.activeRestriction, result.activeRestriction === 'inline' ? 'OK' : 'FAIL');

    if (!passed) {
      process.exitCode = 1;
    }
  }

  await browser.close();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
