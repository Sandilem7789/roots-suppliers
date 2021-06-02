
const MongoClient = require('mongodb').MongoClient;

/*
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
*/

async function main() {
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
    const uri = "mongodb+srv://sandile:sandilem7789@testcluster.hjbaj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    //functions that will interact with the database, wrapped in a try catch block.
    try{
        //using the MongoClient to connect to our cluster
        //nothing will happen untill we are connected to the cluster
        await client.connect();

        //Now let's interact with the database
        await listDatabases(client);

        //CRUD(Create): insertOne
         /*await createListing(client, {
            name: "Lovely Loft",
            summary: "A lovely loft in the iNanda Area",
            bedrooms: 3,
            bathrooms: 3
        })

        //CRUD(Create): insertMany
        await createMultipleListings(client, [
            {
                name: "Infinite Views",
                summary: "Modern home with infinite views from the infinity pool",
                property_type: "House",
                bedrooms: 5,
                bathrooms: 4.5,
                beds: 5
            },
            {
                name: "Private room in London",
                property_type: "Apartment",
                bedrooms: 1,
                bathroom: 1
            },
            {
                name: "Beautiful Beach House",
                summary: "Enjoy relaxed beach living in this house with a private beach",
                bedrooms: 4,
                bathrooms: 2.5,
                beds: 7,
                last_review: new Date()
            }
        ]);*/

        //CRUD(Read): findOne method
        await findOneListingByName(client, "Lovely Loft");

    } catch (e) {
        console.error(e);
    }
    finally{
        await client.close();
    }
    
}

//calling the main function
main().catch(console.error)

//list databases function: retrieving the list of databses
async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases: ");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}

/**CRUD OPERATIONS**/

//CREATE: insertOne method
async function createListing(client, newListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertOne(newListing);
    console.log(`New Listing created with the following _id: ${result.insertedId}`);
}

//CREATE: insertMany method
async function createMultipleListings(client, newListings){
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertMany(newListings);

    console.log(`${result.insertedCount} new listing(s) created, created with the following id(s):`);
    console.log(result.insertedIds);
}

//-----------------------------------------------------------------------------------------------------------
//READ: findOne method

async function findOneListingByName(client, nameOfListing){
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({ name: nameOfListing });

    if(result){
        console.log(`Found listing with the name '${nameOfListing}'`);
        console.log(result);
    } else {
        console.log(`No listing found with the name '${nameOfListing}'`);
    }
}