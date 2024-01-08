// const axios = require('axios');
// const cheerio = require('cheerio');

// async function fetchInstagramAPKVersions() {
//   try {
//     const response = await axios.get('https://www.apkmirror.com/uploads/?appcategory=instagram-instagram');
//     const $ = cheerio.load(response.data);

//     // Extract information from the HTML structure
//     const versions = [];
//     $('item').each((index, element) => {
//       const title = $(element).find('title').text().trim();
//       const isBetaOrAlpha = /beta|alpha/i.test(title);

//       if (!isBetaOrAlpha) {
//         const version = {
//           name: title,
//           link: $(element).find('link').text().trim(),
//           pubDate: $(element).find('pubDate').text().trim(),
//           // Add other fields as needed
//         };
//         versions.push(version);
//       }
//     });

//     // Log the extracted data
//     console.log('Extracted Versions:', versions);

//     // Save data to MongoDB (you need to implement this part)
//     // saveToMongoDB(versions);
//   } catch (error) {
//     console.error('Error fetching data:', error);
//   }
// }

// module.exports = fetchInstagramAPKVersions;

import xml2js from 'xml2js';

export const Query = {
    async getQuery() {
        try {
            const response = await fetch('https://www.apkmirror.com/apk/instagram/instagram-instagram/feed/');
            const xml = await response.text();
            console.log('Response', response);
            // Parse XML to JSON
            const json = await new Promise((resolve, reject) => {
                xml2js.parseString(xml, { explicitArray: false }, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });

            // Extract relevant information from each item
            const extractedItems = json.rss.channel.item.map(item => {
                const extractedData = {
                    title: item.title,
                    link: item.link,
                    pubDate: item.pubDate,
                    description: item.description,
                    // Add more properties as needed
                };

                return extractedData;
            });

            console.log(extractedItems);
            return extractedItems;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
};

export default async function handler(req, res) {
    try {
        const data = await Query.getQuery();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
