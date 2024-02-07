const Router = require("express");
const router = new Router();
const brandController = require("../controllers/brandController");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");

router.get("/", brandController.getAll);
router.post("/", checkRoleMiddleware("ADMIN"), brandController.create);
router.delete("/:id", checkRoleMiddleware("ADMIN"), brandController.deleteById);

module.exports = router;
