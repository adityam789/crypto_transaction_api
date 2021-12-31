import cassandra from "cassandra-driver";
import fs from "fs";
// @ts-ignore
import * as sigV4 from "aws-sigv4-auth-cassandra-plugin";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const auth = new sigV4.SigV4AuthProvider({
  region: "us-east-2",
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.ACCESS_KEY_SECRET,
});

const sslOptions1 = {
  ca: [fs.readFileSync(path.join("certificates","sf-class2-root.crt"), "utf-8")],
  host: `cassandra.us-east-2.amazonaws.com`,
  rejectUnauthorized: true,
};

const client = new cassandra.Client({
  contactPoints: [`cassandra.us-east-2.amazonaws.com`],
  localDataCenter: "us-east-2",
  authProvider: auth,
  sslOptions: sslOptions1,
  protocolOptions: { port: 9142 },
  keyspace: "crypto_api",
});

const create_user_table_query = "create table if not exists users (id text primary key, name text, email text, password text, created_at timestamp, updated_at timestamp)";
const create_wallet_table_query = "create table if not exists wallets (id text primary key, user_id text, currency text, balance float, created_at timestamp, updated_at timestamp, description text)";

client
  .execute(create_user_table_query)
  .then((result) => console.log("Row from Keyspaces %s", result.rows[0]))
  .catch((e) => console.log(`${e}`));

client
  .execute(create_wallet_table_query)
  .then((result) => console.log("Row from Keyspaces %s", result.rows[0]))
  .catch((e) => console.log(`${e}`));

// client.on('log', (level, loggerName, message, furtherInfo) => {
//   console.log(`${level} - ${loggerName}:  ${message}`);
// });

export default client;

// const query = "select * from crypto_api.users;";

// client
//   .execute(query)
//   .then((result) => console.log("Row from Keyspaces %s", result.rows[0]))
//   .catch((e) => console.log(`${e}`));
