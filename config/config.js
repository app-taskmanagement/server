require('dotenv').config(); // magic

module.exports = {
  "development": {
    "username"  : "postgres",
    "password"  : "p4ssw0rd",
    "database"  : "suratizin",
    "host"      : "127.0.0.1",
    "dialect"   : "postgres"
  },
  "production": {
    "username"      : process.env.PG_USERNAME,
    "password"      : process.env.PG_PASSWORD,
    "database"      : process.env.PG_DATABASE,
    "host"          : process.env.PG_HOST,
    "dialect"       : "postgres",
    "ssl"           : true,
    "dialectOptions": { "ssl": {"require":true} }
  },
  "mongodb_atlas": {
    "urlDatabase": "mongodb://mongodb:" + process.env.MONGO_PASSWORD + "@cluster0-shard-00-00-b6g1x.mongodb.net:27017,cluster0-shard-00-01-b6g1x.mongodb.net:27017,cluster0-shard-00-02-b6g1x.mongodb.net:27017/" + process.env.MONGO_DATABASE + "?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin"
  },
  "redis": {
    "port": 16624,
    "host": process.env.REDIS_HOST,
    "auth": process.env.REDIS_AUTH,
    "db"  : process.env.REDIS_DB,
  },
  "redis_local": {
    "port": 3055,
    "host": "127.0.0.1"
  }
}
