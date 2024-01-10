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
        };

        const SS = async () => {
           const finalArray = [];
           /*
            Pseudo Kodu:
            1. S() fonksiyonu ile versiyonları çek
            2. Her bir versiyon için linkine git
            3. Oradaki variantları çek
            4. Her bir variant için linkine git
            5. Oradaki download linkini çek
            6. Her bir versiyon için variantları ekle

            */
           /*
            Extracted Versions: [
                {
                    name: 'Instagram 321.xxx.xx.xxx',
                    link: 'https://www.apkmirror.com/apk/instagram/instagram-instagram/instagram-instagram-321-xxx-xx-xxx-release/instagram-3211-xxx-xx-xxx-android-apk-download/',
                    pubDate: '2021-06-03T21:11:00Z'
                    variants: [
                        {
                            variantId: 'xxx.xxx.xx.xxx',
                            name: 'arm64-v8a',
                            minVersion: '21',
                            dpi: 'nodpi',
                            link: 'https://www.apkmirror.com/apk/instagram/instagram-instagram/instagram-instagram-3211-xxx-xx-xxx-release/instagram-3211-xxx-xx-xxx-android-apk-download/download/?forcebaseapk',
                        },
                        ....
                    ]
                 },
            ]
            */
           

        
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
