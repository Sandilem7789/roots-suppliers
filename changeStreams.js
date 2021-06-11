const { MongoClient } = require('mongodb');
const timeInMs = 60000;

async function main() {
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/drivers/node/ for more details
     */
     const uri = "mongodb+srv://sandile:sandilem7789@testcluster.hjbaj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    
    /**
     * The Mongo Client you will use to interact with your database
     * See https://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html for more details
     * In case: '[MONGODB DRIVER] Warning: Current Server Discovery and Monitoring engine is deprecated...'
     * pass option { useUnifiedTopology: true } to the MongoClient constructor.
     * const client =  new MongoClient(uri, {useUnifiedTopology: true})
     */
     const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Make the appropriate DB calls
        await monitorListingsUsingEventEmitter(client);

    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}

main().catch(console.error);

// Add functions that make DB calls here

//helper function to close the stream
let closeChangeStream = (timeInMs = 60000, changeStream) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Closing the change stream`);
            changeStream.close();
            resolve();
        }, timeInMs);
    });
}

//To monitor change we use NodeJS EventEmitter function on()
let monitorListingsUsingEventEmitter = async (client, timeInMs = 60000, pipeline = []) => {
    const collection = client.db("sample_airbnb").collection("listingsAndReviews");

    //to create the change stream we use the watch() function
    const changeStream = collection.watch(pipeline);

    //now to monitor the stream we add a listener to it
    changeStream.on("change", (next) => {
        console.log(next);
    });

    //we could live the stream open indefinetely, but we are going to close it.
    await closeChangeStream(timeInMs, changeStream);
}