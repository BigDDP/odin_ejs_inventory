#! /usr/bin/env node

const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  text VARCHAR ( 255 ) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  text VARCHAR ( 255 ),
  description VARCHAR ( 2000 ),
  supply INTEGER,
  cost INTEGER,
  img VARCHAR ( 2000 ),
  category INTEGER REFERENCES categories(id) ON DELETE SET NULL
);

INSERT INTO categories (text)
VALUES
  ('Electronics'),
  ('Books'),
  ('Kitchen'),
  ('Outdoors')
ON CONFLICT (text) DO NOTHING;

INSERT INTO items (text, description, supply, img, category, cost)
SELECT v.text, v.description, v.supply, v.img, c.id, v.cost
FROM (
  VALUES
    ('Wireless Headphones', 'Noise-cancelling over-ear headphones.', 12, 'https://placehold.co/300x300?text=Headphones', 'Electronics', 200),
    ('USB-C Charger', '65W fast charger with braided cable.', 30, 'https://placehold.co/300x300?text=Charger', 'Electronics', 15),
    ('The Pragmatic Programmer', 'Classic book on software craftsmanship.', 8, 'https://placehold.co/300x300?text=Book', 'Books', 30),
    ('Dune', 'Frank Herbert''s sci-fi epic, paperback.', 5, 'https://placehold.co/300x300?text=Dune', 'Books', 40),
    ('Chef''s Knife', '8-inch stainless steel chef''s knife.', 15, 'https://placehold.co/300x300?text=Knife', 'Kitchen', 450),
    ('Cast Iron Skillet', 'Pre-seasoned 10-inch skillet.', 10, 'https://placehold.co/300x300?text=Skillet', 'Kitchen', 180),
    ('Camping Tent', 'Two-person waterproof tent.', 4, 'https://placehold.co/300x300?text=Tent', 'Outdoors', 90),
    ('Hiking Backpack', '40L backpack with rain cover.', 7, 'https://placehold.co/300x300?text=Backpack', 'Outdoors', 565)
) AS v (text, description, supply, img, category_text, cost)
JOIN categories c ON c.text = v.category_text;
`;

async function main() {
  console.log("seeding...");
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();