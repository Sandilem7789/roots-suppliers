const MongoClient = require("mongodb").MongoClient;

let main = async () => {
    const uri = "mongodb+srv://sandile:sandilem7789@testcluster.hjbaj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        await createUser(client, {
            name: "Leslie Examples",
            userEmail: "leslie@example.com"
        });
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main();

//function for creating a user
let createUser = async (client, userDetails) => {
    const result = await client.db("sample_airbnb").collection("usersCollection").insertOne(userDetails);
    console.log(`User with id ${result.insertedId}, has been created`);
}