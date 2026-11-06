const pool = require("./pool");

async function getItem(id) {
  const { rows } = await pool.query("SELECT * FROM items WHERE id = $1", [id])
  return rows[0]
}

async function getFilterItems(props) {
  const { search, categories, minSupply, maxSupply, minCost, maxCost } = props 
  const filters = []
  const params = []

  const addFilter = (toSql, value) => {
    params.push(value)
    filters.push(toSql(`$${params.length}`))
  }

  if (search) addFilter((p) => `text ILIKE ${p}`, `%${search}%`)
  if (categories.length) addFilter((p) => `category = ANY(${p})`, categories)
  if (minSupply) addFilter((p) => `supply >= ${p}`, minSupply)
  if (maxSupply) addFilter((p) => `supply <= ${p}`, maxSupply)
  if (minCost) addFilter((p) => `cost >= ${p}`, minCost)
  if (maxCost) addFilter((p) => `cost <= ${p}`, maxCost)

  const { rows } = await pool.query(
    `SELECT * FROM items${filters.length > 0 ? ` WHERE ${filters.join(' AND ')}` : ''};`,
    params
  );
  return rows;
}

async function getItemsByCategory(categoryId) {
  const { rows } = await pool.query("SELECT * FROM items WHERE category = $1 ORDER BY text", [categoryId])
  return rows
}

async function postItem(text, description, cost, supply, img, category) {
  await pool.query("INSERT INTO items (text, description, cost, supply, img, category) VALUES ($1,$2,$3,$4,$5,$6);", [text, description, cost, supply, img, category])
}

async function updateItem(id, text, description, cost, supply, img, category) {
  await pool.query("UPDATE items SET text = $2, description = $3, cost = $4, supply = $5, img = $6, category = $7 WHERE id = $1;", [id, text, description, cost, supply, img, category])
}

async function deleteItem(id) {
  await pool.query("DELETE FROM items WHERE id = $1", [id])
}

async function getCategories(id = undefined) {
  const { rows } = id ? await pool.query("SELECT * FROM categories WHERE id = $1", [id]) : await pool.query("SELECT * FROM categories")
  return rows
}

async function searchCategories(search) {
  const { rows } = await pool.query(
    "SELECT * FROM categories WHERE text ILIKE $1",
    [`%${search}%`]
  );
  return rows;
}

async function postCategory(text) {
  await pool.query("INSERT INTO categories (text) VALUES ($1)", [text])
}

async function categoryExists(text, excludeId = null) {
  const { rows } = await pool.query(
    "SELECT 1 FROM categories WHERE LOWER(text) = LOWER($1) AND ($2::int IS NULL OR id <> $2)",
    [text, excludeId]
  );
  return rows.length > 0;
}

async function updateCategory(id, text) {
  await pool.query("UPDATE categories SET text = $2 WHERE id = $1;", [id,text])
}

async function deleteCategory(id) {
  await pool.query("UPDATE items SET category = NULL WHERE category = $1", [id])
  await pool.query("DELETE FROM categories WHERE id = $1", [id])
}

module.exports = {
  getItem,
  getFilterItems,
  getItemsByCategory,
  postItem,
  updateItem,
  deleteItem,
  getCategories,
  searchCategories,
  postCategory,
  categoryExists,
  updateCategory,
  deleteCategory
};
