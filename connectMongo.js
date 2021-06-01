
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
async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases: ");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`))
}
