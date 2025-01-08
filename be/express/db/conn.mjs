import { MongoClient } from "mongodb";
import { ATLAS_URI, DB_NAME } from "../src/utils/constants.mjs";

const connectionString = ATLAS_URI || "";
const client = new MongoClient(connectionString);
let conn;
try {
  conn = await client.connect();
} catch(e) {
  console.error(e);
}
let db = conn.db(DB_NAME);
export default db;