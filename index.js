import axios from 'axios';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const folderName = './memes';
try {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }
} catch (err) {
  console.error('directory already exists');
}

let imagesAll;
let firstTenImages;

// access page and retrieve image links

(async () => {
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

  let currentImageString;
  for (let counter = 0; counter < 10; counter++) {
    const currentImage = imagesAll[counter];
    if (counter < 9) {
      currentImageString = '0' + `${counter + 1}.jpg`;
    } else {
      currentImageString = `${counter + 1}.jpg`;
    }
    console.log(currentImageString);
    console.log(currentImage);

    async function downloadImage() {
      const response = await axios({
        url: currentImage,
        method: 'GET',
        responseType: 'stream',
      });

      response.data.pipe(
        fs.createWriteStream(path.resolve('./memes', `${currentImageString}`)),
      );

      /*
      return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
}

      );*/
    }

    await downloadImage();
  }
})();
