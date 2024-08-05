// Import the required modules
const express = require("express");
const router = express.Router();

const { login, signUp, getAllUsers, createPost, updatePost, getAllQuotes, clearAllQuotes } = require("../controllers/Auth");

// User route

// Route for user login
router.post("/login", login);
router.post("/signup", signUp);
router.get("/all-users", getAllUsers);
router.post("/create-post" , createPost);
router.put("/update-post" , updatePost)
router.post("/all-quotes" , getAllQuotes)
router.delete("/delete-quotes" , clearAllQuotes)

module.exports = router;
