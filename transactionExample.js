const { MongoClient } = require('mongodb');

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
        createReservationDocument(
            "Infinite Views",
            [new Date("2019-12-31"), new Date("2020-01-01")],
            {
                pricePerNight:180,
                specialRequests: "Late checkout",
                breakfastIncluded: true
            }
        );

        // Make the appropriate DB calls

    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}

main().catch(console.error);

// Add functions that make DB calls here
const createReservationDocument = (nameOfListing, reservationDates, reservationDetails) => {
    //create a reservation
    let reservation = {
        name: nameOfListing,
        dates: reservationDates,
    }

    //Add additional properties from reservationDetails to the reservation
    for(let detail in reservationDetails){
        reservation[detail] = reservationDetails[detail]
    }

    console.log(reservation);
    return reservation;
}