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
  console.log(game);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    let queryText =
      "INSERT INTO game_engines (name) SELECT * FROM UNNEST($1::text[]) ON CONFLICT(name) DO NOTHING RETURNING id";

    let res = await client.query(queryText, [game.game_engines]);

    console.log("res:", res);
    // queryText =
    //   "INSERT INTO games (title, description, platforms, release_date, image_path, ) SELECT * FROM UNNEST($1::text[]) ON CONFLICT(name) DO NOTHING";
    //
    // let res = await client.query(queryText, [game.game_engines]);

    //   let queryText = "INSERT INTO game_engines(name) VALUES($1) ON CONFLICT(name) DO NOTHING;";
    //
    // let test = ["Unity", "kappa", "test", "trolololo"];
    // let queryText =
    //
    //
    // queryText = 'INSERT INTO games(title, description) VALUES($1, $2)'

    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

// insert into game_engines
// values(default, 'Unity');
//
// insert into games (title, description, platforms, release_date, image_path, game_engine_id)
// values ('Disco Elysium', 'A CRPG in which, waking up in a hotel room a total amnesiac with highly opinionated voices in his head, a middle-aged detective on a murder case inadvertently ends up playing a part in the political dispute between a local labour union and a larger international body, all while struggling to piece together his past, diagnose the nature of the reality around him and come to terms with said reality.', array['Mac', 'PC'], ('2019-10-15'), '/uploads/images/disco elysium.jpg', (select id from game_engines where name='Unity'));
//
// insert into publishers
// values (default, 'ZA/UM');
//
// insert into developers
// values (default, 'ZA/UM');
//
// insert into genres (name)
// values ('Adventure');
//
// insert into genres (name)
// values ('Role-playing (RPG)');
//
// insert into genres
// values (default, 'Turn-based strategy (TBS)');
//
// insert into games_genres (game_id, genre_id)
// select games.id, genres.id
// from games, genres
// where games.title = 'Disco Elysium' AND genres.name = 'Adventure';
//
// insert into games_genres (game_id, genre_id)
// select games.id, genres.id
// from games, genres
// where games.title = 'Disco Elysium' AND genres.name = 'Role-playing (RPG)';
//
// insert into games_genres (game_id, genre_id)
// select games.id, genres.id
// from games, genres
// where games.title = 'Disco Elysium' AND genres.name = 'Turn-based strategy (TBS)';
//
// insert into games_publishers (game_id, publisher_id)
// select games.id, publishers.id
// from games, publishers
// where games.title = 'Disco Elysium' AND publishers.name = 'ZA/UM';
//
// insert into games_developers (game_id, developer_id)
// select games.id, developers.id
// from games, developers
// where games.title = 'Disco Elysium' AND developers.name = 'ZA/UM';
//
// insert into game_metrics
// values (default, 4700000, 5000000, 205000000, (select id from games where title='Disco Elysium'));
