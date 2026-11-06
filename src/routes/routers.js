const { Router } = require("express");
const controllers = require("../controllers/controllers");
const { requireAdmin } = require("../middleware/requireAdmin");
const usersRouter = Router();

usersRouter.get("/", controllers.getIndex);
usersRouter.get("/items/new", controllers.itemCreateGet);
usersRouter.post("/items/new", requireAdmin, controllers.itemCreatePost);
usersRouter.get("/items/:id", controllers.itemEditGet);
usersRouter.post("/items/:id/update", requireAdmin, controllers.itemEditPost);
// usersRouter.post("/items/:id/delete", requireAdmin, controllers.usersCreateGet);
usersRouter.get("/categories", controllers.getCategories);
usersRouter.post("/categories/create", requireAdmin, controllers.categoryCreate);
usersRouter.get("/categories/:id", controllers.getCategory);
usersRouter.post("/categories/:id/update", requireAdmin, controllers.categoryUpdate);
usersRouter.post("/categories/:id/delete", requireAdmin, controllers.categoryDelete);

module.exports = usersRouter;
