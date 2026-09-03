const SQL = `
-- create
create table if not exists games (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  publishers text[],
  developers text[],
  description text,
  platforms jsonb,
  image text
);

create table if not exists genres (
  id uuid default gen_random_uuid() primary key,
  name text not null unique
);

create table if not exists games_genres (
  game_id uuid not null,
  genre_id uuid not null,
  primary key (game_id, genre_id),
  constraint fk_game foreign key (game_id) references games(id) on delete cascade,
  constraint fk_genre foreign key (genre_id) references genres(id) on delete restrict
);


-- insert
-- with inserted_game as (
--   insert into games values(default, 'test game', array['test'])
--   returning id as game_id
-- ),
-- inserted_genre as (
--   insert into genres values(default, 'test genre')
--   returning id as genre_id
-- )
-- insert into games_genres (game_id, genre_id)
-- select inserted_game.game_id, inserted_genre.genre_id
-- from inserted_game, inserted_genre;
-- 1. Insert the game normally
INSERT INTO games (title, publishers) 
VALUES ('test game 2', ARRAY['test']);

-- 2. Insert the genre normally
INSERT INTO genres (name) 
VALUES ('test genre 2');

-- 3. Insert the connection by looking up the names
INSERT INTO games_genres (game_id, genre_id)
SELECT games.id, genres.id
FROM games, genres
WHERE games.title = 'test game 2' AND genres.name = 'test genre 2';

-- fetch 
select * from games;
select * from genres;
select * from games_genres;
`
