const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const authController = require("../controllers/authController");

router.use(authController.protect); // padaro, kad visi routes butu apsaugoti nuo neprisijungusiu vartotoju
router
    .route("/")
    .get(authController.restrictTo("user", "admin"), commentController.getComments)
    .post(authController.restrictTo("admin", "user"), commentController.createComment);

router
    .route("/:id")
    .post(authController.restrictTo("user", "admin"), commentController.updateLikes)

router
    .route("/update/:id")
    .post(authController.restrictTo("admin", "user"), commentController.updateComment)


module.exports = router;