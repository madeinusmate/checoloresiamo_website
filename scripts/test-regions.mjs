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
  { path: '/lombardia/', regione: 'Lombardia', colore: 'ARANCIO', background: 'rgb(255, 140, 0)', text: 'Vietato uscire dal proprio Comune' },
  { path: '/basilicata/', regione: 'Basilicata', colore: 'ROSSO', background: 'rgb(204, 0, 0)', text: 'lockdown totale' },
  { path: '/calabria/', regione: 'Calabria', colore: 'GIALLO', background: 'rgb(255, 193, 0)', text: 'Divieto di circolazione dalle 22:00' },
  { path: '/sardegna/', regione: 'Sardegna', colore: 'BIANCO', background: 'rgb(255, 255, 255)', text: 'distanziamento sociale' },
];

const run = async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(`${baseUrl}/`);
  await page.waitForFunction(() => document.getElementById('countGiallo')?.innerHTML === '8');
  const home = await page.evaluate(() => ({
    giallo: document.getElementById('countGiallo')?.innerHTML,
    arancio: document.getElementById('countArancio')?.innerHTML,
    rosso: document.getElementById('countRosso')?.innerHTML,
    bianco: document.getElementById('countBianco')?.innerHTML,
    lombardiaClass: document.getElementById('lombardia')?.getAttribute('class'),
    moliseClass: document.getElementById('molise')?.getAttribute('class'),
  }));
  console.log('Home counts:', home);

  for (const test of regionTests) {
    await page.goto(`${baseUrl}${test.path}`);
    const restrictionId = restrictionIdByColor[test.colore];

    await page.waitForFunction(
      ([expectedRegione, expectedRestrictionId]) => {
        const regionReady = document.getElementById('regione')?.innerHTML === expectedRegione;
        const restrictionElement = document.getElementById(expectedRestrictionId);
        const restrictionReady = restrictionElement
          && getComputedStyle(restrictionElement).display === 'block';
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
      restrictionText: document.getElementById(activeRestrictionId)?.innerText || '',
    }), restrictionId);

    const passed = result.regione === test.regione
      && result.colore === test.colore
      && result.background === test.background
      && result.activeRestriction === 'block'
      && result.restrictionText.includes(test.text);

    console.log(`\n${test.path}`);
    console.log('  regione:', result.regione, result.regione === test.regione ? 'OK' : 'FAIL');
    console.log('  colore:', result.colore, result.colore === test.colore ? 'OK' : 'FAIL');
    console.log('  background:', result.background, result.background === test.background ? 'OK' : 'FAIL');
    console.log('  restriction text:', result.restrictionText.includes(test.text) ? 'OK' : 'FAIL');

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
