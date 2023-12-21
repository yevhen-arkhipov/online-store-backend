const Router = require("express");
const router = new Router();
const deviceController = require("../controllers/deviceController");

router.get("/", deviceController.getAll);
router.get("/:id", deviceController.getById);
router.post("/", deviceController.create);
router.delete("/:id", deviceController.deleteById);

module.exports = router;
