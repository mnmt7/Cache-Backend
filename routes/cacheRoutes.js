const express = require("express");

const router = express.Router();
const cacheController = require("../controllers/cacheController");

router.route("/").post(cacheController.store);
router.route("/:key").get(cacheController.get).delete(cacheController.delete);

module.exports = router;
