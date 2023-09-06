import * as fs from 'fs';
import puppeteer from 'puppeteer';

const folderName = './memes';
try {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }
} catch (err) {
  console.error('directory already exists');
}

(async () => {
  // Launch the browser
  const browser = await puppeteer.launch();

  // Create a page
  const page = await browser.newPage();

  // Go to your site
  await page.goto('https://memegen-link-examples-upleveled.netlify.app/');

  // Query for an element handle.
  //  const element = await page.waitForSelector('div > .class-name');
  const images = await page.evaluate(() =>
    Array.from(document.images, (e) => e.src),
  );

  console.log(images);
  // Dispose of handle
  // await element.dispose();

  // Close browser.
  await browser.close();
})();
