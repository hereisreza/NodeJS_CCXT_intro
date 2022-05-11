async function main(name) {
    // name is the pair like "BTC/USDT"
    //db_name is like  "fin_db"
    db_name = "fin_db_2"
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";

    const client = new MongoClient(url);
    await client.connect();
    let databasesList = await client.db().admin().listDatabases();
    //console.log("Databases:");
    //databasesList.databases.forEach(db => console.log(` - ${db.name}`));

    const ccxt = require('ccxt')
    //console.log (ccxt.exchanges);
    let binance = new ccxt.binance({
        id: 'binance',
        'enableRateLimit': true,
        //'rateLimit': 2000,
    });
    //binance.options['adjustForTimeDifference'] = false
    //binance.setSandboxMode(true)
    let markets = await binance.load_markets()
    //console.log (binance.id, markets)
    let start_date = new Date(2017, 0, 1).getTime()
    let end_date = new Date().getTime()
    let data = []
    console.log("Recieving Data ...")

    let sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
    let time_offset = 1000 * 60 * 60 * 24    // 24 hour 
    if (binance.has.fetchOHLCV) {
        while (end_date - time_offset > start_date) {
            console.log("Getting OHLCV data for ", name, "from ", new Date(start_date), ":")
            await sleep(binance.rateLimit) // milliseconds
            let data_temp  = await binance.fetchOHLCV(name, '1d', start_date, 500) // one minute
            const date1 = new Date(data_temp[0][0])
            const date2 = new Date(data_temp[data_temp.length - 1][0])
            console.log("Data Recieved.")
            console.log([date1.toLocaleString('sv'), date2.toLocaleString('sv')].join(' to '))
            //console.log([date1.getTime(), date2.getTime()].join(' to '))
            console.log("Length = ", data_temp.length, "\n")
            for (i in data_temp){
                //console.log(data_temp[i])
                data = data.concat({_id: data_temp[i][0],
                                    open: data_temp[i][1],
                                    high: data_temp[i][2],
                                    low: data_temp[i][3],
                                    close: data_temp[i][4],
                                    volume: data_temp[i][5]
                })
            }
            //console.log(data)
            start_date = date2.getTime() + 1
        }
    }

    const a = await client.db(db_name).collection(name).insertMany(data);
    console.log("Done!");
    //console.log(a.insertedIds);
    await client.close();

    return 0; // a
}
main("BTC/USDT");
//export let res = main;