import dotenv from "dotenv";
import { Client } from "pg";

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
values ('Disco Elysium', 'A CRPG in which, waking up in a hotel room a total amnesiac with highly opinionated voices in his head, a middle-aged detective on a murder case inadvertently ends up playing a part in the political dispute between a local labour union and a larger international body, all while struggling to piece together his past, diagnose the nature of the reality around him and come to terms with said reality.', array['Mac', 'PC'], ('2019-10-15'), '/uploads/images/disco elysium.jpg', (select id from game_engines where name='Unity'));

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
`;

async function main() {
  const client = new Client({
    connectionString: `postgresql://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.DB_PORT}/${process.env.DATABASE}`
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
}

main();
