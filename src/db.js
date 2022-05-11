async function main(name) {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";

    const client = new MongoClient(url);
    await client.connect();
    let databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));

    var query1 = {};
    let a = await client.db("fin_db_2").collection(name).find(query1).toArray();
    return a;
    //await client.close();

}

export let res = main;
//export let res = [
//    { _id: 1, name: "John Doe", address: "john@gmail.com" },
//    { _id: 2, name: "Jane Doe", address: "jane@gmail.com" }
//];