import dotenv from "dotenv";
import { Client } from "pg";

dotenv.config();

async function main() {
  const client = new Client({
    connectionString: `postgresql://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.DB_PORT}/${process.env.DATABASE}`,
  });
  await client.connect();

  let game = {
    game_engines: "test",
  };

  // let test = ["Unity", "kappa", "test", "trolololo"];
  let queryText =
    "insert into game_engines (name) select * from unnest($1::text[]) on conflict(name) do nothing";

  // let queryText =
  //   "INSERT INTO game_engines(name) VALUES($1) ON CONFLICT(name) DO NOTHING;";
  let res = await client.query(queryText, [game.game_engines]);

  await client.end();
}

main();
