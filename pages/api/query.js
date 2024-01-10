import axios from 'axios';
import * as cheerio from 'cheerio';

async function fetchInstagramAPKVersions() {
    try {
        const response = await axios.get('https://www.apkmirror.com/uploads/?appcategory=instagram-instagram');
        const $ = cheerio.load(response.data);

        // Extract information from the HTML structure

        const S = () => {
            const versions = [];
            $('.fontBlack').each((index, element) => {
                const title = $(element).text().trim();
                const isInstagram = /instagram/i.test(title);
                const isBetaOrAlpha = /beta|alpha/i.test(title);

                if (isInstagram && !isBetaOrAlpha) {
                    const link = 'https://www.apkmirror.com/' + $(element).attr('href').trim();
                    const pubDate = $(element).closest('.table-row').find('.dateyear_utc').data('utcdate').trim();

                    const version = {
                        name: title,
                        link: link,
                        pubDate: pubDate,
                    };
                    versions.push(version);
                }
            });

            return versions;
        }

        // Return the extracted data
        return S();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export default async function handler(req, res) {
    try {
        const data = await fetchInstagramAPKVersions();
        // Log the extracted data
        console.log('Extracted Versions:', data);

        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
