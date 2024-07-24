const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);

router
    .use(authController.protect)
    .route("/:id")
    .patch(authController.restrictTo("user"), authController.updateUser)
module.exports = router;