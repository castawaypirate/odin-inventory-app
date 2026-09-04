import pool from "./db_pool.js";

// export async function getGames() {
//   const { rows } = await pool.query("SELECT * FROM games");
//   return rows;
// }

export async function getGames() {
  const { rows } = await pool.query("SELECT * FROM games");
  const games = [...rows]
  for (let game of games) {
    const genres = await pool.query("SELECT name FROM genres JOIN games_genres ON genres.id = games_genres.genre_id WHERE game_id = $1", [game.id]);
    game.genres = genres.rows;

    const publishers = await pool.query("SELECT name FROM publishers JOIN games_publishers ON publishers.id = games_publishers.publisher_id WHERE game_id = $1", [game.id]);
    game.publishers = publishers.rows;

    const developers = await pool.query("SELECT name FROM developers JOIN games_developers ON developers.id = games_developers.developer_id WHERE game_id = $1", [game.id]);
    game.developers = developers.rows;

    const gameEngine = await pool.query("SELECT name FROM game_engines WHERE id = $1", [game.game_engine_id]);
    game.gameEngine = gameEngine.rows[0];

    const gameMetrics = await pool.query("SELECT * FROM game_metrics WHERE game_id = $1", [game.id]);
    game.gameMetrics = gameMetrics.rows;
  }
  return games;
}

export async function getGenres() {
  const { rows } = await pool.query("SELECT * FROM genres");
  return rows;
}

// export async function getGamesWithGenres() {
//   const { rows } = await pool.query("SELECT * FROM games");
//   const games = [...rows]
//   for (let game of games) {
//     const { rows } = await pool.query("SELECT name FROM genres JOIN games_genres ON genres.id = games_genres.genre_id WHERE game_id = $1", [game.id]);
//     game.genres = rows;
//   }
// }
