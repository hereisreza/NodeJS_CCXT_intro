async function main() {
    var MongoClient = require('mongodb').MongoClient
    var url = "mongodb://localhost:27017/"

    const client = new MongoClient(url)
    await client.connect();

    rank = []
    let query1 = {}
    decisions = await client.db("fin_db_2").collection("decisions").find(query1).toArray()
    let analysts_raw = decisions.map(a => a["analyst"])
    let analysts = [... new Set(analysts_raw)].sort()
    console.log("Analysts Are ", analysts)
    for (let a in analysts) {
        let query1 = { analyst: analysts[a] }
        let all_decisions = await client.db("fin_db_2").collection("decisions").find(query1).toArray()
        let query2 = {$and: [{analyst_decision: "confirm"}, query1]}
        let confirmed_decisions_raw = await client.db("fin_db_2").collection("decisions").find(query2).toArray()
        let confirmed_decisions = confirmed_decisions_raw.map(a => a["signal"])
        let num_true = 0
        for (let s in confirmed_decisions){
            let query3 = {$or: [{status: "stop"}, {status: "target"}]}
            let query4 = {$and: [{signal_number: confirmed_decisions[s]}, query3]}
            let true_decisions = await client.db("fin_db_2").collection("signals").find(query4).toArray()
            num_true += true_decisions.length
        }
        console.log(analysts[a], ":", all_decisions.length, "Decisions &",
            confirmed_decisions_raw.length, "Confirmed Decisions &", num_true, "True decisions.")
        rank = rank.concat({analyst: analysts[a],
                                all_decisions: all_decisions.length,
                                true_decisions: num_true,
                                accuracy: (num_true/all_decisions.length).toPrecision(2) * 100
        })
        rank = rank.sort(function(a, b) {
            return b["accuracy"] - a["accuracy"];
          });
    }
    await client.close()
    console.log("\n", rank)
    return rank;
}
main()
