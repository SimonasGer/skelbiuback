const express = require("express");
const router = express.Router();
const dishController = require("../controllers/dishController");
const authController = require("../controllers/authController");

router.use(authController.protect); // padaro, kad visi routes butu apsaugoti nuo neprisijungusiu vartotoju
router
    .route("/")
    .get(authController.restrictTo("user", "admin"), dishController.getAllDishes)
    .post(authController.restrictTo("admin"), dishController.createDish);

router
    .route("/:id")
    .get(authController.restrictTo("user", "admin"), dishController.getDishById)
    .post(authController.restrictTo("user", "admin"), dishController.updateLikes)

router
    .route("/update/:id")
    .post(authController.restrictTo("admin"), dishController.updateDish)


module.exports = router;