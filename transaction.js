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
        
        // Make the appropriate DB calls
        await createReservation(client,
            "leslie@example.com",
            "Infinite Views",
            [new Date("2019-12-31"), new Date("2020-01-01")],
            { pricePerNight: 180, specialRequest: "Late Checkout", breakfastIncluded: true}
        );

    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}

main().catch(console.error);

// Add functions that make DB calls here
//helper function for creating a reservation
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

const createReservation = async (client, userEmail, nameOfListing, reservationDates, reservationDetails) => {
    const usersCollection = client.db("sample_airbnb").collection("usersCollection");
    const listingsAndReviewsCollection = client.db("sample_airbnb").collection("listingsAndReviews");

    //using the helper function to create a reservation
    const reservation = createReservationDocument(nameOfListing, reservationDates, reservationDetails);

    //Every transaction and its operations must be associated with a session
    //transactions are used when we are utilising data from multiple documents
    const session = client.startSession();

    //transaction options
    const transactionOptions = {
        readPreference: "primary",
        readConcern: {level: "local"},
        writeConcern: {w: "majority"}
    };

    try {
        //withTransaction() method checks whether the session is currently in trasaction or not
        const transactionResults = await session.withTransaction(async () => {}, transactionOptions);
        
        //adding reservation with the users details
        const usersUpdateResults = await usersCollection.updateOne(
            { userEmail: userEmail },
            { $addToSet: { reservation: reservation} },
            { session }
        );

        console.log(`${usersUpdateResults.matchedCount} document(s) found in the users with the email ${userEmail}`);
        console.log(`${usersUpdateResults.modifiedCount} document(s) was/were updated to include the reservation.`);

        //to make sure that the airbnb listing is not double booked for any date,
        //we need to make sure that we abort the transaction if tit is already booked
        //we need to check the datesReserved array
        const isListingReservedResults = await listingsAndReviewsCollection.findOne(
            { name: nameOfListing, datesReserved: { $in: reservationDates } },
            { session }
        );
        if(isListingReservedResults){
            await session.abortTransaction();
            console.error("This listing is already booked for at least one of the given dates, The reservation could not be created.");
            console.error("Any operations that already occured as part of this transaction will be rolled back");
            return;
        }

        //now to add the reseration in the datesReserved array
        const listingsAndReviewsUpdateResults = await listingsAndReviewsCollection.updateOne(
            { name: nameOfListing },
            { $addToSet: { datesReserved: {$each: reservationDates } } },
            { session }
        );
        console.log(`${listingsAndReviewsUpdateResults.matchedCount} document(s) found in the listingsReviews collection with the name ${nameOfListing}.`);
        console.log(`${listingsAndReviewsUpdateResults.modifiedCount} document(s) was/were updated to include the reservation dates`);

        //we want to know if the transaction succeded
        if(transactionResults){
            console.log(`The reservation was succesfully created.`);
        } else {
            console.log(`The transaction was intentionally aborted.`);
        }
    } catch (e) {
        console.log(`The transaction was aborted due to an unexpected error: ${e}.`);
    } finally {
        await session.endSession();
    }
}