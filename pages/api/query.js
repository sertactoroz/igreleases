import axios from 'axios';
import * as cheerio from 'cheerio';

async function fetchInstagramAPKVersions() {
    try {
        const maxVersions = 10; // Define the maximum number of versions to fetch
        const versions = [];

        // Fetch the first page separately
        const firstPageUrl = 'https://www.apkmirror.com/uploads/?appcategory=instagram-instagram';
        const firstPageResponse = await axios.get(firstPageUrl);
        const $firstPage = cheerio.load(firstPageResponse.data);

        versions.push(...extractVersions($firstPage));

        // Fetch the remaining pages until the versions array reaches the limit
        for (let page = 2; versions.length < maxVersions; page++) {
            const url = `https://www.apkmirror.com/uploads/page/${page}/?appcategory=instagram-instagram`;
            const response = await axios.get(url);
            const $otherPages = cheerio.load(response.data);

            versions.push(...extractVersions($otherPages));
        }

        return versions.slice(0, maxVersions);
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}
function extractVersions($) {
    const extractedVersions = [];

    $('.fontBlack').each((index, element) => {
        const title = $(element).text().trim();
        const isInstagram = /instagram/i.test(title);
        const isBetaOrAlpha = /beta|alpha/i.test(title);

        const pubDateElement = $(element).closest('.table-row').find('.dateyear_utc');
        const pubDate = pubDateElement.length ? pubDateElement.data('utcdate') : null;
        const variantInfoText = $(element).closest('.table-row').find('.appRowVariantTag a').text();

        if (isInstagram && !isBetaOrAlpha && pubDate !== null && variantInfoText !== null) {
            const link = 'https://www.apkmirror.com/' + $(element).attr('href');

            const variants = fetchVariants(link);

            const version = {
                name: title,
                link: link,
                pubDate: pubDate,
                variantInfo: variantInfoText,
                variants: variants,
            };
            extractedVersions.push(version);
        }
    });

    return extractedVersions;
} async function fetchVariants(link) {
    console.log(link);

    // Introduce a delay of, for example, 3 seconds
    await new Promise(resolve => setTimeout(resolve, 3000));

    const variantResponse = await axios.get(link);
    const $variant = cheerio.load(variantResponse.data);
    const variants = [];

    $variant('.table-row.headerFont').each((index, variantElement) => {
        const dpi = $variant(variantElement).find('.dpi').text();
        variants.push({
            dpi: dpi,
        });
    });

    return variants;
}

export default async function handler(req, res) {
    try {
        // Fetch Instagram APK versions
        const data = await fetchInstagramAPKVersions();
        console.log('Extracted Versions:', data);
        res.status(200).json(data);
        // Save data to MongoDB
        // await saveToMongoDB(data);

    } catch (error) {
        console.error('Error fetching data or saving to MongoDB:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
