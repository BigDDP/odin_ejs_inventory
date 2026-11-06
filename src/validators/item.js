const { body } = require("express-validator")
const query = require("../db/queries")

const validateItem = [
    body("text")
        .trim()
        .notEmpty().withMessage("Name is required.").bail()
        .matches(/^[A-Za-z0-9() ]+$/).withMessage("Name can only contain letters, numbers, spaces and brackets ( ).")
        .isLength({ max: 255 }).withMessage("Name must be 255 characters or fewer."),

    body("description")
        .trim()
        .isLength({ max: 2000 }).withMessage("Description must be 2000 characters or fewer."),

    body("supply")
        .trim()
        .notEmpty().withMessage("Supply is required.").bail()
        .matches(/^\d+$/).withMessage("Supply can only contain digits (0-9).").bail()
        .isInt({ min: 0, max: 2147483647 }).withMessage("Supply must be a whole number of 0 or more."),

    body("cost")
        .trim()
        .notEmpty().withMessage("Cost is required.").bail()
        .matches(/^\d+$/).withMessage("Cost can only contain digits (0-9).").bail()
        .isInt({ min: 0, max: 2147483647 }).withMessage("Cost must be a whole number of 0 or more."),

    body("img")
        .trim()
        .optional({ values: "falsy" })
        .isURL({ protocols: ["http", "https"], require_protocol: true }).withMessage("Image must be a valid http(s) URL.")
        .isLength({ max: 2000 }).withMessage("Image URL must be 2000 characters or fewer."),

    body("category")
        .trim()
        .optional({ values: "falsy" })
        .isInt().withMessage("Please choose a valid category.").bail()
        .custom(async (id) => {
            const [category] = await query.getCategories(id)
            if (!category) throw new Error("Please choose a valid category.")
        }),
]

module.exports = { validateItem }
