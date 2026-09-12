import pool from "./db_pool.js";

export async function getGames() {
  const { rows } = await pool.query("SELECT * FROM games");
  const games = [...rows];
  for (let game of games) {
    const genres = await pool.query(
      "SELECT name FROM genres JOIN games_genres ON genres.id = games_genres.genre_id WHERE game_id = $1",
      [game.id],
    );
    game.genres = genres.rows;

    const publishers = await pool.query(
      "SELECT name FROM publishers JOIN games_publishers ON publishers.id = games_publishers.publisher_id WHERE game_id = $1",
      [game.id],
    );
    game.publishers = publishers.rows;

    const developers = await pool.query(
      "SELECT name FROM developers JOIN games_developers ON developers.id = games_developers.developer_id WHERE game_id = $1",
      [game.id],
    );
    game.developers = developers.rows;

    const gameEngine = await pool.query(
      "SELECT name FROM game_engines WHERE id = $1",
      [game.game_engine_id],
    );
    game.gameEngine = gameEngine.rows[0];

    const gameMetrics = await pool.query(
      "SELECT * FROM game_metrics WHERE game_id = $1",
      [game.id],
    );
    game.gameMetrics = gameMetrics.rows;
  }
  return games;
}

export async function getGameById(gameId) {
  const queryText = "SELECT * FROM games WHERE id = $1";
  const { rows } = await pool.query(queryText, [gameId]);
  const game = rows[0];
  if (game) {
    const genres = await pool.query(
      "SELECT name FROM genres JOIN games_genres ON genres.id = games_genres.genre_id WHERE game_id = $1",
      [game.id],
    );
    game.genres = genres.rows;

    const publishers = await pool.query(
      "SELECT name FROM publishers JOIN games_publishers ON publishers.id = games_publishers.publisher_id WHERE game_id = $1",
      [game.id],
    );
    game.publishers = publishers.rows;

    const developers = await pool.query(
      "SELECT name FROM developers JOIN games_developers ON developers.id = games_developers.developer_id WHERE game_id = $1",
      [game.id],
    );
    game.developers = developers.rows;

    const gameEngine = await pool.query(
      "SELECT name FROM game_engines WHERE id = $1",
      [game.game_engine_id],
    );
    game.gameEngine = gameEngine.rows[0];

    const gameMetrics = await pool.query(
      "SELECT * FROM game_metrics WHERE game_id = $1",
      [game.id],
    );
    game.gameMetrics = gameMetrics.rows;
  }
  return game;
}

export async function getGenres() {
  const { rows } = await pool.query("SELECT * FROM genres");
  return rows;
}

export async function getPublishers() {
  const { rows } = await pool.query("SELECT * FROM publishers");
  return rows;
}

export async function getDevelopers() {
  const { rows } = await pool.query("SELECT * FROM developers");
  return rows;
}

export async function getGameEngines() {
  const { rows } = await pool.query("SELECT * FROM game_engines");
  return rows;
}

export async function addMessage(message, username) {
  await pool.query("INSERT INTO messages (text, username) VALUES ($1, $2)", [
    message,
    username,
  ]);
}

export async function insertGame(game) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    let queryText;
    if (game.game_engine) {
      queryText =
        "WITH new_row AS (INSERT INTO game_engines (name) VALUES ($1) ON CONFLICT(name) DO NOTHING RETURNING id) SELECT id FROM new_row UNION SELECT id FROM game_engines WHERE name = $1";

      let { rows: game_engine_id } = await client.query(queryText, [
        game.game_engine,
      ]);
      game.game_engine_id = game_engine_id[0].id;
    }

    queryText =
      "INSERT INTO games (title, description, platforms, release_date, image_path, game_engine_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id";

    let { rows: gameId } = await client.query(queryText, [
      game.title,
      game.description,
      game.platforms,
      game.release_date,
      game.image_path,
      game.game_engine_id,
    ]);

    if (game.genres) {
      queryText =
        "WITH new_row AS (INSERT INTO genres (name) SELECT * FROM UNNEST($1::text[]) ON CONFLICT(name) DO NOTHING RETURNING id) SELECT id FROM new_row UNION SELECT id FROM genres WHERE name = ANY ($1)";

      let { rows: genre_ids } = await client.query(queryText, [game.genres]);
      game.genre_ids = genre_ids.map((g) => g.id);
      let gameIdArr = gameId.map((g) => g.id);
      gameIdArr = Array(game.genre_ids.length).fill(gameIdArr[0]);

      queryText =
        "INSERT INTO games_genres (game_id, genre_id) SELECT * FROM UNNEST($1::UUID[], $2::UUID[])";

      await client.query(queryText, [gameIdArr, game.genre_ids]);
    }

    if (game.publishers) {
      queryText =
        "WITH new_row AS (INSERT INTO publishers (name) SELECT * FROM UNNEST($1::text[]) ON CONFLICT(name) DO NOTHING RETURNING id) SELECT id FROM new_row UNION SELECT id FROM publishers WHERE name = ANY ($1)";

      let { rows: publisher_ids } = await client.query(queryText, [
        game.publishers,
      ]);
      game.publisher_ids = publisher_ids.map((g) => g.id);

      queryText =
        "INSERT INTO games_publishers (game_id, publisher_id) SELECT $1, UNNEST($2::UUID[])";

      await client.query(queryText, [gameId[0].id, game.publisher_ids]);
    }

    if (game.developers) {
      queryText =
        "WITH new_row AS (INSERT INTO developers (name) SELECT * FROM UNNEST($1::text[]) ON CONFLICT(name) DO NOTHING RETURNING id) SELECT id FROM new_row UNION SELECT id FROM developers WHERE name = ANY ($1)";

      let { rows: developer_ids } = await client.query(queryText, [
        game.developers,
      ]);
      game.developer_ids = developer_ids.map((g) => g.id);

      queryText =
        "INSERT INTO games_developers (game_id, developer_id) SELECT $1, UNNEST($2::UUID[])";

      await client.query(queryText, [gameId[0].id, game.developer_ids]);
    }

    queryText =
      "INSERT INTO game_metrics (copies_sold, budget, revenue, game_id) VALUES($1, $2, $3, $4)";
    await client.query(queryText, [
      game.copies_sold,
      game.budget,
      game.revenue,
      gameId[0].id,
    ]);

    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

export async function updateGame(gameId, game) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    let queryText;
    if (game.game_engine) {
      queryText =
        "WITH new_row AS (INSERT INTO game_engines (name) VALUES ($1) ON CONFLICT(name) DO NOTHING RETURNING id) SELECT id FROM new_row UNION SELECT id FROM game_engines WHERE name = $1";

      let { rows: game_engine_id } = await client.query(queryText, [
        game.game_engine,
      ]);
      game.game_engine_id = game_engine_id[0].id;
    }

    // upsert
    queryText =
      "INSERT INTO games (id, title, description, platforms, release_date, game_engine_id) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT(id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, platforms = EXCLUDED.platforms, release_date = EXCLUDED.release_date, game_engine_id = EXCLUDED.game_engine_id";

    // update
    // queryText = "UPDATE games SET (title, description, platforms, release_date, game_engine_id) = ($2, $3, $4, $5, $6) WHERE id = $1;"

    let res = await client.query(queryText, [
      gameId,
      game.title,
      game.description,
      game.platforms,
      game.release_date,
      game.game_engine_id,
    ]);

    if (game.image_path || game.image_path === null) {
      queryText = "UPDATE games SET image_path = $2 WHERE id = $1;";
      await client.query(queryText, [gameId, game.image_path]);
    }

    if (game.genres) {
      queryText = "DELETE FROM games_genres WHERE game_id = $1";

      await client.query(queryText, [gameId]);

      queryText =
        "WITH new_row AS (INSERT INTO genres (name) SELECT * FROM UNNEST($1::text[]) ON CONFLICT(name) DO NOTHING RETURNING id) SELECT id FROM new_row UNION SELECT id FROM genres WHERE name = ANY ($1)";

      let { rows: genre_ids } = await client.query(queryText, [game.genres]);
      game.genre_ids = genre_ids.map((g) => g.id);

      queryText =
        "INSERT INTO games_genres (game_id, genre_id) SELECT $1, UNNEST($2::UUID[])";

      await client.query(queryText, [gameId, game.genre_ids]);
    }

    if (game.publishers) {
      queryText = "DELETE FROM games_publishers WHERE game_id = $1";

      await client.query(queryText, [gameId]);

      queryText =
        "WITH new_row AS (INSERT INTO publishers (name) SELECT * FROM UNNEST($1::text[]) ON CONFLICT(name) DO NOTHING RETURNING id) SELECT id FROM new_row UNION SELECT id FROM publishers WHERE name = ANY ($1)";

      let { rows: publisher_ids } = await client.query(queryText, [
        game.publishers,
      ]);
      game.publisher_ids = publisher_ids.map((g) => g.id);

      queryText =
        "INSERT INTO games_publishers (game_id, publisher_id) SELECT $1, UNNEST($2::UUID[])";

      await client.query(queryText, [gameId, game.publisher_ids]);
    }

    if (game.developers) {
      queryText = "DELETE FROM games_developers WHERE game_id = $1";

      await client.query(queryText, [gameId]);

      queryText =
        "WITH new_row AS (INSERT INTO developers (name) SELECT * FROM UNNEST($1::text[]) ON CONFLICT(name) DO NOTHING RETURNING id) SELECT id FROM new_row UNION SELECT id FROM developers WHERE name = ANY ($1)";

      let { rows: developer_ids } = await client.query(queryText, [
        game.developers,
      ]);
      game.developer_ids = developer_ids.map((g) => g.id);

      queryText =
        "INSERT INTO games_developers (game_id, developer_id) SELECT $1, UNNEST($2::UUID[])";

      await client.query(queryText, [gameId, game.developer_ids]);
    }

    queryText =
      "UPDATE game_metrics SET (copies_sold, budget, revenue) = ($2, $3, $4) WHERE game_id = $1;";

    await client.query(queryText, [
      gameId,
      game.copies_sold,
      game.budget,
      game.revenue,
    ]);

    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
