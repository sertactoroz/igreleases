import axios from 'axios';
import * as cheerio from 'cheerio';

async function fetchInstagramAPKVersions() {
    try {
        const maxVersions = 1; // Define the maximum number of versions to fetch
        const versions = [];

        // Fetch the first page separately
        const firstPageUrl = 'https://www.apkmirror.com/uploads/?appcategory=instagram-instagram';
        const firstPageResponse = await axios.get(firstPageUrl);
        const $firstPage = cheerio.load(firstPageResponse.data);

        versions.push(...extractVersions($firstPage));

        // Fetch the remaining pages until the versions array reaches the limit
        for (let page = 2; versions.length < maxVersions; page++) {
            const url = `https://www.apkmirror.com/uploads/page/${page}/?appcategory=instagram-instagram`;

            // Wrap the API request in a rate-limiting function
            const response = await fetchDataWithRateLimit(url);

            const $otherPages = cheerio.load(response.data);
            versions.push(...extractVersions($otherPages));
        }

        return versions.slice(0, maxVersions);
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

async function fetchDataWithRateLimit(url) {
    try {
        const response = await axios.get(url);

        // Check for rate-limiting response
        if (response.status === 429) {
            console.log('Rate limit exceeded. Waiting and retrying...');
            // Wait for some time (e.g., 1 minute)
            await new Promise(resolve => setTimeout(resolve, 10000));
            // Retry the request
            return fetchDataWithRateLimit(url);
        }

        // Return the successful response
        return response;
    } catch (error) {
        console.error('Error fetching data with rate limiting:', error);
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
}

async function fetchVariants(link) {
    console.log(link);

    const variantResponse = await axios.get(link);
    const $variant = cheerio.load(variantResponse.data);
    const variants = [];

    // Select all elements with class 'table-row headerFont'
    $variant('.table-row.headerFont').each(function () {
        const variant = {};

        // Find the element containing the APK version
        const apkElement = $variant(this).find('a.accent_color');
        variant.Variant = apkElement.text().trim();

        // Find the 2nd, 3rd, and 4th child elements containing architecture, version, and DPI
        const infoElements = $variant(this).children().slice(1, 4);
        variant.Architecture = infoElements.eq(0).text().trim();
        variant.Version = infoElements.eq(1).text().trim();
        variant.DPI = infoElements.eq(2).text().trim();

        // Add the variant object to the 'variants' array
        variants.push(variant);
    });

    console.log('variants', variants);

    // You can modify this part based on your needs
    // Assuming you want to return the variants array
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