const { Client } = require("pg");

// Workers can't reuse a connection across requests, so open one per query
async function query(text, params) {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    return await client.query(text, params);
  } finally {
    await client.end();
  }
}

module.exports = { query };
