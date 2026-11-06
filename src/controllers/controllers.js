const query = require('../db/queries')
const { validationResult } = require('express-validator')
const { validateItem } = require('../validators/item')
const { validateCategory } = require('../validators/category')

const getIndex = async (req, res) => {
    const filters = {
        search: req.query.search?.trim() || "", 
        categories: [].concat(req.query.categories ?? [])
            .flatMap((c) => c.split(","))
            .filter(Boolean)
            .map(Number),
        minSupply: req.query.minSupply || "",
        maxSupply: req.query.maxSupply || "",
        minCost: req.query.minCost || "",
        maxCost: req.query.maxCost || "",
    }

    const [items, categories] = await Promise.all([
        query.getFilterItems(filters),
        query.getCategories()
    ])

    res.render("index", { items, categories, filters, query: req.query })
}

// First validation message, or null if the request is valid
const firstError = (req) => {
    const result = validationResult(req)
    return result.isEmpty() ? null : result.array()[0].msg
}

const categoryCreate = [
    validateCategory,
    async (req, res) => {
        const error = firstError(req)

        if (error) {
            const categories = await query.getCategories()
            return res.status(400).render('category', { categories, error })
        }

        await query.postCategory(req.body.title)
        res.redirect('/categories')
    }
]

const getCategories = async (req, res) => {
    const categories = await query.getCategories()

    res.render('category', { categories, error: null })
}

const getCategory = async (req, res) => {
    const [[category], items] = await Promise.all([
        query.getCategories(req.params.id),
        query.getItemsByCategory(req.params.id)
    ])

    if (!category) return res.status(404).send("Category not found")

    res.render('category-details', { category, items, error: null })
}

const categoryUpdate = [
    validateCategory,
    async (req, res) => {
        const id = req.params.id

        const [category] = await query.getCategories(id)
        if (!category) return res.status(404).send("Category not found")

        const error = firstError(req)

        if (error) {
            const items = await query.getItemsByCategory(id)
            return res.status(400).render('category-details', { category, items, error })
        }

        await query.updateCategory(id, req.body.title)
        res.redirect('/categories')
    }
]

const categoryDelete = async (req, res) => {
    await query.deleteCategory(req.params.id)
    res.redirect('/categories')
}

const emptyItem = { text: "", description: "", supply: "", cost: "", img: "", category: "" }

// Form strings -> DB values, in the order postItem/updateItem expect after the id
const itemFields = (v) => [
    v.text,
    v.description || null,
    Number(v.cost),
    Number(v.supply),
    v.img || null,
    v.category ? Number(v.category) : null
]

// Re-renders the form with errors if validation failed; returns true if it did
const renderItemErrors = async (req, res, item) => {
    const result = validationResult(req)
    if (result.isEmpty()) return false

    const categories = await query.getCategories()
    const values = { ...emptyItem, ...req.body }
    const errors = result.array().map((e) => e.msg)
    res.status(400).render('item-form', { item, categories, values, errors })
    return true
}

const itemCreateGet = async (req, res) => {
    const categories = await query.getCategories()
    res.render('item-form', { item: null, categories, values: emptyItem, errors: [] })
}

const itemCreatePost = [
    validateItem,
    async (req, res) => {
        if (await renderItemErrors(req, res, null)) return

        await query.postItem(...itemFields(req.body))
        res.redirect('/')
    }
]

const itemEditGet = async (req, res) => {
    const [item, categories] = await Promise.all([
        query.getItem(req.params.id),
        query.getCategories()
    ])
    if (!item) return res.status(404).send("Item not found")

    // Form inputs need strings; nulls become empty fields
    const values = Object.fromEntries(
        Object.keys(emptyItem).map((key) => [key, item[key] == null ? "" : String(item[key])])
    )
    res.render('item-form', { item, categories, values, errors: [] })
}

const itemEditPost = [
    validateItem,
    async (req, res) => {
        const item = await query.getItem(req.params.id)
        if (!item) return res.status(404).send("Item not found")

        if (await renderItemErrors(req, res, item)) return

        await query.updateItem(item.id, ...itemFields(req.body))
        res.redirect('/')
    }
]

module.exports = {
    itemCreateGet,
    itemCreatePost,
    itemEditGet,
    itemEditPost,
    getIndex,
    categoryCreate,
    getCategories,
    getCategory,
    categoryUpdate,
    categoryDelete
}