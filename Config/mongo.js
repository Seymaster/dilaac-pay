  /*
  |--------------------------------------------------------------------------
  | Default Connection
  |--------------------------------------------------------------------------
  |
  | Connection defines the default connection settings to be used while
  | interacting with MongoDB databases.
  |
  */


module.exports = {
    dbUrl: `mongodb+srv://${process.env.dbUsername}:${process.env.dbPassword}@cluster0.2ip3w.mongodb.net/dilaac`
}