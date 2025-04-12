const express = require ("express");
const {signup, login} =require ("../controllers/userController.js");

const router = express.Router();

router.get("/login",login);
router.post("/signup",signup);

module.exports = router;