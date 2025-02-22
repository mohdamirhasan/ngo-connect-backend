const express = require("express");
const { createPost, allPosts, deletePost } = require("../controllers/postController");
const validateToken = require("../middlewares/validateToken");
const upload = require("../middlewares/imagedb");

const router = express.Router();

router.post("/create", upload.single("image"), validateToken, createPost);

router.get("/all-posts", allPosts);

router.patch("/:id/delete", validateToken, deletePost);

module.exports = router;