import { MongoClient } from "mongodb";
import { ATLAS_URI } from "../src/utils/constants.mjs";

const connectionString = ATLAS_URI || "";
const client = new MongoClient(connectionString);
let conn;
try {
  conn = await client.connect();
} catch(e) {
  console.error(e);
}
let db = conn.db("local");
export default db;