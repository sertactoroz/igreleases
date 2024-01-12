
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://oxotest:Of5ZMdA53IMqmPzv@cluster0.veoxdfh.mongodb.net/";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: false,
//     }
// });

// async function saveToMongoDB() {
//     try {
//         // Connect the client to the server	(optional starting in v4.7)
//         await client.connect();
//         // Send a ping to confirm a successful connection
//         await client.db("admin").command({ ping: 1 });
//         console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     } finally {
//         // Ensures that the client will close when you finish/error
//         await client.close();
//     }
// }
// module.exports = saveToMongoDB;

// run().catch(console.dir);

// mongoDB.js

import { MongoClient, ServerApiVersion } from 'mongodb';

async function saveToMongoDB(data) {
    const uri = "mongodb+srv://sertactoroz:Of5ZMdA53IMqmPzv@cluster0.y6rtf7p.mongodb.net/";
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    try {
        await client.connect();
        const database = client.db('test');
        const collection = database.collection('apks');

        // Ensure data is an array before inserting
        if (Array.isArray(data) && data.length > 0) {
            console.log('Data:', data);

            // Insert data into MongoDB
            await collection.insertMany(data);
            console.log('Data inserted successfully!');
        } else {
            console.error('Data must be an array of documents.');
        }
    } finally {
        await client.close();
    }
}

export default saveToMongoDB;
