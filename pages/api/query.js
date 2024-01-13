import axios from 'axios';
import * as cheerio from 'cheerio';
// import saveToMongoDB from './mongoDB';

async function fetchInstagramAPKVersions() {
    try {
        const maxPages = 10; // Define the maximum number of pages to fetch
        const versions = [];

        // Fetch the first page separately
        const firstPageUrl = 'https://www.apkmirror.com/uploads/?appcategory=instagram-instagram';
        const firstPageResponse = await axios.get(firstPageUrl);
        const $firstPage = cheerio.load(firstPageResponse.data);

        versions.push(...extractVersions($firstPage));

        // Fetch the remaining pages
        for (let page = 2; page <= maxPages; page++) {
            const url = `https://www.apkmirror.com/uploads/page/${page}/?appcategory=instagram-instagram`;
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            versions.push(...extractVersions($));
        }

        return versions.slice(0, 10); // Return the first 10 elements
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

        if (isInstagram && !isBetaOrAlpha && pubDate !== null) {
            const link = 'https://www.apkmirror.com/' + $(element).attr('href');

            const variants = fetchVariants($, link);

            const version = {
                name: title,
                link: link,
                pubDate: pubDate,
                variants: variants,
            };
            extractedVersions.push(version);
        }
    });

    return extractedVersions;
}

function fetchVariants($, link) {
    console.log(link)
    const variants = [];

    $('.table-row headerFont').each((index, variantElement) => {
        const dpi = $(variantElement).find('.dpi').text();
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
