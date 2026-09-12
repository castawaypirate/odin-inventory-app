import * as gameModel from "../models/gameModel.js";
import { platforms } from "../constants/platforms.js";
import {
  body,
  query,
  param,
  validationResult,
  matchedData,
  check,
} from "express-validator";
import { format } from "date-fns";

const validateParams = [param("gameId").isUUID()];

const validateGame = [
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

  body("release_date").optional({ values: "falsy" }).isISO8601(),
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
  res.render("index", { games: games });
}

export const getGameDetails = [
  validateParams,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("gameDetails", {
        error: 400,
      });
    }
    const gameId = matchedData(req);
    const game = await gameModel.getGameById(gameId.gameId);

    if (!game) {
      return res.status(404).render("gameDetails", {
        error: 404,
      });
    }

    if (game.release_date) {
      game.release_date = new Date(game.release_date).toDateString();
    }
    game.gameMetrics = game.gameMetrics[0];
    res.render("gameDetails", { game: game });
  },
];

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
    format: format,
  });
}

export const createGame = [
  validateGame,
  async (req, res) => {
    const genres = await gameModel.getGenres();
    const publishers = await gameModel.getPublishers();
    const developers = await gameModel.getDevelopers();
    const gameEngines = await gameModel.getGameEngines();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("form", {
        errors: errors.array(),
        action: "/create",
        platforms: platforms,
        genres: genres,
        publishers: publishers,
        developers: developers,
        game_engines: gameEngines,
        game: req.body,
        format: format,
      });
    }
    const game = matchedData(req);
    if (req.file) {
      game.image_path = req.file.path.replace("public", "");
    }

    const dbRes = await gameModel.insertGame(game);

    res.redirect("/");
  },
];

export const updateForm = [
  validateParams,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("form", {
        error: 400,
      });
    }
    const gameId = matchedData(req);
    const game = await gameModel.getGameById(gameId.gameId);

    if (!game) {
      return res.status(404).render("form", {
        error: 404,
      });
    }

    if (game.genres.length > 0) game.genres = game.genres.map((g) => g.name);
    if (game.publishers.length > 0)
      game.publishers = game.publishers.map((g) => g.name);
    if (game.developers.length > 0)
      game.developers = game.developers.map((g) => g.name);
    if (game.gameEngine) game.game_engine = game.gameEngine.name;

    game.copies_sold = game.gameMetrics[0].copies_sold;
    game.budget = game.gameMetrics[0].budget;
    game.revenue = game.gameMetrics[0].revenue;

    const genres = await gameModel.getGenres();
    const publishers = await gameModel.getPublishers();
    const developers = await gameModel.getDevelopers();
    const gameEngines = await gameModel.getGameEngines();
    res.render("form", {
      action: `/update/${game.id}?_method=PUT`,
      platforms: platforms,
      genres: genres,
      publishers: publishers,
      developers: developers,
      game_engines: gameEngines,
      game: game,
      format: format,
    });
  },
];

export const updateGame = [
  validateGame,
  async (req, res) => {
    const gameId = req.params.gameId;
    const genres = await gameModel.getGenres();
    const publishers = await gameModel.getPublishers();
    const developers = await gameModel.getDevelopers();
    const gameEngines = await gameModel.getGameEngines();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("form", {
        errors: errors.array(),
        action: `/update/${gameId}?_method=PUT`,
        platforms: platforms,
        genres: genres,
        publishers: publishers,
        developers: developers,
        game_engines: gameEngines,
        game: req.body,
        format: format,
      });
    }

    const game = matchedData(req);
    if (game.game_cover !== "filled") {
      game.image_path = null;
    }
    if (req.file) {
      game.image_path = req.file.path.replace("public", "");
    }

    const dbRes = await gameModel.updateGame(gameId, game);

    req.body.image_path = "it's something";
    return res.render("form", {
      action: `/update/${gameId}?_method=PUT`,
      platforms: platforms,
      genres: genres,
      publishers: publishers,
      developers: developers,
      game_engines: gameEngines,
      game: req.body,
      format: format,
    });

    // res.redirect("/update/gameid");
  },
];
