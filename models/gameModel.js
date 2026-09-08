import * as db from "../db/db.js";

export async function getGames() {
  return await db.getGames();
}

export async function getGenres() {
  return await db.getGenres();
}

export async function getPublishers() {
  return await db.getPublishers();
}

export async function getDevelopers() {
  return await db.getDevelopers();
}

export async function getGameEngines() {
  return await db.getGameEngines();
}

export async function insertGame(game) {
  return await db.insertGame(game);
}
