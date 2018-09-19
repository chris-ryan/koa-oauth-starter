import { MongoClient } from 'mongodb';

const dbUrl = `mongodb://${process.env.MONGO_HOST_NAME}:${process.env.MONGO_PORT}`;
let connection = null;

/** Connect to the database, stores the mongoClient instance in memory */
export async function dbConnect() {
  console.log(`connecting to database: ${process.env.MONGO_DB_NAME} @ ${dbUrl}`);
  // Use connect method to connect to the Server
  let client = await MongoClient.connect(dbUrl, {
    auth: { user: process.env.MONGO_USERNAME, password: process.env.MONGO_PASSWORD },
    authSource: process.env.MONGO_DB_NAME,
    useNewUrlParser: true,
  })
  .catch((err) => { throw err; });
  let db = client.db(process.env.MONGO_DB_NAME)
  connection = db;
  return db;
}

export async function getCollection(collectionName) {
  if(!connection){
    throw new Error('Call connect first!');
  } else {
    // let db = await dbConnect();
    return connection.collection(collectionName);
  }
}
