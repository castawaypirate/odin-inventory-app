import pool from "./db_pool.js";

export async function getGames() {
  const { rows } = await pool.query("SELECT * FROM games");
  return rows;
}

export async function getGenres() {
  const { rows } = await pool.query("SELECT * FROM genres");
  return rows;
}
