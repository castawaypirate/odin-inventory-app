import * as gameModel from "../models/gameModel.js";
import { platforms } from "../constants/platforms.js";
import { body, query, validationResult, matchedData } from "express-validator";

const validateMessage = [
  body("title").trim().notEmpty().withMessage("Title cannot be empty"),
  body("description").trim().optional(),
  body("platforms")
    .toArray()
    .custom((values) => {
      if (!values) {
        return true;
      }
      if (Array.isArray(values)) {
        for (let value of values) {
          if (!platforms.includes(value)) {
            throw new Error(
              "Please select a valid platform from the checkbox list",
            );
          }
        }
      } else {
        if (!platforms.includes(values)) {
          throw new Error(
            "Please select a valid platform from the checkbox list",
          );
        }
      }
      return true;
    }),
  // 1. toArray() guarantees the incoming data becomes an array.
  // ('PC' becomes ['PC'], undefined becomes [])
  // body('platforms').toArray(),
  // 2. The .* means "run this check on every single item inside the array"
  // body('platforms.*')
  //   .isIn(platforms)
  //   .withMessage("Please select a valid platform from the checkbox list")
  body("game_cover").custom((value, { req }) => {
    if (req.file === undefined) {
      return true;
    }
    if (!req.file.mimetype.startsWith("image/")) {
      throw new Error("Cover must be an image");
    }
    if (req.file.size > 2 * 1024 * 1024) {
      throw new Error("Cover image must not be more than 2MB");
    }
    return true;
  }),
  body("genres").optional().toArray(),
  body("publishers").optional().toArray(),
  body("developers").optional().toArray(),
  body("game_engine")
    .optional()
    .customSanitizer((value) => {
      if (value === "-1") {
        return;
      }
      return value;
    }),
  body("copies_sold")
    .trim()
    .optional({ values: "falsy" })
    .isNumeric()
    .withMessage("Copies sold must be a number")
    .isInt()
    .withMessage("Copies sold must be an integer"),
  body("budget")
    .trim()
    .optional({ values: "falsy" })
    .isNumeric()
    .withMessage("Budget must be a number"),
  body("revenue")
    .trim()
    .optional({ values: "falsy" })
    .isNumeric()
    .withMessage("Revenue must be a number"),
];

export async function getIndex(req, res) {
  const games = await gameModel.getGames();
  if (games.length === 0) {
    console.log("no games in the inventory, bruh");
  }
  console.log(games);
  res.render("index", { games: games });
  // res.render("index");
}

export async function createForm(req, res) {
  const genres = await gameModel.getGenres();
  const publishers = await gameModel.getPublishers();
  const developers = await gameModel.getDevelopers();
  const gameEngines = await gameModel.getGameEngines();
  res.render("form", {
    action: "/create",
    platforms: platforms,
    genres: genres,
    publishers: publishers,
    developers: developers,
    game_engines: gameEngines,
  });
}

export async function updateForm(req, res) {
  const game = { title: "test" };
  res.render("form", { action: `/update/${game.id}`, game: game });
}

export const createGame = [
  validateMessage,
  async (req, res) => {
    const genres = await gameModel.getGenres();
    const publishers = await gameModel.getPublishers();
    const developers = await gameModel.getDevelopers();
    const gameEngines = await gameModel.getGameEngines();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // console.log(req.body);
      return res.status(400).render("form", {
        errors: errors.array(),
        action: "/create",
        platforms: platforms,
        genres: genres,
        publishers: publishers,
        developers: developers,
        game_engines: gameEngines,
        game: req.body,
      });
    }
    const game = matchedData(req);
    if (req.file) {
      game.image_path = req.file.path.replace("public", "");
    }

    // console.log(game);

    // we dont need extension we just use path

    const dbRes = await gameModel.insertGame(game);

    return res.render("form", {
      action: "/create",
      platforms: platforms,
      genres: genres,
      publishers: publishers,
      developers: developers,
      game_engines: gameEngines,
    });
    // res.redirect("/");
  },
];

export const updateGame = [
  validateMessage,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .render("form", { errors: errors.array(), platforms: platforms });
    }
    // const {title, description, platform } = matchedData(req);
    const game = matchedData(req);
    console.log(game);
  },
];
