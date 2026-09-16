# Odin Inventory App

A video game inventory application built with Node.js, Express, EJS and PostgreSQL as part of The Odin Project curriculum.

## Installation

1. Install the dependencies:

   ```bash
   npm install
   ```

2. Create the PostgreSQL database:

   ```bash
   createdb game_inventory
   ```

3. Create the tables and seed the data:

   ```bash
   node db/populate_db.js
   ```

4. Set up the environment variables (see the `.env` example below).

## Configuration

### Environment variables

Create a `.env` file in the project root (it's gitignored):

```bash
NODE_ENV = development
HOST = localhost
USER = castaway
DATABASE = game_inventory
PASSWORD = 0001
DB_PORT = 5432
UPLOAD_DIR = ./public/uploads/images/
SECRET = 1234
COOKIE_SECRET = illthinkofabetteroneinproduction
```

| Variable | Purpose |
|----------|---------|
| `NODE_ENV` | Controls whether the session cookie uses `secure` (`production`) |
| `HOST` | PostgreSQL host, read by `db/db_pool.js` |
| `USER` | PostgreSQL username |
| `DATABASE` | Name of the database (`game_inventory`) |
| `PASSWORD` | PostgreSQL password |
| `DB_PORT` | PostgreSQL port (5432) |
| `UPLOAD_DIR` | Destination directory for multer uploads |
| `SECRET` | Password gate for create/update/delete actions |
| `COOKIE_SECRET` | Signing secret for express-session |

### How nodemon and the env argument work

The `dev` script is defined in `package.json` as:

```bash
nodemon --env-file=.env app.js
```

- **nodemon** watches the project files and automatically restarts the server whenever a file changes, so you don't have to restart it manually during development.
- **`--env-file=.env`** is a Node.js flag (Node 20.6+) that loads the variables from `.env` into `process.env` before the application boots. This is why the modules (e.g. `db/db_pool.js`) can read `process.env.HOST`, `process.env.DATABASE`, etc. directly without calling `dotenv.config()` — the `dotenv` imports across the codebase are commented out because of this.
- Always launch the app with `npm run dev`. Running plain `node app.js` will skip loading `.env`, so the environment variables will be missing.

## Packages and setup

| Package | Role | Where it's configured |
|---------|------|------------------------|
| `express` | Web framework | `app.js` — middleware, static files, routes, error handling |
| `ejs` | Template engine | `app.js` — `app.set("views", ...)`, `app.set("view engine", "ejs")`; partials live in `views/partial/` |
| `express-session` | Session/authentication | `app.js` — `secret`, `httpOnly`, `maxAge: 600000` cookie |
| `method-override` | Use PUT/DELETE from HTML forms | `app.js` — `_method` query param; forms use `?_method=PUT` / `?_method=DELETE` |
| `multer` | File uploads | `routes/indexRoute.js` — `dest: process.env.UPLOAD_DIR`, `upload.single("game_cover")` |
| `express-validator` | Server-side validation | `controllers/gameController.js` — `validateGame`, `validateParams`, `validateSearch` chains |
| `pg` | PostgreSQL client | `db/db_pool.js` — `Pool` config reading the `.env` variables |
| `node-cron` | Scheduled jobs | `app.js` — runs `clean_up()` every minute |
| `date-fns` | Date formatting | `views/form.ejs` — `format(new Date(...), 'yyyy-MM-dd')` |
| `serve-favicon` | Serves the favicon | `app.js` — `app.use(favicon(...))` |
| `nodemon` | Auto-restart during development | `package.json` — the `dev` script |

## Project Structure

```
odin-inventory-app/
├── app.js                  # Entry point: Express setup, middleware, cron job
├── routes/
│   └── indexRoute.js       # All route definitions (GET/POST/PUT/DELETE)
├── controllers/
│   └── gameController.js   # Route handlers, validation chains, logic
├── models/
│   └── gameModel.js        # Thin wrapper over the db layer
├── db/
│   ├── db_pool.js          # PostgreSQL connection pool
│   ├── db.js               # All SQL queries and transactions
│   └── populate_db.js      # Schema creation + seed data
├── views/
│   ├── index.ejs           # Homepage with sidebar filters and card grid
│   ├── form.ejs            # Create/Update game form
│   ├── gameDetails.ejs     # Game detail page
│   └── partial/            # Shared partials (modal, errors)
├── public/
│   ├── css/                # Stylesheets
│   ├── js/                 # Client-side scripts
│   └── uploads/images/     # Uploaded game covers
├── constants/
│   └── platforms.js        # Supported platforms list
├── jobs/
│   └── clean_up.js         # Deletes orphaned uploads
├── .env                    # Environment variables (not committed)
└── package.json
```

## Database Schema

PostgreSQL tables (created in `db/populate_db.js`):

- `games` — core game data (title, description, platforms, release_date, image_path, game_engine_id)
- `game_metrics` — copies_sold, budget, revenue (one-to-one with `games`)
- `genres`, `publishers`, `developers`, `game_engines` — dictionary tables
- `games_genres`, `games_publishers`, `games_developers` — many-to-many join tables

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the server with nodemon and the `.env` file (port 8000) |

## Key Features

- Full CRUD for games with cover image uploads
- Search by title plus sidebar filters (genres, publishers, developers)
- Password-protected create/update/delete via session-backed modals
- Many-to-many relationships between games and genres/publishers/developers
- Game metrics (copies sold, budget, revenue)
- Cron job that removes uploaded images no longer referenced in the database