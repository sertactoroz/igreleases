// import { launch } from 'puppeteer';

// export default async function scrapeWebsite() {
//     const browser = await launch();
//     const page = await browser.newPage();

//     // Navigate to the URL
//     await page.goto('https://www.apkmirror.com/apk/instagram/instagram-instagram/instagram-instagram-313-0-0-26-328-release/');

//     // Wait for the page to load after the JavaScript challenge
//     await page.waitForSelector('.main-content');

//     // Now you can interact with the page using Puppeteer
//     const data = await page.evaluate(() => {
//         // Extract data from the page
//         const title = document.title;
//         // Add more logic as needed

//         return { title };
//     });

//     console.log('Scraped Data:', data);

//     await browser.close();
// }
