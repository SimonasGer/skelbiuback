const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);

router
    .use(authController.protect)
    .route("/:id")
    .get(authController.restrictTo("user", "admin"), authController.getUserById)
    .patch(authController.restrictTo("user", "admin"), authController.updateUser)
module.exports = router;