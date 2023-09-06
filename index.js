import fs from 'node:fs';
import path from 'node:path';
import axios from 'axios';
import puppeteer from 'puppeteer';

const folderName = './memes';
try {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }
} catch (err) {
  console.error('directory already exists');
}

// access page and retrieve image links
let imagesAll;

async function accessDownloadAndSave() {
  // Launch the browser
  const browser = await puppeteer.launch();

  // Create a page
  const page = await browser.newPage();

  // Go to your site
  await page.goto('https://memegen-link-examples-upleveled.netlify.app/');

  imagesAll = await page.evaluate(() =>
    Array.from(document.images, (e) => e.src),
  );

  console.log(imagesAll);

  // Close browser.
  await browser.close();

  // loop ten times
  for (let counter = 0; counter < 10; counter++) {
    // select single image
    const currentImage = imagesAll[counter];
    console.log(currentImage);

    // create image name
    let currentImageString;
    if (counter < 9) {
      currentImageString = `0${counter + 1}.jpg`;
    } else {
      currentImageString = `${counter + 1}.jpg`;
    }
    console.log(currentImageString);

    // download image function
    async function downloadImage() {
      const response = await axios({
        url: currentImage,
        method: 'GET',
        responseType: 'stream',
      });

      // save image with image name
      response.data.pipe(
        fs.createWriteStream(path.resolve('./memes', currentImageString)),
      );
    }

    // download image
    await downloadImage();
  }
}

await accessDownloadAndSave();
