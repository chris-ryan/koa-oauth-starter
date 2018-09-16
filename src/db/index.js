import { MongoClient } from 'mongodb';

const dbUrl = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST_NAME}:${process.env.MONGO_PORT}/${process.env.MONGO_DB_NAME}`;
const db;

/** Connect to the database, stores the mongoClient instance in memory */
export async function dbConnect() {
  // Use connect method to connect to the Server
  db = db === null ? await MongoClient.connect(dbUrl).catch((err) => {
    throw err;
  }) : db;
}

export function getInstance() {
  if(!db){
    dbConnect();
  } else {
    return db;
  }
}