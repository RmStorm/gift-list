CREATE TABLE IF NOT EXISTS gifts (
	id serial  NOT NULL primary key,
    modified_at timestamptz  NOT NULL DEFAULT now(),
	name Text NOT NULL,
	description Text,
	desired_amount int NOT NULL,
	urls text[] NOT NULL,
	image_url text
);