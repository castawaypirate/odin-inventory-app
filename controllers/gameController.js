import * as gameModel from "../models/gameModel.js";

export async function getIndex(req, res) {
  // const games = await gameModel.getGamesWithGenres();
  const games = await gameModel.getGames();
  if (!games) {
    console.log("no games in the inventory, bruh");
  }
  console.log(games);
  res.render("index", { games: games });
  // res.render("index");
}
