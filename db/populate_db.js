import { Client } from "pg";

import dotenv from "dotenv";
dotenv.config();

const SQL = `
-- create
create table if not exists developers (
  id uuid default gen_random_uuid() primary key,
  name text not null unique
);

create table if not exists publishers (
  id uuid default gen_random_uuid() primary key,
  name text not null unique
);

create table if not exists genres (
  id uuid default gen_random_uuid() primary key,
  name text not null unique
);

create table if not exists game_engines (
  id uuid default gen_random_uuid() primary key,
  name text not null unique
);

create table if not exists games (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  platforms text[],
  release_date date,
  image_path text,
  game_engine_id uuid,
  constraint fk_game_engine foreign key (game_engine_id) references game_engines(id) on delete restrict
);

create table if not exists game_metrics (
  id uuid default gen_random_uuid() primary key,
  copies_sold int,
  budget bigint,
  revenue bigint,
  game_id uuid unique,
  constraint fk_game foreign key (game_id) references games(id) on delete cascade
);

create table if not exists games_genres (
  game_id uuid not null,
  genre_id uuid not null,
  primary key (game_id, genre_id),
  constraint fk_game foreign key (game_id) references games(id) on delete cascade,
  constraint fk_genre foreign key (genre_id) references genres(id) on delete restrict
);

create table if not exists games_developers (
  game_id uuid not null,
  developer_id uuid not null,
  primary key (game_id, developer_id),
  constraint fk_game foreign key (game_id) references games(id) on delete cascade,
  constraint fk_developer foreign key (developer_id) references developers(id) on delete restrict
);

create table if not exists games_publishers (
  game_id uuid not null,
  publisher_id uuid not null,
  primary key (game_id, publisher_id),
  constraint fk_game foreign key (game_id) references games(id) on delete cascade,
  constraint fk_publisher foreign key (publisher_id) references publishers(id) on delete restrict
);

-- insert
insert into game_engines
values(default, 'Unity');

insert into games (title, description, platforms, release_date, image_path, game_engine_id) 
values ('Disco Elysium', 'A CRPG in which, waking up in a hotel room a total amnesiac with highly opinionated voices in his head, a middle-aged detective on a murder case inadvertently ends up playing a part in the political dispute between a local labour union and a larger international body, all while struggling to piece together his past, diagnose the nature of the reality around him and come to terms with said reality.', array['macOS', 'Windows'], ('2019-10-15'), '/uploads/images/disco elysium.jpg', (select id from game_engines where name='Unity'));

insert into publishers
values (default, 'ZA/UM');

insert into developers
values (default, 'ZA/UM');

insert into genres (name)
values ('Adventure');

insert into genres (name)
values ('Role-playing (RPG)');

insert into genres
values (default, 'Turn-based strategy (TBS)');

insert into games_genres (game_id, genre_id)
select games.id, genres.id
from games, genres
where games.title = 'Disco Elysium' AND genres.name = 'Adventure';

insert into games_genres (game_id, genre_id)
select games.id, genres.id
from games, genres
where games.title = 'Disco Elysium' AND genres.name = 'Role-playing (RPG)';

insert into games_genres (game_id, genre_id)
select games.id, genres.id
from games, genres
where games.title = 'Disco Elysium' AND genres.name = 'Turn-based strategy (TBS)';

insert into games_publishers (game_id, publisher_id)
select games.id, publishers.id
from games, publishers
where games.title = 'Disco Elysium' AND publishers.name = 'ZA/UM';

insert into games_developers (game_id, developer_id)
select games.id, developers.id
from games, developers
where games.title = 'Disco Elysium' AND developers.name = 'ZA/UM';

insert into game_metrics
values (default, 4700000, 5000000, 205000000, (select id from games where title='Disco Elysium'));

-- ==========================================
-- 1. POPULATE DICTIONARY TABLES
-- ==========================================

-- Engines
INSERT INTO game_engines (name) VALUES 
('Unreal Engine 5'), 
('Proprietary Engine'), 
('Godot') 
ON CONFLICT (name) DO NOTHING;

-- Publishers
INSERT INTO publishers (name) VALUES 
('Bandai Namco Entertainment'), 
('Kepler Interactive'), 
('Grinding Gear Games'), 
('Team Cherry'), 
('Mega Crit'), 
('Krafton'), 
('AdHoc Studio') 
ON CONFLICT (name) DO NOTHING;

-- Developers
INSERT INTO developers (name) VALUES 
('FromSoftware'), 
('Sandfall Interactive'), 
('Grinding Gear Games'), 
('Team Cherry'), 
('Mega Crit'), 
('Unknown Worlds Entertainment'), 
('AdHoc Studio') 
ON CONFLICT (name) DO NOTHING;

-- Genres
INSERT INTO genres (name) VALUES 
('Action role-playing (Action RPG)'), 
('Metroidvania'), 
('Hack and slash'), 
('Action-adventure'), 
('Roguelike deck-building'), 
('Strategy'), 
('Survival')
ON CONFLICT (name) DO NOTHING;


-- ==========================================
-- 2. POPULATE GAMES
-- ==========================================

INSERT INTO games (title, description, platforms, release_date, image_path, game_engine_id) VALUES
(
  'Elden Ring', 
  'The Golden Order has been broken. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.',
  array['Windows', 'PlayStation', 'Xbox'],
  '2022-02-25',
  '/uploads/images/elden ring.jpg',
  (SELECT id FROM game_engines WHERE name = 'Proprietary Engine')
),
(
  'Clair Obscur: Expedition 33',
  'Lead Expedition 33 in their quest to destroy the Paintress so that she can never paint death again. Explore wonders of a fantasy world inspired by Belle Époque France and battle unique enemies in this turn-based RPG.',
  array['Windows', 'PlayStation', 'Xbox'],
  '2025-04-24',
  '/uploads/images/expedition 33.jpg',
  (SELECT id FROM game_engines WHERE name = 'Unreal Engine 5')
),
(
  'Path of Exile 2',
  'Path of Exile 2 is a next generation free-to-play Action RPG from Grinding Gear Games, featuring co-op for up to six players.',
  array['Windows', 'macOS', 'PlayStation', 'Xbox'],
  '2024-11-15',
  '/uploads/images/path of exile 2.jpg',
  (SELECT id FROM game_engines WHERE name = 'Proprietary Engine')
),
(
  'Hollow Knight: Silksong',
  'Play as Hornet, princess-protector of Hallownest, and adventure through a whole new kingdom ruled by silk and song!',
  array['Windows', 'macOS', 'Linux', 'Nintendo Switch', 'PlayStation', 'Xbox'],
  '2025-09-04',
  '/uploads/images/silksong.jpg',
  (SELECT id FROM game_engines WHERE name = 'Unity')
),
(
  'Slay the Spire 2',
  'The iconic roguelike deckbuilder returns. Craft unique decks, encounter bizarre creatures, and discover relics of immense power in Slay the Spire 2!',
  array['Windows'],
  '2026-03-05',
  '/uploads/images/slay the spire 2.jpg',
  (SELECT id FROM game_engines WHERE name = 'Godot')
),
(
  'Subnautica 2',
  'A new world awaits in Subnautica 2, an underwater survival adventure game set on an entirely alien ocean planet.',
  array['Windows', 'Xbox'],
  NULL,
  '/uploads/images/subnautica 2.jpg',
  (SELECT id FROM game_engines WHERE name = 'Unreal Engine 5')
),
(
  'Dispatch',
  'A superhero workplace comedy where choices matter. Manage a dysfunctional team of misfit heroes and strategize who to send to emergencies around the city.',
  array['Windows', 'Nintendo Switch', 'PlayStation', 'Xbox'],
  '2025-10-22',
  '/uploads/images/dispatch.jpg',
  (SELECT id FROM game_engines WHERE name = 'Unreal Engine 5') 
);


-- ==========================================
-- 3. LINK RELATIONS (JOIN TABLES)
-- ==========================================

-- ELDEN RING
INSERT INTO games_genres (game_id, genre_id) SELECT g.id, ge.id FROM games g, genres ge WHERE g.title = 'Elden Ring' AND ge.name = 'Action role-playing (Action RPG)';
INSERT INTO games_genres (game_id, genre_id) SELECT g.id, ge.id FROM games g, genres ge WHERE g.title = 'Elden Ring' AND ge.name = 'Adventure';

INSERT INTO games_publishers (game_id, publisher_id) SELECT g.id, p.id FROM games g, publishers p WHERE g.title = 'Elden Ring' AND p.name = 'Bandai Namco Entertainment';
INSERT INTO games_developers (game_id, developer_id) SELECT g.id, d.id FROM games g, developers d WHERE g.title = 'Elden Ring' AND d.name = 'FromSoftware';

-- EXPEDITION 33
INSERT INTO games_genres (game_id, genre_id) SELECT g.id, ge.id FROM games g, genres ge WHERE g.title = 'Clair Obscur: Expedition 33' AND ge.name = 'Role-playing (RPG)';
INSERT INTO games_genres (game_id, genre_id) SELECT g.id, ge.id FROM games g, genres ge WHERE g.title = 'Clair Obscur: Expedition 33' AND ge.name = 'Turn-based strategy (TBS)';

INSERT INTO games_publishers (game_id, publisher_id) SELECT g.id, p.id FROM games g, publishers p WHERE g.title = 'Clair Obscur: Expedition 33' AND p.name = 'Kepler Interactive';
INSERT INTO games_developers (game_id, developer_id) SELECT g.id, d.id FROM games g, developers d WHERE g.title = 'Clair Obscur: Expedition 33' AND d.name = 'Sandfall Interactive';

-- PATH OF EXILE 2
INSERT INTO games_genres (game_id, genre_id) SELECT g.id, ge.id FROM games g, genres ge WHERE g.title = 'Path of Exile 2' AND ge.name = 'Action role-playing (Action RPG)';
INSERT INTO games_genres (game_id, genre_id) SELECT g.id, ge.id FROM games g, genres ge WHERE g.title = 'Path of Exile 2' AND ge.name = 'Hack and slash';

INSERT INTO games_publishers (game_id, publisher_id) SELECT g.id, p.id FROM games g, publishers p WHERE g.title = 'Path of Exile 2' AND p.name = 'Grinding Gear Games';
INSERT INTO games_developers (game_id, developer_id) SELECT g.id, d.id FROM games g, developers d WHERE g.title = 'Path of Exile 2' AND d.name = 'Grinding Gear Games';

-- SILKSONG
INSERT INTO games_genres (game_id, genre_id) SELECT g.id, ge.id FROM games g, genres ge WHERE g.title = 'Hollow Knight: Silksong' AND ge.name = 'Metroidvania';
INSERT INTO games_genres (game_id, genre_id) SELECT g.id, ge.id FROM games g, genres ge WHERE g.title = 'Hollow Knight: Silksong' AND ge.name = 'Action-adventure';

INSERT INTO games_publishers (game_id, publisher_id) SELECT g.id, p.id FROM games g, publishers p WHERE g.title = 'Hollow Knight: Silksong' AND p.name = 'Team Cherry';
INSERT INTO games_developers (game_id, developer_id) SELECT g.id, d.id FROM games g, developers d WHERE g.title = 'Hollow Knight: Silksong' AND d.name = 'Team Cherry';

-- SLAY THE SPIRE 2
INSERT INTO games_genres (game_id, genre_id) SELECT g.id, ge.id FROM games g, genres ge WHERE g.title = 'Slay the Spire 2' AND ge.name = 'Roguelike deck-building';
INSERT INTO games_genres (game_id, genre_id) SELECT g.id, ge.id FROM games g, genres ge WHERE g.title = 'Slay the Spire 2' AND ge.name = 'Strategy';

INSERT INTO games_publishers (game_id, publisher_id) SELECT g.id, p.id FROM games g, publishers p WHERE g.title = 'Slay the Spire 2' AND p.name = 'Mega Crit';
INSERT INTO games_developers (game_id, developer_id) SELECT g.id, d.id FROM games g, developers d WHERE g.title = 'Slay the Spire 2' AND d.name = 'Mega Crit';

-- SUBNAUTICA 2
INSERT INTO games_genres (game_id, genre_id) SELECT g.id, ge.id FROM games g, genres ge WHERE g.title = 'Subnautica 2' AND ge.name = 'Survival';
INSERT INTO games_genres (game_id, genre_id) SELECT g.id, ge.id FROM games g, genres ge WHERE g.title = 'Subnautica 2' AND ge.name = 'Adventure';

INSERT INTO games_publishers (game_id, publisher_id) SELECT g.id, p.id FROM games g, publishers p WHERE g.title = 'Subnautica 2' AND p.name = 'Krafton';
INSERT INTO games_developers (game_id, developer_id) SELECT g.id, d.id FROM games g, developers d WHERE g.title = 'Subnautica 2' AND d.name = 'Unknown Worlds Entertainment';

-- DISPATCH
INSERT INTO games_genres (game_id, genre_id) SELECT g.id, ge.id FROM games g, genres ge WHERE g.title = 'Dispatch' AND ge.name = 'Adventure';
INSERT INTO games_genres (game_id, genre_id) SELECT g.id, ge.id FROM games g, genres ge WHERE g.title = 'Dispatch' AND ge.name = 'Strategy';

INSERT INTO games_publishers (game_id, publisher_id) SELECT g.id, p.id FROM games g, publishers p WHERE g.title = 'Dispatch' AND p.name = 'AdHoc Studio';
INSERT INTO games_developers (game_id, developer_id) SELECT g.id, d.id FROM games g, developers d WHERE g.title = 'Dispatch' AND d.name = 'AdHoc Studio';

-- ==========================================
-- 4. ADD GAME METRICS 
-- ==========================================

INSERT INTO game_metrics (copies_sold, budget, revenue, game_id) VALUES 
(25000000, 200000000, 1500000000, (SELECT id FROM games WHERE title = 'Elden Ring'));
`;

async function main() {
  const client = new Client({
    connectionString: `postgresql://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.DB_PORT}/${process.env.DATABASE}`,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
}

main();
