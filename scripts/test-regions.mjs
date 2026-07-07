import { chromium } from 'playwright';

const baseUrl = 'http://localhost:8080';

const regionTests = [
  { path: '/emilia-romagna/', regione: 'Emilia-Romagna', colore: 'ARANCIO', text: 'Vietato uscire dal proprio Comune' },
  { path: '/basilicata/', regione: 'Basilicata', colore: 'ROSSO', text: 'lockdown totale' },
  { path: '/calabria/', regione: 'Calabria', colore: 'GIALLO', text: 'Divieto di circolazione dalle 22:00' },
  { path: '/sardegna/', regione: 'Sardegna', colore: 'BIANCO', text: 'distanziamento sociale' },
];

const run = async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const test of regionTests) {
    await page.goto(`${baseUrl}${test.path}`);
    await page.waitForFunction(
      ([expectedRegione, expectedText]) => {
        const regionReady = document.getElementById('regione')?.innerHTML === expectedRegione;
        const restrictionsReady = document.getElementById('restrictions')?.innerText?.includes(expectedText);
        return regionReady && restrictionsReady;
      },
      [test.regione, test.text],
      { timeout: 10000 }
    );

    const result = await page.evaluate(() => ({
      regione: document.getElementById('regione')?.innerHTML,
      colore: document.getElementById('colore')?.innerHTML,
      restrictionsHtml: document.getElementById('restrictions')?.innerHTML?.length || 0,
      restrictionsText: document.getElementById('restrictions')?.innerText || '',
    }));

    const passed = result.regione === test.regione
      && result.colore === test.colore
      && result.restrictionsHtml > 100
      && result.restrictionsText.includes(test.text);

    console.log(`\n${test.path}`);
    console.log('  regione:', result.regione, result.regione === test.regione ? 'OK' : 'FAIL');
    console.log('  colore:', result.colore, result.colore === test.colore ? 'OK' : 'FAIL');
    console.log('  restrictions rendered:', result.restrictionsHtml > 100 ? 'OK' : 'FAIL');
    console.log('  restriction text:', result.restrictionsText.includes(test.text) ? 'OK' : 'FAIL');

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
