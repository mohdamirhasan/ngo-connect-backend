const express = require("express");
const { registerUser, loginUser, currentUser, logoutUser, updatePassword, deleteUser } = require("../controllers/userController");
const validateToken = require("../middlewares/validateToken");


const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.patch("/update", validateToken, updatePassword);

router.get("/current", validateToken, currentUser);

router.get("/logout", validateToken, logoutUser);

router.delete("/delete", validateToken, deleteUser);

module.exports = router;