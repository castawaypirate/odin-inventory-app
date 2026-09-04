import * as db from "../db/db.js";

export async function getGames() {
  return await db.getGames();
}

// export async function getGamesWithGenres() {
//   return await db.getGamesWithGenres();
// }
