const Router = require("express");
const router = new Router();
const typeController = require("../controllers/typeController");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");

router.get("/", typeController.getAll);
router.post("/", checkRoleMiddleware("ADMIN"), typeController.create);
router.delete("/:id", checkRoleMiddleware("ADMIN"), typeController.deleteById);

module.exports = router;
