const { body } = require("express-validator")
const query = require("../db/queries")

// On update, req.params.id is set so the category's own name doesn't count as a duplicate
const validateCategory = [
    body("title")
        .trim()
        .notEmpty().withMessage("Category name can't be empty.").bail()
        .matches(/^[A-Za-z]+$/).withMessage("Category name can only contain letters (A-Z, a-z).").bail()
        .isLength({ max: 255 }).withMessage("Category name must be 255 characters or fewer.").bail()
        .custom(async (title, { req }) => {
            if (await query.categoryExists(title, req.params.id ?? null)) {
                throw new Error("A category with that name already exists.")
            }
        }),
]

module.exports = { validateCategory }
