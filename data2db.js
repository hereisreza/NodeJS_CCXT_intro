async function main() {
    n = 100
    n_analyst = 5
    signals = []
    for (let i = 0; i < n; i++) {
        signals = signals.concat({
            signal_number: i,
            status: ["open", "target", "stop"][Math.floor(Math.random() * 3)]
        })
    }
    //console.log(signals)

    decisions = []
    for (let i = 0; i < n; i++) {
        decisions = decisions.concat({
            analyst: "Analyst_" + String(Math.floor(Math.random() * n_analyst)),
            signal: i,
            analyst_decision: ["confirm", "reject"][Math.floor(Math.random() * 2)]
        })
    }
    //console.log(decisions)

    db_name = "fin_db_2"
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";

    const client = new MongoClient(url);
    await client.connect();
    await client.db(db_name).collection("signals").insertMany(signals);
    await client.db(db_name).collection("decisions").insertMany(decisions)
    console.log("Done!");
    await client.close();

    return 0;
}
main();