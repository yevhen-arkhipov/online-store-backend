const Router = require("express");
const router = new Router();
const deviceController = require("../controllers/deviceController");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");

router.get("/", deviceController.getAll);
router.get("/:id", deviceController.getById);
router.post("/", checkRoleMiddleware("ADMIN"), deviceController.create);
router.delete(
  "/:id",
  checkRoleMiddleware("ADMIN"),
  deviceController.deleteById
);

module.exports = router;
