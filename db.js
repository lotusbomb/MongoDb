const {MongoClient} = require('mongodb')//destructure the mongo client object from the default value returned from mongodb

let dbConnection
let uri = 'mongodb+srv://lotus:4444@cluster1.lmdi9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1'

module.exports= {
    //start a connection to database
    connectToDb: (cb) => {
        MongoClient.connect(uri)
        .then((client) => {
            dbConnection = client.db()
            return cb()
        })
        .catch (error => {
            console.log(error)
            return cb(error)
        })
    },
    //return database
    getDb: () => dbConnection
}