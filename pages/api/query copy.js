import puppeteer from 'puppeteer';

async function fetchInstagramAPKVersions() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        // Navigate to the page
        await page.goto('https://www.apkmirror.com/apk/instagram/instagram-instagram/instagram-instagram-313-0-0-26-328-release/');

        // Wait for the checkbox to appear and click it
        await page.waitForSelector('.checbox');
        await page.click('checkbox');

        // Wait for a moment to ensure the action takes effect
        await page.waitForTimeout(2000);

        // Now you can proceed to scrape the data
        const versions = await page.evaluate(() => {
            const rows = document.querySelectorAll('.table-row.headerFont');
            return Array.from(rows, (row) => {
                const architecture = row.querySelector('.table-cell:nth-child(2)').innerText.trim();
                const androidVersion = row.querySelector('.table-cell:nth-child(3)').innerText.trim();
                const dpi = row.querySelector('.table-cell:nth-child(4)').innerText.trim();

                return {
                    architecture,
                    androidVersion,
                    dpi,
                };
            });
        });

        return versions;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    } finally {
        // Close the browser
        await browser.close();
    }
}

// Example of how to use the function
fetchInstagramAPKVersions()
    .then((data) => {
        console.log('Extracted Versions:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
